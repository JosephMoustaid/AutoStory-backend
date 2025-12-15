const express = require('express');
const {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
  parseVehicleData,
  compareVehicles
} = require('../controllers/vehicles');

const Vehicle = require('../models/Vehicle');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Vehicle, {
      path: 'createdBy',
      select: 'name email'
    }),
    getVehicles
  )
  .post(protect, authorize('user', 'author', 'admin'), createVehicle);

router.post('/parse', protect, authorize('user', 'author', 'admin'), parseVehicleData);

router.post('/compare', compareVehicles);

router
  .route('/:id')
  .get(getVehicle)
  .put(protect, authorize('user', 'author', 'admin'), updateVehicle)
  .delete(protect, authorize('user', 'author', 'admin'), deleteVehicle);

module.exports = router;
