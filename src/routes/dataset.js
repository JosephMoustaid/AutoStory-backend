const express = require('express');
const {
  searchCars,
  getCarById,
  getAnalytics,
  getTopCars,
  getCarsByDecade,
  getMakeStatistics,
  getAllMakes,
  getRandomCars,
  getStatus,
  compareCars
} = require('../controllers/dataset');

const router = express.Router();

// All routes are public (dataset information)
router.get('/search', searchCars);
router.get('/cars/:id', getCarById);
router.get('/analytics', getAnalytics);
router.get('/top', getTopCars);
router.get('/decades', getCarsByDecade);
router.get('/makes', getAllMakes);
router.get('/makes/:make', getMakeStatistics);
router.get('/random', getRandomCars);
router.get('/status', getStatus);
router.post('/compare', compareCars);

module.exports = router;
