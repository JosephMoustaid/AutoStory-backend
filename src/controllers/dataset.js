const carDatasetService = require('../services/carDatasetService');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Search cars in dataset with filters
 * @route   GET /api/v1/dataset/search
 * @access  Public
 */
exports.searchCars = asyncHandler(async (req, res, next) => {
  // Load dataset if not loaded
  if (!carDatasetService.loaded) {
    await carDatasetService.loadDataset();
  }

  const filters = {
    query: req.query.query,
    make: req.query.make,
    model: req.query.model,
    yearFrom: req.query.yearFrom,
    yearTo: req.query.yearTo,
    bodyType: req.query.bodyType,
    engineType: req.query.engineType,
    minHorsepower: req.query.minHorsepower,
    maxHorsepower: req.query.maxHorsepower,
    country: req.query.country,
    driveWheels: req.query.driveWheels,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
    page: req.query.page,
    limit: req.query.limit
  };

  const results = carDatasetService.search(filters);

  res.status(200).json({
    success: true,
    count: results.data.length,
    pagination: results.pagination,
    data: results.data
  });
});

/**
 * @desc    Get car by ID
 * @route   GET /api/v1/dataset/cars/:id
 * @access  Public
 */
exports.getCarById = asyncHandler(async (req, res, next) => {
  // Load dataset if not loaded
  if (!carDatasetService.loaded) {
    await carDatasetService.loadDataset();
  }

  const car = carDatasetService.getById(req.params.id);

  if (!car) {
    return next(new ErrorResponse(`Car not found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: car
  });
});

/**
 * @desc    Get dataset analytics
 * @route   GET /api/v1/dataset/analytics
 * @access  Public
 */
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  // Load dataset if not loaded
  if (!carDatasetService.loaded) {
    await carDatasetService.loadDataset();
  }

  const analytics = carDatasetService.getAnalytics();

  res.status(200).json({
    success: true,
    data: analytics
  });
});

/**
 * @desc    Get top cars by criteria
 * @route   GET /api/v1/dataset/top
 * @access  Public
 */
exports.getTopCars = asyncHandler(async (req, res, next) => {
  // Load dataset if not loaded
  if (!carDatasetService.loaded) {
    await carDatasetService.loadDataset();
  }

  const criteria = req.query.criteria || 'horsepower';
  const limit = parseInt(req.query.limit) || 10;

  const validCriteria = ['horsepower', 'speed', 'acceleration', 'efficient'];
  if (!validCriteria.includes(criteria)) {
    return next(new ErrorResponse(`Invalid criteria. Must be one of: ${validCriteria.join(', ')}`, 400));
  }

  const topCars = carDatasetService.getTopCars(criteria, limit);

  res.status(200).json({
    success: true,
    criteria,
    count: topCars.length,
    data: topCars
  });
});

/**
 * @desc    Get cars by decade with statistics
 * @route   GET /api/v1/dataset/decades
 * @access  Public
 */
exports.getCarsByDecade = asyncHandler(async (req, res, next) => {
  // Load dataset if not loaded
  if (!carDatasetService.loaded) {
    await carDatasetService.loadDataset();
  }

  const decades = carDatasetService.getCarsByDecade();

  res.status(200).json({
    success: true,
    count: decades.length,
    data: decades
  });
});

/**
 * @desc    Get statistics for specific make
 * @route   GET /api/v1/dataset/makes/:make
 * @access  Public
 */
exports.getMakeStatistics = asyncHandler(async (req, res, next) => {
  // Load dataset if not loaded
  if (!carDatasetService.loaded) {
    await carDatasetService.loadDataset();
  }

  const statistics = carDatasetService.getMakeStatistics(req.params.make);

  if (!statistics) {
    return next(new ErrorResponse(`No data found for make: ${req.params.make}`, 404));
  }

  res.status(200).json({
    success: true,
    data: statistics
  });
});

/**
 * @desc    Get list of all makes
 * @route   GET /api/v1/dataset/makes
 * @access  Public
 */
exports.getAllMakes = asyncHandler(async (req, res, next) => {
  // Load dataset if not loaded
  if (!carDatasetService.loaded) {
    await carDatasetService.loadDataset();
  }

  const analytics = carDatasetService.getAnalytics();

  res.status(200).json({
    success: true,
    count: analytics.makes.length,
    data: analytics.makes
  });
});

/**
 * @desc    Get random cars
 * @route   GET /api/v1/dataset/random
 * @access  Public
 */
exports.getRandomCars = asyncHandler(async (req, res, next) => {
  // Load dataset if not loaded
  if (!carDatasetService.loaded) {
    await carDatasetService.loadDataset();
  }

  const count = parseInt(req.query.count) || 5;
  const randomCars = carDatasetService.getRandomCars(count);

  res.status(200).json({
    success: true,
    count: randomCars.length,
    data: randomCars
  });
});

/**
 * @desc    Get dataset status
 * @route   GET /api/v1/dataset/status
 * @access  Public
 */
exports.getStatus = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      loaded: carDatasetService.loaded,
      totalCars: carDatasetService.cars.length,
      datasetPath: carDatasetService.datasetPath
    }
  });
});

/**
 * @desc    Compare multiple cars from dataset
 * @route   POST /api/v1/dataset/compare
 * @access  Public
 */
exports.compareCars = asyncHandler(async (req, res, next) => {
  const { carIds } = req.body;

  if (!carIds || !Array.isArray(carIds) || carIds.length < 2) {
    return next(new ErrorResponse('Please provide at least 2 car IDs to compare', 400));
  }

  // Load dataset if not loaded
  if (!carDatasetService.loaded) {
    await carDatasetService.loadDataset();
  }

  const cars = carIds.map(id => carDatasetService.getById(id)).filter(Boolean);

  if (cars.length < 2) {
    return next(new ErrorResponse('Not enough valid cars found for comparison', 404));
  }

  // Build comparison data
  const comparison = {
    cars: cars.map(c => ({
      id: c.id,
      make: c.Make,
      model: c.Model,
      year: c.YearFrom,
      bodyType: c.BodyType
    })),
    specs: {
      engine: cars.map(c => ({
        id: c.id,
        type: c.Engine?.Type,
        capacity: c.Engine?.Capacity,
        horsepower: c.Engine?.Horsepower,
        torque: c.Engine?.MaxTorque
      })),
      performance: cars.map(c => ({
        id: c.id,
        acceleration: c.Performance?.Acceleration0_100,
        maxSpeed: c.Performance?.MaxSpeed,
        fuelConsumption: c.Performance?.MixedFuelConsumption
      })),
      dimensions: cars.map(c => ({
        id: c.id,
        length: c.Dimensions?.Length,
        width: c.Dimensions?.Width,
        height: c.Dimensions?.Height,
        weight: c.Weight?.Curb
      }))
    }
  };

  res.status(200).json({
    success: true,
    data: comparison
  });
});
