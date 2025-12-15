const express = require('express');
const {
  generateNarrative,
  regenerateChapter
} = require('../controllers/narrative');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All narrative routes require authentication
router.use(protect);
router.use(authorize('user', 'author', 'admin'));

router.post('/generate/:vehicleId', generateNarrative);
router.post('/:vehicleId/regenerate-chapter', regenerateChapter);

module.exports = router;
