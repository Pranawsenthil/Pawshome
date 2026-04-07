const express = require('express');
const router = express.Router();
const { getStories, createStory } = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');
const uploadStory = require('../middleware/uploadStoryMiddleware');

router.route('/')
  .get(getStories)
  .post(protect, uploadStory.single('photo'), createStory);

module.exports = router;
