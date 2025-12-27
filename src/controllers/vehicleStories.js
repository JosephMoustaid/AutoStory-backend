const VehicleStory = require('../models/VehicleStory');
const Vehicle = require('../models/Vehicle');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { generateNarrative } = require('../services/narrativeEngine');
const { generateVisuals } = require('../services/visualGenerator');
const videoGenerator = require('../services/videoGenerator');

// @desc    Generate vehicle story
// @route   POST /api/v1/stories/generate
// @access  Private
exports.generateStory = asyncHandler(async (req, res, next) => {
  const { vehicleId, tone, language, chapters, includeVisuals } = req.body;

  if (!vehicleId) {
    return next(new ErrorResponse('Please provide a vehicle ID', 400));
  }

  const vehicle = await Vehicle.findById(vehicleId);

  if (!vehicle) {
    return next(new ErrorResponse(`Vehicle not found with id of ${vehicleId}`, 404));
  }

  try {
    // Generate narrative using AI
    const narrative = await generateNarrative({
      vehicle,
      tone: tone || 'professional',
      language: language || 'en',
      chapters: chapters || ['overview', 'performance', 'technology', 'safety', 'experience']
    });

    // Determine vehicle type from tags or make assumptions
    let vehicleType = 'sedan'; // default
    if (vehicle.tags) {
      const tagLower = vehicle.tags.map(t => t.toLowerCase());
      if (tagLower.includes('suv')) vehicleType = 'suv';
      else if (tagLower.includes('truck')) vehicleType = 'truck';
      else if (tagLower.includes('sports')) vehicleType = 'sports';
      else if (tagLower.includes('electric')) vehicleType = 'electric';
      else if (tagLower.includes('hybrid')) vehicleType = 'hybrid';
      else if (tagLower.includes('luxury')) vehicleType = 'luxury';
      else if (tagLower.includes('compact')) vehicleType = 'compact';
      else if (tagLower.includes('convertible')) vehicleType = 'convertible';
    }

    // Create story with all required fields
    const story = await VehicleStory.create({
      vehicle: vehicleId,
      vehicleId: vehicleId,
      manufacturer: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      vehicleType: vehicleType,
      author: req.user.id,
      title: narrative.title,
      subtitle: narrative.subtitle,
      narrative: {
        title: narrative.title,
        subtitle: narrative.subtitle,
        chapters: narrative.chapters
      },
      chapters: narrative.chapters,
      tone,
      language,
      targetAudience: req.body.targetAudience || 'general',
      status: 'draft'
    });

    // Generate visuals if requested
    if (includeVisuals) {
      const visuals = await generateVisuals(vehicle, story);
      story.mediaAssets = visuals;
      await story.save();
    }

    res.status(201).json({
      success: true,
      data: story
    });
  } catch (error) {
    console.error('Story Generation Error:', error);
    return next(new ErrorResponse('Error generating story. Check if Gemini API key is configured.', 500));
  }
});

// @desc    Get all vehicle stories
// @route   GET /api/v1/stories
// @access  Public
exports.getStories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single story
// @route   GET /api/v1/stories/:id
// @access  Public
exports.getStory = asyncHandler(async (req, res, next) => {
  const story = await VehicleStory.findById(req.params.id)
    .populate('author', 'name email');

  if (!story) {
    return next(
      new ErrorResponse(`Story not found with id of ${req.params.id}`, 404)
    );
  }

  // Increment view count (use statistics.views, not analytics.views)
  if (!story.statistics) {
    story.statistics = { views: 0, shares: 0, downloads: 0 };
  }
  story.statistics.views += 1;
  await story.save();

  res.status(200).json({
    success: true,
    data: story
  });
});

// @desc    Update story
// @route   PUT /api/v1/stories/:id
// @access  Private
exports.updateStory = asyncHandler(async (req, res, next) => {
  let story = await VehicleStory.findById(req.params.id);

  if (!story) {
    return next(
      new ErrorResponse(`Story not found with id of ${req.params.id}`, 404)
    );
  }

  // Check ownership
  if (story.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this story`, 401)
    );
  }

  story = await VehicleStory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: story
  });
});

// @desc    Delete story
// @route   DELETE /api/v1/stories/:id
// @access  Private
exports.deleteStory = asyncHandler(async (req, res, next) => {
  const story = await VehicleStory.findById(req.params.id);

  if (!story) {
    return next(
      new ErrorResponse(`Story not found with id of ${req.params.id}`, 404)
    );
  }

  // Check ownership
  if (story.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete this story`, 401)
    );
  }

  await story.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Publish story
// @route   PUT /api/v1/stories/:id/publish
// @access  Private
exports.publishStory = asyncHandler(async (req, res, next) => {
  const story = await VehicleStory.findById(req.params.id);

  if (!story) {
    return next(
      new ErrorResponse(`Story not found with id of ${req.params.id}`, 404)
    );
  }

  // Check ownership
  if (story.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to publish this story`, 401)
    );
  }

  story.status = 'published';
  story.publishedAt = Date.now();
  await story.save();

  res.status(200).json({
    success: true,
    data: story
  });
});

// @desc    Export story
// @route   GET /api/v1/stories/:id/export/:format
// @access  Private
exports.exportStory = asyncHandler(async (req, res, next) => {
  const { format } = req.params;
  const story = await VehicleStory.findById(req.params.id);

  if (!story) {
    return next(
      new ErrorResponse(`Story not found with id of ${req.params.id}`, 404)
    );
  }

  const allowedFormats = ['pdf', 'html', 'markdown', 'video', 'json'];
  if (!allowedFormats.includes(format)) {
    return next(new ErrorResponse('Invalid export format', 400));
  }

  try {
    let exportData;

    switch (format) {
      case 'json':
        exportData = story.toJSON();
        break;
      case 'markdown':
        exportData = convertToMarkdown(story);
        break;
      case 'html':
        exportData = convertToHTML(story);
        break;
      case 'pdf':
        exportData = { message: 'PDF generation coming soon', story: story.title };
        break;
      case 'video':
        exportData = await videoGenerator.generateVideo(story);
        break;
    }

    res.status(200).json({
      success: true,
      format,
      data: exportData
    });
  } catch (error) {
    console.error('Export Error:', error);
    return next(new ErrorResponse('Error exporting story', 500));
  }
});

// Helper functions
function convertToMarkdown(story) {
  let md = `# ${story.title}\n\n`;
  md += `${story.subtitle}\n\n`;
  
  story.chapters.forEach(chapter => {
    md += `## ${chapter.title}\n\n`;
    md += `${chapter.content}\n\n`;
    
    if (chapter.technicalHighlights && chapter.technicalHighlights.length > 0) {
      md += `### Technical Highlights\n\n`;
      chapter.technicalHighlights.forEach(highlight => {
        md += `- **${highlight.title}**: ${highlight.description}\n`;
      });
      md += `\n`;
    }
  });

  return md;
}

function convertToHTML(story) {
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${story.title}</title></head><body>`;
  html += `<h1>${story.title}</h1>`;
  html += `<p class="subtitle">${story.subtitle}</p>`;
  
  story.chapters.forEach(chapter => {
    html += `<section><h2>${chapter.title}</h2>`;
    html += `<p>${chapter.content}</p>`;
    html += `</section>`;
  });

  html += `</body></html>`;
  return html;
}
