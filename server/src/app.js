const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const apiRoutes = require('./routes/api.routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware: Enable CORS for frontend origin
app.use(
  cors({
    origin: config.frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Middleware: Parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// 404 Not Found handler for undefined routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
