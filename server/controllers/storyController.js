const SuccessStory = require('../models/SuccessStory');

const getStories = async (req, res) => {
  const stories = await SuccessStory.find({}).sort({ postedAt: -1 }).populate('userId', 'name');
  res.json(stories);
};

const createStory = async (req, res) => {
  const { petName, story } = req.body;
  const photo = req.file ? req.file.path : null;

  const successStory = await SuccessStory.create({
    userId: req.user._id,
    petName,
    photo,
    story
  });

  res.status(201).json(successStory);
};

module.exports = { getStories, createStory };
