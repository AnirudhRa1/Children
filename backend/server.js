const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const ChildrenResult = require('./models/ChildrenResult');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vopa-db';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection with retry logic
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts remaining)`);
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retries - 1);
    } else {
      console.error('Failed to connect to MongoDB after multiple attempts');
      console.log('Please ensure MongoDB is running on your system');
      console.log('You can start MongoDB by:');
      console.log('1. Opening PowerShell as Administrator');
      console.log('2. Running: net start MongoDB');
      process.exit(1);
    }
  }
};

// Connect to MongoDB
connectDB();

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      childrenResults: '/childrenresults',
      childResult: '/childrenresults/:childId'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    database: {
      status: dbStatus,
      state: dbState
    }
  });
});

// API Routes
app.get('/childrenresults', async (req, res) => {
  try {
    const results = await ChildrenResult.find();
    res.json(results);
  } catch (error) {
    console.error('Error fetching children results:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to fetch children results'
    });
  }
});

app.get('/childrenresults/:childId', async (req, res) => {
  try {
    const childResult = await ChildrenResult.findOne({ childId: req.params.childId });
    if (!childResult) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Child not found'
      });
    }
    res.json(childResult);
  } catch (error) {
    console.error('Error fetching child result:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to fetch child result'
    });
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: 'Something went wrong!'
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log(`📝 Health check available at http://localhost:${PORT}/health`);
  console.log(`📚 API documentation available at http://localhost:${PORT}/`);
});
