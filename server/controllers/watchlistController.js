const Watchlist = require('../models/Watchlist');

const addToWatchlist = async (req, res) => {
  const { petId } = req.params;
  const existing = await Watchlist.findOne({ userId: req.user._id, petId });
  
  if (existing) {
    return res.status(400).json({ message: 'Pet is already in your watchlist' });
  }

  const watchlist = await Watchlist.create({
    userId: req.user._id,
    petId
  });

  res.status(201).json(watchlist);
};

const removeFromWatchlist = async (req, res) => {
  const { petId } = req.params;
  await Watchlist.findOneAndDelete({ userId: req.user._id, petId });
  res.json({ message: 'Removed from watchlist' });
};

const getMyWatchlist = async (req, res) => {
  const watchlist = await Watchlist.find({ userId: req.user._id })
    .populate('petId', 'name photos breed species status');
  res.json(watchlist);
};

module.exports = { addToWatchlist, removeFromWatchlist, getMyWatchlist };
