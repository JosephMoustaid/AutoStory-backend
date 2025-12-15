const express = require('express');
const {
  generateInfographics,
  generateVideoClips,
  generate3DModel,
  generateNarration,
  generateAllMedia,
  getMediaAssets
} = require('../controllers/media');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/:vehicleId', getMediaAssets);

// Protected routes
router.use(protect);
router.use(authorize('user', 'author', 'admin'));

router.post('/:vehicleId/infographics', generateInfographics);
router.post('/:vehicleId/videos', generateVideoClips);
router.post('/:vehicleId/3d-model', generate3DModel);
router.post('/:vehicleId/narration', generateNarration);
router.post('/:vehicleId/generate-all', generateAllMedia);

module.exports = router;
