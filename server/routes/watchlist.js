const express = require('express');
const router = express.Router();
const { addToWatchlist, removeFromWatchlist, getMyWatchlist } = require('../controllers/watchlistController');
const { protect } = require('../middleware/authMiddleware');

router.get('/mine', protect, getMyWatchlist);
router.post('/:petId', protect, addToWatchlist);
router.delete('/:petId', protect, removeFromWatchlist);

module.exports = router;
