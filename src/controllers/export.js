const VehicleStory = require('../models/VehicleStory');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const videoGenerator = require('../services/videoGenerator'); // Puppeteer-based (works now!)
const geminiVideoGenerator = require('../services/geminiVideoGenerator'); // Needs external API
const path = require('path');
const fs = require('fs').promises;

// @desc    Export vehicle story as PDF
// @route   POST /api/v1/export/:vehicleId/pdf
// @access  Private
exports.exportAsPDF = asyncHandler(async (req, res, next) => {
  // Find story by vehicle ID (not by story ID)
  const vehicleStory = await VehicleStory.findOne({ vehicleId: req.params.vehicleId });

  if (!vehicleStory) {
    return next(
      new ErrorResponse(`Vehicle story not found with id of ${req.params.vehicleId}`, 404)
    );
  }

  // Check authorization
  if (vehicleStory.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized`, 401)
    );
  }

  // In production, integrate with:
  // - Puppeteer for HTML to PDF
  // - PDFKit for programmatic PDF generation
  // - LaTeX for professional documentation

  const exportRecord = {
    format: 'pdf',
    exportedAt: Date.now(),
    fileUrl: `/exports/${vehicleStory.vehicleId}_story.pdf`,
    fileSize: 2500000 // bytes
  };

  vehicleStory.exports.push(exportRecord);
  vehicleStory.statistics.downloads += 1;
  await vehicleStory.save();

  res.status(200).json({
    success: true,
    message: 'PDF export ready',
    data: exportRecord
  });
});

// @desc    Export as marketing deck (PPTX)
// @route   POST /api/v1/export/:vehicleId/deck
// @access  Private
exports.exportAsMarketingDeck = asyncHandler(async (req, res, next) => {
  const vehicleStory = await VehicleStory.findById(req.params.vehicleId);

  if (!vehicleStory) {
    return next(
      new ErrorResponse(`Vehicle story not found with id of ${req.params.vehicleId}`, 404)
    );
  }

  // Check authorization
  if (vehicleStory.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized`, 401)
    );
  }

  // In production, integrate with PptxGenJS or similar
  const exportRecord = {
    format: 'pptx',
    exportedAt: Date.now(),
    fileUrl: `/exports/${vehicleStory.vehicleId}_deck.pptx`,
    fileSize: 5000000
  };

  vehicleStory.exports.push(exportRecord);
  vehicleStory.statistics.downloads += 1;
  await vehicleStory.save();

  res.status(200).json({
    success: true,
    message: 'Marketing deck export ready',
    data: exportRecord
  });
});

// @desc    Export as video montage
// @route   POST /api/v1/export/:vehicleId/video
// @access  Private
exports.exportAsVideo = asyncHandler(async (req, res, next) => {
  const { duration, resolution, includeNarration } = req.body;

  const vehicleStory = await VehicleStory.findById(req.params.vehicleId);

  if (!vehicleStory) {
    return next(
      new ErrorResponse(`Vehicle story not found with id of ${req.params.vehicleId}`, 404)
    );
  }

  // Check authorization
  if (vehicleStory.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized`, 401)
    );
  }

  try {
    // Check if user wants AI-generated videos (uses Gemini Vision)
    const useAIGeneration = req.body.useAI === true || req.query.useAI === 'true';
    
    let videoData;
    
    if (useAIGeneration) {
      // Option 1: Gemini AI-Generated Videos (analyzes real car images)
      console.log('🎬 Generating AI commercial with Gemini Vision...');
      console.log('⏱️  This will take 20-30 seconds...');
      videoData = await geminiVideoGenerator.generateCommercialVideo(vehicleStory);
    } else {
      // Option 2: Animated Canvas Videos (Works immediately)
      console.log('🎬 Generating animated commercial video...');
      videoData = await videoGenerator.generateVideo(vehicleStory, {
        resolution: resolution || '1920x1080',
        includeNarration: includeNarration !== false
      });
    }

    // Save export record
    const exportRecord = {
      format: videoData.format || 'webm',
      exportedAt: Date.now(),
      fileUrl: videoData.url,
      fileSize: videoData.size
    };

    vehicleStory.exports.push(exportRecord);
    vehicleStory.statistics.downloads += 1;
    await vehicleStory.save();

    res.status(200).json({
      success: true,
      message: useAIGeneration 
        ? 'AI commercial video generated successfully' 
        : 'Animated commercial video generated successfully',
      data: {
        ...exportRecord,
        filename: videoData.filename,
        duration: videoData.duration,
        clips: videoData.clips,
        resolution: videoData.resolution,
        generationTime: videoData.generationTime,
        type: useAIGeneration ? 'ai-generated' : 'animated'
      }
    });
  } catch (error) {
    console.error('Video export error:', error);
    return next(
      new ErrorResponse(`Video generation failed: ${error.message}`, 500)
    );
  }
});

// @desc    Generate shareable web link
// @route   POST /api/v1/export/:vehicleId/weblink
// @access  Private
exports.generateWebLink = asyncHandler(async (req, res, next) => {
  const vehicleStory = await VehicleStory.findById(req.params.vehicleId);

  if (!vehicleStory) {
    return next(
      new ErrorResponse(`Vehicle story not found with id of ${req.params.vehicleId}`, 404)
    );
  }

  // Check authorization
  if (vehicleStory.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized`, 401)
    );
  }

  // Make story public and generate shareable link
  vehicleStory.isPublic = true;
  await vehicleStory.save();

  const shareableLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/story/${vehicleStory._id}`;

  res.status(200).json({
    success: true,
    message: 'Shareable link generated',
    data: {
      link: shareableLink,
      qrCode: `${process.env.API_URL}/qr/${vehicleStory._id}`,
      embedCode: `<iframe src="${shareableLink}/embed" width="100%" height="600"></iframe>`
    }
  });
});

// @desc    Get all exports for a vehicle
// @route   GET /api/v1/export/:vehicleId
// @access  Private
exports.getExportHistory = asyncHandler(async (req, res, next) => {
  const vehicleStory = await VehicleStory.findById(req.params.vehicleId);

  if (!vehicleStory) {
    return next(
      new ErrorResponse(`Vehicle story not found with id of ${req.params.vehicleId}`, 404)
    );
  }

  // Check authorization
  if (vehicleStory.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized`, 401)
    );
  }

  res.status(200).json({
    success: true,
    count: vehicleStory.exports.length,
    data: vehicleStory.exports
  });
});

module.exports = exports;
