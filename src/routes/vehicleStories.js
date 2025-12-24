const express = require('express');
const {
  generateStory,
  getStories,
  getStory,
  updateStory,
  deleteStory,
  publishStory,
  exportStory
} = require('../controllers/vehicleStories');

const VehicleStory = require('../models/VehicleStory');
const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(VehicleStory, [
      { path: 'author', select: 'name email' }
    ]),
    getStories
  );

router.route('/generate').post(protect, authorize('user', 'author', 'admin'), generateStory);

router
  .route('/:id')
  .get(getStory)
  .put(protect, authorize('user', 'author', 'admin'), updateStory)
  .delete(protect, authorize('user', 'author', 'admin'), deleteStory);

router.route('/:id/publish').put(protect, authorize('user', 'author', 'admin'), publishStory);
router.route('/:id/export/:format').get(protect, exportStory);

module.exports = router;
