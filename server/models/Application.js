const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stage: { type: Number, default: 1 },
  answers: {
    fullName: String,
    phone: String,
    occupation: String,
    address: String,
    homeType: String,
    ownOrRent: String,
    hasYard: Boolean,
    hasOtherPets: Boolean,
    hasChildren: Boolean,
    referenceName: String,
    referencePhone: String,
    vetName: String
  },
  status: { type: String, enum: ['pending', 'under-review', 'approved', 'rejected'], default: 'pending' },
  timeline: [{
    stage: Number,
    updatedAt: Date,
    note: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
