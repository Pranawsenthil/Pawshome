const Pet = require('../models/Pet');
const Shelter = require('../models/Shelter');

const getAllPets = async (req, res) => {
  const { species, breed, size, status, traits, minAge, maxAge, page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  let query = {};
  if (species) query.species = species;
  if (breed) query.breed = breed;
  if (size) query.size = size;
  if (status) query.status = status;
  
  if (traits) {
    query.traits = { $all: traits.split(',').map(t => t.trim()) };
  }

  if (minAge || maxAge) {
    query.age = {};
    if (minAge) query.age.$gte = Number(minAge);
    if (maxAge) query.age.$lte = Number(maxAge);
  }

  const pets = await Pet.find(query)
    .populate('shelterId', 'name city')
    .skip(skip)
    .limit(limit);

  const total = await Pet.countDocuments(query);

  res.json({
    pets,
    page: Number(page),
    pages: Math.ceil(total / limit),
    total
  });
};

const getPetById = async (req, res) => {
  const pet = await Pet.findById(req.params.id).populate('shelterId');
  if (pet) {
    res.json(pet);
  } else {
    res.status(404).json({ message: 'Pet not found' });
  }
};

const createPet = async (req, res) => {
  let shelter = await Shelter.findOne({ adminId: req.user._id });
  if (!shelter && req.user.role === 'shelter-admin') {
    shelter = await Shelter.create({
      name: `${req.user.name || 'Admin'}'s Shelter`,
      adminId: req.user._id,
      email: req.user.email || 'pending@shelter.com',
      phone: 'Pending',
      address: 'Pending',
      city: 'Pending',
      state: 'Pending',
      zipCode: '00000'
    });
  } else if (!shelter) {
    return res.status(400).json({ message: 'No shelter associated with this admin account' });
  }

  const photos = req.files ? req.files.map(file => file.path) : [];
  
  const petData = {
    ...req.body,
    shelterId: shelter._id,
    photos
  };

  if (typeof petData.traits === 'string') {
    petData.traits = petData.traits.split(',').map(t => t.trim());
  }

  const pet = await Pet.create(petData);
  res.status(201).json(pet);
};

const updatePet = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) {
    return res.status(404).json({ message: 'Pet not found' });
  }

  const shelter = await Shelter.findOne({ adminId: req.user._id });
  if (!shelter || pet.shelterId.toString() !== shelter._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this pet' });
  }

  const updateData = { ...req.body };
  if (req.files && req.files.length > 0) {
    updateData.photos = req.files.map(file => file.path);
  }
  
  if (typeof updateData.traits === 'string') {
    updateData.traits = updateData.traits.split(',').map(t => t.trim());
  }

  const updatedPet = await Pet.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(updatedPet);
};

const deletePet = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) {
    return res.status(404).json({ message: 'Pet not found' });
  }

  const shelter = await Shelter.findOne({ adminId: req.user._id });
  if (!shelter || pet.shelterId.toString() !== shelter._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this pet' });
  }

  await Pet.findByIdAndDelete(req.params.id);
  res.json({ message: 'Pet removed' });
};

const matchPets = async (req, res) => {
  const { activityLevel, homeType, hasChildren, hasOtherPets, sizePreference, speciesPreference } = req.query;
  
  const pets = await Pet.find({ status: 'available' }).populate('shelterId', 'name city').lean();

  const scoredPets = pets.map(pet => {
    let score = 0;
    
    if (speciesPreference && pet.species === speciesPreference) score += 30;
    if (sizePreference && pet.size === sizePreference) score += 20;
    
    if (activityLevel === 'High' && pet.traits && pet.traits.includes('Energetic')) score += 15;
    if (activityLevel === 'Low' && pet.traits && pet.traits.includes('Calm')) score += 15;
    
    if (hasChildren === 'true' && pet.traits && pet.traits.includes('Good with kids')) score += 15;
    if (hasOtherPets === 'true' && pet.traits && pet.traits.includes('Good with other pets')) score += 15;
    
    if (homeType === 'Apartment' && (pet.size === 'Small' || pet.size === 'Medium')) score += 10;
    
    return { ...pet, matchScore: score };
  });

  scoredPets.sort((a, b) => b.matchScore - a.matchScore);
  const topPets = scoredPets.slice(0, 5);

  res.json(topPets);
};

const getMyShelterPets = async (req, res) => {
  let shelter = await Shelter.findOne({ adminId: req.user._id });
  if (!shelter && req.user.role === 'shelter-admin') {
    shelter = await Shelter.create({
      name: `${req.user.name || 'Admin'}'s Shelter`,
      adminId: req.user._id,
      email: req.user.email || 'pending@shelter.com',
      phone: 'Pending',
      address: 'Pending',
      city: 'Pending',
      state: 'Pending',
      zipCode: '00000'
    });
  } else if (!shelter) {
    return res.status(400).json({ message: 'No shelter associated with this admin account' });
  }
  const pets = await Pet.find({ shelterId: shelter._id }).sort({ createdAt: -1 });
  res.json(pets);
};

module.exports = {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  matchPets,
  getMyShelterPets
};
