const express = require('express');
const router = express.Router();
const {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  matchPets,
  getMyShelterPets
} = require('../controllers/petController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/match', matchPets);
router.get('/mine', protect, requireRole('shelter-admin'), getMyShelterPets);

router.route('/')
  .get(getAllPets)
  .post(protect, requireRole('shelter-admin'), upload.array('photos', 5), createPet);

router.route('/:id')
  .get(getPetById)
  .put(protect, requireRole('shelter-admin'), upload.array('photos', 5), updatePet)
  .delete(protect, requireRole('shelter-admin'), deletePet);

module.exports = router;
