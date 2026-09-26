const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const seedData = require('./config/seed');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB & Seed initial data (on local startup)
connectDB().then(() => {
  seedData();
}).catch((err) => {
  console.error('Initial DB connection error:', err);
});

// Middleware
app.use(cors());
app.use(express.json());

// Ensure MongoDB is connected for every /api request (critical for Vercel serverless)
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    try {
      await connectDB();
    } catch (dbErr) {
      console.error('Database connection failed on request:', dbErr);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed. Please check MongoDB Atlas IP access.',
        error: dbErr.message
      });
    }
  }
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// SPA fallback for non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`CampusConnect server running on port ${PORT}`);
  });
}

module.exports = app;
