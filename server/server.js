require('dotenv').config();
require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Models
require('./models/User');
require('./models/Shelter');
require('./models/Pet');
require('./models/Application');
require('./models/Watchlist');
require('./models/SuccessStory');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/watchlist', require('./routes/watchlist'));
app.use('/api/stories', require('./routes/stories'));

app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "PawsHome API is running" });
});

app.use('*', (req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`PawsHome server running on port ${PORT}`);
});
