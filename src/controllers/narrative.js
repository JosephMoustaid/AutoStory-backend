const { generateText } = require('../services/geminiAPI');
const VehicleStory = require('../models/VehicleStory');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Generate narrative from vehicle technical data
// @route   POST /api/v1/narrative/generate/:vehicleId
// @access  Private
exports.generateNarrative = asyncHandler(async (req, res, next) => {
  const { tone, targetAudience, language, includeComparisons } = req.body;

  const vehicleStory = await VehicleStory.findById(req.params.vehicleId);

  if (!vehicleStory) {
    return next(
      new ErrorResponse(`Vehicle story not found with id of ${req.params.vehicleId}`, 404)
    );
  }

  // Check authorization
  if (vehicleStory.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to generate narrative for this vehicle`, 401)
    );
  }

  // Update status
  vehicleStory.processing.status = 'generating-narrative';
  vehicleStory.processing.progress = 30;
  vehicleStory.processing.currentStep = 'Generating storytelling narrative...';
  await vehicleStory.save();

  try {
    const vehicleData = vehicleStory.technicalData;
    const fullName = `${vehicleStory.year} ${vehicleStory.manufacturer} ${vehicleStory.model}`;

    // Generate Introduction Chapter
    const introPrompt = buildIntroPrompt(fullName, vehicleData, tone || 'professional', targetAudience || 'buyers');
    const introText = await generateText(introPrompt, 500, 0.7);

    // Generate chapters for different aspects
    const chapters = [];
    const aspects = ['performance', 'safety', 'technology', 'design'];

    for (const aspect of aspects) {
      const chapterPrompt = buildChapterPrompt(fullName, vehicleData, aspect, tone || 'professional', includeComparisons);
      const chapterText = await generateText(chapterPrompt, 600, 0.7);

      chapters.push({
        title: getChapterTitle(aspect),
        content: String(chapterText).trim(),
        category: aspect,
        order: chapters.length + 1,
        keyPoints: extractKeyPoints(vehicleData, aspect)
      });
    }

    // Generate Summary
    const summaryPrompt = `Summarize the key selling points of the ${fullName} in 2-3 compelling sentences:`;
    const summaryText = await generateText(summaryPrompt, 150, 0.6);

    // Update vehicle story with narrative
    vehicleStory.narrative = {
      introChapter: {
        title: 'Introduction',
        content: String(introText).trim(),
        tone: tone || 'professional'
      },
      chapters: chapters,
      summary: String(summaryText).trim(),
      language: language || 'en'
    };

    vehicleStory.storyConfig.tone = tone || 'professional';
    vehicleStory.storyConfig.targetAudience = targetAudience || 'buyers';
    vehicleStory.processing.status = 'generating-media';
    vehicleStory.processing.progress = 60;
    vehicleStory.processing.currentStep = 'Narrative generated successfully';
    vehicleStory.processing.completedSteps.push('narrative-generation');

    await vehicleStory.save();

    res.status(200).json({
      success: true,
      message: 'Narrative generated successfully',
      data: vehicleStory
    });

  } catch (error) {
    console.error('Narrative Generation Error:', error);
    vehicleStory.processing.status = 'error';
    vehicleStory.processing.errorMessage = 'Failed to generate narrative';
    await vehicleStory.save();
    return next(new ErrorResponse('Error generating narrative. Please check your Gemini API key.', 500));
  }
});

// @desc    Regenerate specific chapter
// @route   POST /api/v1/narrative/:vehicleId/regenerate-chapter
// @access  Private
exports.regenerateChapter = asyncHandler(async (req, res, next) => {
  const { chapterIndex, tone } = req.body;

  const vehicleStory = await VehicleStory.findById(req.params.vehicleId);

  if (!vehicleStory) {
    return next(
      new ErrorResponse(`Vehicle story not found with id of ${req.params.vehicleId}`, 404)
    );
  }

  if (!vehicleStory.narrative || !vehicleStory.narrative.chapters[chapterIndex]) {
    return next(new ErrorResponse('Chapter not found', 404));
  }

  try {
    const chapter = vehicleStory.narrative.chapters[chapterIndex];
    const fullName = `${vehicleStory.year} ${vehicleStory.manufacturer} ${vehicleStory.model}`;
    
    const chapterPrompt = buildChapterPrompt(
      fullName,
      vehicleStory.technicalData,
      chapter.category,
      tone || vehicleStory.storyConfig.tone,
      vehicleStory.storyConfig.includeComparisons
    );

    const response = await hf.textGeneration({
      model: MODEL_NAME,
      inputs: chapterPrompt,
      parameters: {
        max_new_tokens: 600,
        temperature: 0.8,
        top_p: 0.9,
        return_full_text: false
      }
    });

    vehicleStory.narrative.chapters[chapterIndex].content = response.generated_text.trim();
    await vehicleStory.save();

    res.status(200).json({
      success: true,
      data: vehicleStory.narrative.chapters[chapterIndex]
    });

  } catch (error) {
    console.error('Chapter Regeneration Error:', error);
    return next(new ErrorResponse('Error regenerating chapter', 500));
  }
});

// Helper Functions

function buildIntroPrompt(vehicleName, data, tone, audience) {
  const toneMap = {
    professional: 'professional and informative',
    emotional: 'engaging and emotional',
    technical: 'highly technical and detailed',
    casual: 'friendly and conversational'
  };

  return `Write an engaging introduction for the ${vehicleName} in a ${toneMap[tone]} tone, targeting ${audience}. 
Highlight: ${data.engine?.type || 'advanced engine'}, ${data.performance?.horsepower || 'powerful performance'} HP, and ${data.battery?.range || data.performance?.fuelEconomy?.combined || 'efficient'} range/economy.

Introduction:`;
}

function buildChapterPrompt(vehicleName, data, aspect, tone, includeComparisons) {
  let prompt = `Write a detailed ${aspect} chapter for the ${vehicleName} in a ${tone} tone.\n\n`;

  switch (aspect) {
    case 'performance':
      prompt += `Focus on: ${data.engine?.horsepower || 'N/A'} HP, ${data.performance?.acceleration0to60 || 'N/A'} sec 0-60 mph, ${data.performance?.topSpeed || 'N/A'} km/h top speed.\n`;
      break;
    case 'safety':
      prompt += `Focus on: ${data.safety?.crashTestRating || 'N/A'} star rating, ${data.safety?.airbags || 'N/A'} airbags, ADAS features like ${data.safety?.adas?.join(', ') || 'standard safety'}.\n`;
      break;
    case 'technology':
      prompt += `Focus on: ${data.features?.infotainmentSystem || 'advanced infotainment'}, ${data.features?.screenSize || 'N/A'}" screen, connectivity: ${data.features?.connectivity?.join(', ') || 'modern connectivity'}.\n`;
      break;
    case 'design':
      prompt += `Focus on: dimensions ${data.dimensions?.length || 'N/A'}mm length, ${data.features?.seatingCapacity || 'N/A'} seats, ${data.features?.trunkSpace || 'N/A'}L trunk.\n`;
      break;
  }

  if (includeComparisons) {
    prompt += `Include real-life comparisons to make technical specs relatable.\n`;
  }

  prompt += `\nChapter:`;
  return prompt;
}

function getChapterTitle(aspect) {
  const titles = {
    performance: 'Performance & Driving Dynamics',
    safety: 'Safety & Driver Assistance',
    technology: 'Technology & Connectivity',
    design: 'Design & Comfort'
  };
  return titles[aspect] || aspect;
}

function extractKeyPoints(data, aspect) {
  const points = [];
  
  switch (aspect) {
    case 'performance':
      if (data.engine?.horsepower) points.push(`${data.engine.horsepower} HP`);
      if (data.performance?.acceleration0to60) points.push(`0-60 in ${data.performance.acceleration0to60}s`);
      if (data.performance?.topSpeed) points.push(`Top speed: ${data.performance.topSpeed} km/h`);
      break;
    case 'safety':
      if (data.safety?.crashTestRating) points.push(`${data.safety.crashTestRating}-star safety rating`);
      if (data.safety?.airbags) points.push(`${data.safety.airbags} airbags`);
      if (data.safety?.adas) points.push(...data.safety.adas);
      break;
    case 'technology':
      if (data.features?.infotainmentSystem) points.push(data.features.infotainmentSystem);
      if (data.features?.connectivity) points.push(...data.features.connectivity);
      break;
    case 'design':
      if (data.features?.seatingCapacity) points.push(`${data.features.seatingCapacity} seats`);
      if (data.features?.trunkSpace) points.push(`${data.features.trunkSpace}L trunk`);
      break;
  }
  
  return points.slice(0, 5);
}

module.exports = exports;
