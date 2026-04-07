const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  petName: { type: String, required: true },
  photo: { type: String },
  story: { type: String, required: true },
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SuccessStory', successStorySchema);
