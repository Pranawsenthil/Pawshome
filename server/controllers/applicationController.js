const Application = require('../models/Application');
const Pet = require('../models/Pet');
const Shelter = require('../models/Shelter');
const { sendEmail, sendStageUpdateEmail } = require('../utils/emailService');

const createApplication = async (req, res) => {
  const { petId, answers } = req.body;

  const existingApp = await Application.findOne({ petId, applicantId: req.user._id });
  if (existingApp) {
    return res.status(400).json({ message: 'You have already applied for this pet' });
  }

  const application = await Application.create({
    petId,
    applicantId: req.user._id,
    stage: 1,
    status: 'pending',
    answers,
    timeline: [{
      stage: 1,
      updatedAt: Date.now(),
      note: 'Application submitted'
    }]
  });

  const pet = await Pet.findByIdAndUpdate(petId, { status: 'pending' });

  // Send confirmation email
  await sendEmail({
    to: req.user.email,
    subject: 'PawsHome - Application Received',
    html: `<h2>Hi ${req.user.name},</h2><p>Your application for <strong>${pet ? pet.name : 'this pet'}</strong> has been successfully received and is currently Pending.</p>`
  });

  res.status(201).json(application);
};

const getMyApplications = async (req, res) => {
  const applications = await Application.find({ applicantId: req.user._id })
    .populate('petId', 'name photos breed species');
  res.json(applications);
};

const getShelterApplications = async (req, res) => {
  const shelter = await Shelter.findOne({ adminId: req.user._id });
  if (!shelter) {
    return res.status(400).json({ message: 'No shelter associated with your account' });
  }

  const pets = await Pet.find({ shelterId: shelter._id }).select('_id');
  const petIds = pets.map(p => p._id);

  const applications = await Application.find({ petId: { $in: petIds } })
    .populate('petId', 'name')
    .populate('applicantId', 'name email');

  res.json(applications);
};

const advanceStage = async (req, res) => {
  const { id } = req.params;
  const { action, note } = req.body;

  const application = await Application.findById(id).populate('petId').populate('applicantId', 'name email');
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const shelter = await Shelter.findOne({ adminId: req.user._id });
  if (!shelter || application.petId.shelterId.toString() !== shelter._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to manage this application' });
  }

  if (action === 'advance') {
    if (application.stage < 4) {
      application.stage += 1;
      application.status = application.stage === 4 ? 'approved' : 'under-review';
    }
  } else if (action === 'reject') {
    application.status = 'rejected';
  } else {
    return res.status(400).json({ message: 'Invalid action' });
  }

  application.timeline.push({
    stage: application.stage,
    updatedAt: Date.now(),
    note: note || `Application advanced to ${application.status}`
  });

  await application.save();

  if (application.status === 'approved') {
    await Pet.findByIdAndUpdate(application.petId._id, { status: 'adopted' });
  } else if (application.status === 'rejected') {
    await Pet.findByIdAndUpdate(application.petId._id, { status: 'available' });
  }

  await sendStageUpdateEmail({
    to: application.applicantId.email,
    applicantName: application.applicantId.name,
    petName: application.petId.name,
    stage: application.stage,
    status: application.status
  });

  res.json(application);
};

module.exports = {
  createApplication,
  getMyApplications,
  getShelterApplications,
  advanceStage
};
