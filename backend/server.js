const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');
const ApiError = require('./utils/apiError');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const roomRoutes = require('./routes/roomRoutes');
const companyRoutes = require('./routes/companyRoutes');
const searchRoutes = require('./routes/searchRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Connect to Database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Morgan API Logger
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

const path = require('path');

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Handle all non-API routes by serving the index.html
  app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        message: `API route '${req.originalUrl}' not found.`
      });
    }
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
} else {
  // Catch-all for undefined routes in development
  app.use('*', (req, res, next) => {
    next(new ApiError(404, `API route '${req.originalUrl}' not found.`));
  });
}

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
