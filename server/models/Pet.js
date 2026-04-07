const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, enum: ['Dog', 'Cat', 'Rabbit', 'Other'], required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female'] },
  size: { type: String, enum: ['Small', 'Medium', 'Large'] },
  traits: [{ type: String }],
  photos: [{ type: String }],
  videoUrl: { type: String },
  description: { type: String },
  status: { type: String, enum: ['available', 'pending', 'adopted'], default: 'available' },
  shelterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelter', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pet', petSchema);
