const express = require('express');
const {
  generateText,
  generateStream,
  chat,
  clearChatSession,
  analyzeImage,
  generateCarStory,
  compareCars,
  recommendCar,
  explainSpecs,
  generateTimeline,
  getStatus
} = require('../controllers/gemini');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Public routes
router.post('/car-story', generateCarStory);
router.post('/compare-cars', compareCars);
router.post('/recommend', recommendCar);
router.post('/explain-specs', explainSpecs);
router.post('/timeline', generateTimeline);
router.get('/status', getStatus);

// Protected routes (require authentication)
router.post('/generate', protect, generateText);
router.post('/stream', protect, generateStream);
router.post('/chat', protect, chat);
router.delete('/chat/:sessionId', protect, clearChatSession);
router.post('/analyze-image', protect, analyzeImage);

module.exports = router;
