const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');

// Load env vars from root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to database
const connectDB = require('./config/db');
connectDB();

// Route files
const auth = require('./routes/auth');
const vehicles = require('./routes/vehicles');
const vehicleStories = require('./routes/vehicleStories');
const users = require('./routes/users');
const exportRoutes = require('./routes/export');

// Middleware
const errorHandler = require('./middleware/error');
const logger = require('./utils/logger');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use('/api/', limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Compression middleware
app.use(compression());

// Serve static files from exports directory
app.use('/exports', express.static(path.join(__dirname, '..', 'exports')));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/vehicles', vehicles);
app.use('/api/v1/stories', vehicleStories);
app.use('/api/v1/users', users);
app.use('/api/v1/export', exportRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AutoStory API is running',
    timestamp: new Date().toISOString()
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to AutoStory API - Immersive Technical Storytelling for Vehicles',
    version: '1.0.0',
    description: 'Transform vehicle specifications into immersive storytelling experiences',
    endpoints: {
      auth: '/api/v1/auth',
      vehicles: '/api/v1/vehicles',
      stories: '/api/v1/stories',
      users: '/api/v1/users',
      health: '/api/v1/health'
    }
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
