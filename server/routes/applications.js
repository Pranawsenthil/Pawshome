const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  getShelterApplications,
  advanceStage
} = require('../controllers/applicationController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/', protect, createApplication);
router.get('/mine', protect, getMyApplications);
router.get('/shelter', protect, requireRole('shelter-admin'), getShelterApplications);
router.put('/:id/stage', protect, requireRole('shelter-admin'), advanceStage);

module.exports = router;
