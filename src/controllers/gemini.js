const geminiService = require('../services/geminiService');
const carDatasetService = require('../services/carDatasetService');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Generate text with Gemini
 * @route   POST /api/v1/gemini/generate
 * @access  Private
 */
exports.generateText = asyncHandler(async (req, res, next) => {
  const { prompt, temperature, maxTokens, model } = req.body;

  if (!prompt) {
    return next(new ErrorResponse('Please provide a prompt', 400));
  }

  const text = await geminiService.generateText(prompt, {
    temperature,
    maxTokens,
    model
  });

  res.status(200).json({
    success: true,
    data: {
      text,
      model: geminiService.defaultModel,
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * @desc    Generate text with streaming
 * @route   POST /api/v1/gemini/stream
 * @access  Private
 */
exports.generateStream = asyncHandler(async (req, res, next) => {
  const { prompt, temperature, maxTokens } = req.body;

  if (!prompt) {
    return next(new ErrorResponse('Please provide a prompt', 400));
  }

  // Set headers for streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    for await (const chunk of geminiService.generateStreamText(prompt, {
      temperature,
      maxTokens
    })) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

/**
 * @desc    Chat with Gemini (conversational)
 * @route   POST /api/v1/gemini/chat
 * @access  Private
 */
exports.chat = asyncHandler(async (req, res, next) => {
  const { message, sessionId, history } = req.body;

  if (!message) {
    return next(new ErrorResponse('Please provide a message', 400));
  }

  const chatSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const response = await geminiService.chat(chatSessionId, message, history);

  res.status(200).json({
    success: true,
    data: {
      response,
      sessionId: chatSessionId,
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * @desc    Clear chat session
 * @route   DELETE /api/v1/gemini/chat/:sessionId
 * @access  Private
 */
exports.clearChatSession = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.params;

  const cleared = geminiService.clearChatSession(sessionId);

  res.status(200).json({
    success: true,
    data: {
      cleared,
      message: cleared ? 'Session cleared successfully' : 'Session not found'
    }
  });
});

/**
 * @desc    Analyze car image with Gemini Vision
 * @route   POST /api/v1/gemini/analyze-image
 * @access  Private
 */
exports.analyzeImage = asyncHandler(async (req, res, next) => {
  const { imageData, prompt } = req.body;

  if (!imageData) {
    return next(new ErrorResponse('Please provide image data (base64)', 400));
  }

  const analysis = await geminiService.analyzeImage(imageData, prompt);

  res.status(200).json({
    success: true,
    data: {
      analysis,
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * @desc    Generate car story from dataset
 * @route   POST /api/v1/gemini/car-story
 * @access  Public
 */
exports.generateCarStory = asyncHandler(async (req, res, next) => {
  const { carId, make, model, year, tone, length, focus } = req.body;

  // Load dataset if not loaded
  if (!carDatasetService.loaded) {
    await carDatasetService.loadDataset();
  }

  let carData;

  // Get car from dataset
  if (carId) {
    carData = carDatasetService.getById(carId);
  } else if (make && model) {
    const results = carDatasetService.search({ make, model, yearFrom: year });
    carData = results.data[0];
  }

  if (!carData) {
    return next(new ErrorResponse('Car not found in dataset', 404));
  }

  const story = await geminiService.generateCarStory(carData, {
    tone: tone || 'enthusiastic',
    length: length || 'medium',
    focus: focus || 'general'
  });

  res.status(200).json({
    success: true,
    data: {
      car: {
        make: carData.Make,
        model: carData.Model,
        year: carData.YearFrom,
        id: carData.id
      },
      story,
      options: { tone, length, focus }
    }
  });
});

/**
 * @desc    Compare multiple cars with AI narrative
 * @route   POST /api/v1/gemini/compare-cars
 * @access  Public
 */
exports.compareCars = asyncHandler(async (req, res, next) => {
  const { carIds, criteria } = req.body;

  if (!carIds || !Array.isArray(carIds) || carIds.length < 2) {
    return next(new ErrorResponse('Please provide at least 2 car IDs to compare', 400));
  }

  // Load dataset if not loaded
  if (!carDatasetService.loaded) {
    await carDatasetService.loadDataset();
  }

  // Get cars from dataset
  const cars = carIds.map(id => carDatasetService.getById(id)).filter(Boolean);

  if (cars.length < 2) {
    return next(new ErrorResponse('Not enough valid cars found for comparison', 404));
  }

  const comparison = await geminiService.compareCards(cars, criteria || []);

  res.status(200).json({
    success: true,
    data: {
      cars: cars.map(c => ({
        id: c.id,
        make: c.Make,
        model: c.Model,
        year: c.YearFrom,
        horsepower: c.Engine?.Horsepower,
        bodyType: c.BodyType
      })),
      comparison,
      criteria: criteria || []
    }
  });
});

/**
 * @desc    Get AI-powered car recommendations
 * @route   POST /api/v1/gemini/recommend
 * @access  Public
 */
exports.recommendCar = asyncHandler(async (req, res, next) => {
  const { preferences, filters } = req.body;

  if (!preferences) {
    return next(new ErrorResponse('Please provide preferences', 400));
  }

  // Load dataset if not loaded
  if (!carDatasetService.loaded) {
    await carDatasetService.loadDataset();
  }

  // Get filtered cars from dataset
  const searchResults = carDatasetService.search(filters || {});
  const availableCars = searchResults.data.slice(0, 10); // Limit to top 10

  if (availableCars.length === 0) {
    return next(new ErrorResponse('No cars found matching filters', 404));
  }

  const recommendation = await geminiService.recommendCar(preferences, availableCars);

  res.status(200).json({
    success: true,
    data: {
      preferences,
      availableCars: availableCars.length,
      recommendation,
      sampleCars: availableCars.slice(0, 5).map(c => ({
        make: c.Make,
        model: c.Model,
        year: c.YearFrom,
        id: c.id
      }))
    }
  });
});

/**
 * @desc    Explain car specifications in simple terms
 * @route   POST /api/v1/gemini/explain-specs
 * @access  Public
 */
exports.explainSpecs = asyncHandler(async (req, res, next) => {
  const { carId, specs, audienceLevel } = req.body;

  let specsToExplain = specs;

  // If carId provided, get specs from dataset
  if (carId && !specs) {
    if (!carDatasetService.loaded) {
      await carDatasetService.loadDataset();
    }

    const car = carDatasetService.getById(carId);
    if (!car) {
      return next(new ErrorResponse('Car not found', 404));
    }

    specsToExplain = {
      Engine: car.Engine,
      Performance: car.Performance,
      Transmission: car.Transmission
    };
  }

  if (!specsToExplain) {
    return next(new ErrorResponse('Please provide specs or carId', 400));
  }

  const explanation = await geminiService.explainSpecs(
    specsToExplain,
    audienceLevel || 'general'
  );

  res.status(200).json({
    success: true,
    data: {
      specs: specsToExplain,
      explanation,
      audienceLevel: audienceLevel || 'general'
    }
  });
});

/**
 * @desc    Generate historical timeline for a make/model
 * @route   POST /api/v1/gemini/timeline
 * @access  Public
 */
exports.generateTimeline = asyncHandler(async (req, res, next) => {
  const { make, model } = req.body;

  if (!make) {
    return next(new ErrorResponse('Please provide a make', 400));
  }

  // Load dataset if not loaded
  if (!carDatasetService.loaded) {
    await carDatasetService.loadDataset();
  }

  // Get relevant cars from dataset
  const searchResults = carDatasetService.search({ make, model });
  const cars = searchResults.data;

  if (cars.length === 0) {
    return next(new ErrorResponse('No cars found for this make/model', 404));
  }

  // Get year range
  const years = {
    from: Math.min(...cars.map(c => c.YearFrom).filter(Boolean)),
    to: Math.max(...cars.map(c => c.YearTo).filter(Boolean))
  };

  const makeOrModel = model ? `${make} ${model}` : make;
  const timeline = await geminiService.generateTimeline(makeOrModel, years);

  res.status(200).json({
    success: true,
    data: {
      make,
      model: model || 'All Models',
      years,
      carsFound: cars.length,
      timeline
    }
  });
});

/**
 * @desc    Get Gemini service status
 * @route   GET /api/v1/gemini/status
 * @access  Public
 */
exports.getStatus = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      available: !!geminiService.genAI || process.env.AI_MOCK_MODE !== 'false',
      mockMode: process.env.AI_MOCK_MODE !== 'false',
      defaultModel: geminiService.defaultModel,
      visionModel: geminiService.visionModel,
      activeChatSessions: geminiService.getActiveSessions()
    }
  });
});
