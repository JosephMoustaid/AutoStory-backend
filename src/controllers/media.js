const VehicleStory = require('../models/VehicleStory');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Generate infographics for vehicle
// @route   POST /api/v1/media/:vehicleId/infographics
// @access  Private
exports.generateInfographics = asyncHandler(async (req, res, next) => {
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

  // Generate Lottie/animated infographics
  // This would integrate with services like Lottie or custom animation generation
  const infographics = [
    {
      url: `/infographics/${vehicleStory.vehicleId}_performance.json`,
      title: 'Performance Overview',
      format: 'lottie'
    },
    {
      url: `/infographics/${vehicleStory.vehicleId}_safety.json`,
      title: 'Safety Features',
      format: 'lottie'
    },
    {
      url: `/infographics/${vehicleStory.vehicleId}_specs.png`,
      title: 'Technical Specifications',
      format: 'static'
    }
  ];

  vehicleStory.media.infographics = infographics;
  vehicleStory.processing.completedSteps.push('infographics-generation');
  await vehicleStory.save();

  res.status(200).json({
    success: true,
    message: 'Infographics generated successfully',
    data: infographics
  });
});

// @desc    Generate video clips for vehicle features
// @route   POST /api/v1/media/:vehicleId/videos
// @access  Private
exports.generateVideoClips = asyncHandler(async (req, res, next) => {
  const { features } = req.body; // Array of features to generate videos for

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

  // In production, this would integrate with:
  // - Pika AI for video generation
  // - Runway ML
  // - Or other video generation APIs
  
  const videos = [];
  const featuresToGenerate = features || ['performance', 'safety', 'technology'];

  for (const feature of featuresToGenerate) {
    videos.push({
      url: `/videos/${vehicleStory.vehicleId}_${feature}.mp4`,
      title: `${feature.charAt(0).toUpperCase() + feature.slice(1)} Showcase`,
      duration: 15,
      type: 'feature-explainer'
    });
  }

  vehicleStory.media.videos = videos;
  vehicleStory.processing.completedSteps.push('video-generation');
  await vehicleStory.save();

  res.status(200).json({
    success: true,
    message: 'Video clips generation initiated',
    data: videos
  });
});

// @desc    Generate 3D model visualization
// @route   POST /api/v1/media/:vehicleId/3d-model
// @access  Private
exports.generate3DModel = asyncHandler(async (req, res, next) => {
  const { interactiveFeatures } = req.body;

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

  // In production, this would integrate with Three.js/A-Frame asset generation
  vehicleStory.media.threeDModel = {
    modelUrl: `/models/${vehicleStory.vehicleId}.glb`,
    textureUrls: [
      `/textures/${vehicleStory.vehicleId}_exterior.jpg`,
      `/textures/${vehicleStory.vehicleId}_interior.jpg`
    ],
    interactiveFeatures: interactiveFeatures || [
      'rotate-view',
      'exploded-view',
      'abs-visualization',
      'aerodynamics-flow',
      'battery-layout'
    ]
  };

  vehicleStory.processing.completedSteps.push('3d-model-generation');
  await vehicleStory.save();

  res.status(200).json({
    success: true,
    message: '3D model configuration saved',
    data: vehicleStory.media.threeDModel
  });
});

// @desc    Generate voice-over narration
// @route   POST /api/v1/media/:vehicleId/narration
// @access  Private
exports.generateNarration = asyncHandler(async (req, res, next) => {
  const { voiceType, includeBackgroundMusic } = req.body;

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

  if (!vehicleStory.narrative || !vehicleStory.narrative.chapters.length) {
    return next(
      new ErrorResponse('Please generate narrative first before creating narration', 400)
    );
  }

  // In production, integrate with TTS services like:
  // - ElevenLabs
  // - Google Text-to-Speech
  // - Amazon Polly
  // - Azure Speech Services

  vehicleStory.media.audio = {
    narrationUrl: `/audio/${vehicleStory.vehicleId}_narration.mp3`,
    backgroundMusicUrl: includeBackgroundMusic ? `/audio/${vehicleStory.vehicleId}_bgm.mp3` : null,
    voiceType: voiceType || 'professional-male'
  };

  vehicleStory.storyConfig.includeVoiceOver = true;
  vehicleStory.processing.completedSteps.push('narration-generation');
  await vehicleStory.save();

  res.status(200).json({
    success: true,
    message: 'Voice narration generation initiated',
    data: vehicleStory.media.audio
  });
});

// @desc    Complete all media generation
// @route   POST /api/v1/media/:vehicleId/generate-all
// @access  Private
exports.generateAllMedia = asyncHandler(async (req, res, next) => {
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

  // Update status
  vehicleStory.processing.status = 'generating-media';
  vehicleStory.processing.progress = 70;
  vehicleStory.processing.currentStep = 'Generating all media assets...';
  await vehicleStory.save();

  // In a real implementation, this would trigger background jobs
  // For now, we'll mark as completed with placeholder URLs

  vehicleStory.media = {
    coverImage: `/images/${vehicleStory.vehicleId}_cover.jpg`,
    images: [
      `/images/${vehicleStory.vehicleId}_front.jpg`,
      `/images/${vehicleStory.vehicleId}_side.jpg`,
      `/images/${vehicleStory.vehicleId}_interior.jpg`,
      `/images/${vehicleStory.vehicleId}_rear.jpg`
    ],
    videos: [
      {
        url: `/videos/${vehicleStory.vehicleId}_full_story.mp4`,
        title: 'Complete Vehicle Story',
        duration: 60,
        type: 'full-story'
      },
      {
        url: `/videos/${vehicleStory.vehicleId}_highlights.mp4`,
        title: 'Feature Highlights',
        duration: 20,
        type: 'highlight'
      }
    ],
    infographics: [
      {
        url: `/infographics/${vehicleStory.vehicleId}_performance.json`,
        title: 'Performance Metrics',
        format: 'lottie'
      },
      {
        url: `/infographics/${vehicleStory.vehicleId}_safety.json`,
        title: 'Safety Features',
        format: 'lottie'
      }
    ],
    audio: {
      narrationUrl: `/audio/${vehicleStory.vehicleId}_narration.mp3`,
      backgroundMusicUrl: `/audio/${vehicleStory.vehicleId}_bgm.mp3`,
      voiceType: 'professional-male'
    },
    threeDModel: {
      modelUrl: `/models/${vehicleStory.vehicleId}.glb`,
      textureUrls: [
        `/textures/${vehicleStory.vehicleId}_exterior.jpg`,
        `/textures/${vehicleStory.vehicleId}_interior.jpg`
      ],
      interactiveFeatures: [
        'rotate-view',
        'exploded-view',
        'abs-visualization',
        'aerodynamics-flow'
      ]
    }
  };

  vehicleStory.processing.status = 'completed';
  vehicleStory.processing.progress = 100;
  vehicleStory.processing.currentStep = 'All media generated successfully';
  vehicleStory.processing.completedSteps.push('all-media-generation');
  
  await vehicleStory.save();

  res.status(200).json({
    success: true,
    message: 'All media assets generated successfully',
    data: vehicleStory
  });
});

// @desc    Get media assets for a vehicle
// @route   GET /api/v1/media/:vehicleId
// @access  Public
exports.getMediaAssets = asyncHandler(async (req, res, next) => {
  const vehicleStory = await VehicleStory.findById(req.params.vehicleId);

  if (!vehicleStory) {
    return next(
      new ErrorResponse(`Vehicle story not found with id of ${req.params.vehicleId}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: vehicleStory.media
  });
});

module.exports = exports;
