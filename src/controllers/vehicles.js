const Vehicle = require('../models/Vehicle');
const VehicleStory = require('../models/VehicleStory');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { parseVehicleData } = require('../services/dataParser');

// @desc    Upload and parse vehicle data
// @route   POST /api/v1/vehicles/parse
// @access  Private
exports.parseVehicleData = asyncHandler(async (req, res, next) => {
  const { dataType, data } = req.body;

  if (!dataType || !data) {
    return next(new ErrorResponse('Please provide data type and data', 400));
  }

  let parsedData;

  try {
    switch (dataType) {
      case 'json':
        parsedData = JSON.parse(data);
        break;
      case 'csv':
        // In production, handle file upload
        parsedData = await parseCSVData(data);
        break;
      case 'manual':
        parsedData = data;
        break;
      default:
        return next(new ErrorResponse('Invalid data type', 400));
    }

    // Normalize and validate vehicle data
    const normalizedData = await parseVehicleData(parsedData);

    res.status(200).json({
      success: true,
      data: normalizedData
    });
  } catch (error) {
    console.error('Parse Error:', error);
    return next(new ErrorResponse('Error parsing vehicle data', 400));
  }
});

// @desc    Create vehicle
// @route   POST /api/v1/vehicles
// @access  Private
exports.createVehicle = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const vehicle = await Vehicle.create(req.body);

  res.status(201).json({
    success: true,
    data: vehicle
  });
});

// @desc    Get all vehicles
// @route   GET /api/v1/vehicles
// @access  Public
exports.getVehicles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single vehicle
// @route   GET /api/v1/vehicles/:id
// @access  Public
exports.getVehicle = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id)
    .populate('createdBy', 'name email');

  if (!vehicle) {
    return next(
      new ErrorResponse(`Vehicle not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: vehicle
  });
});

// @desc    Update vehicle
// @route   PUT /api/v1/vehicles/:id
// @access  Private
exports.updateVehicle = asyncHandler(async (req, res, next) => {
  let vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(
      new ErrorResponse(`Vehicle not found with id of ${req.params.id}`, 404)
    );
  }

  // Check ownership or admin
  if (vehicle.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this vehicle`, 401)
    );
  }

  vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: vehicle
  });
});

// @desc    Delete vehicle
// @route   DELETE /api/v1/vehicles/:id
// @access  Private
exports.deleteVehicle = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(
      new ErrorResponse(`Vehicle not found with id of ${req.params.id}`, 404)
    );
  }

  // Check ownership or admin
  if (vehicle.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete this vehicle`, 401)
    );
  }

  await vehicle.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Compare vehicles
// @route   POST /api/v1/vehicles/compare
// @access  Public
exports.compareVehicles = asyncHandler(async (req, res, next) => {
  const { vehicleIds } = req.body;

  if (!vehicleIds || vehicleIds.length < 2) {
    return next(new ErrorResponse('Please provide at least 2 vehicle IDs', 400));
  }

  const vehicles = await Vehicle.find({ _id: { $in: vehicleIds } });

  if (vehicles.length !== vehicleIds.length) {
    return next(new ErrorResponse('One or more vehicles not found', 404));
  }

  // Generate comparison data
  const comparison = {
    vehicles: vehicles.map(v => ({
      id: v._id,
      make: v.make,
      model: v.model,
      year: v.year,
      specifications: v.specifications
    })),
    comparison: {
      performance: comparePerformance(vehicles),
      efficiency: compareEfficiency(vehicles),
      safety: compareSafety(vehicles),
      technology: compareTechnology(vehicles)
    }
  };

  res.status(200).json({
    success: true,
    data: comparison
  });
});

// Helper functions
function comparePerformance(vehicles) {
  return vehicles.map(v => ({
    vehicleId: v._id,
    horsepower: v.specifications?.engine?.horsepower || 0,
    torque: v.specifications?.engine?.torque || 0,
    acceleration: v.specifications?.performance?.acceleration_0_100 || 0,
    topSpeed: v.specifications?.performance?.topSpeed || 0
  }));
}

function compareEfficiency(vehicles) {
  return vehicles.map(v => ({
    vehicleId: v._id,
    fuelConsumption: v.specifications?.efficiency?.fuelConsumption || 0,
    range: v.specifications?.battery?.range || v.specifications?.efficiency?.range || 0,
    emissions: v.specifications?.efficiency?.co2Emissions || 0
  }));
}

function compareSafety(vehicles) {
  return vehicles.map(v => ({
    vehicleId: v._id,
    rating: v.specifications?.safety?.rating || 0,
    features: v.specifications?.safety?.features || [],
    airbags: v.specifications?.safety?.airbags || 0
  }));
}

function compareTechnology(vehicles) {
  return vehicles.map(v => ({
    vehicleId: v._id,
    adasFeatures: v.specifications?.adas?.features || [],
    infotainment: v.specifications?.technology?.infotainmentSystem || 'N/A',
    connectivity: v.specifications?.technology?.connectivity || []
  }));
}

async function parseCSVData(csvString) {
  // Parse CSV string to object
  // This is a placeholder - implement actual CSV parsing
  return JSON.parse(csvString);
}
