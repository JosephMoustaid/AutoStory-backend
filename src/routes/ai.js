const express = require('express');
const {
  generateStory,
  enhanceStory,
  generateIdeas
} = require('../controllers/ai');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All AI routes require authentication
router.use(protect);

router.post('/generate', authorize('user', 'author', 'admin'), generateStory);
router.post('/enhance/:storyId', authorize('user', 'author', 'admin'), enhanceStory);
router.post('/ideas', authorize('user', 'author', 'admin'), generateIdeas);

module.exports = router;
