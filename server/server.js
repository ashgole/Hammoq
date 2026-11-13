const mongoose = require('mongoose');
const app = require('./src/app');
const config = require('./src/config/config');
const connectDB = require('./src/config/db');

let server;

/**
 * Bootstrap server
 * Single Responsibility: Server lifecycle, DB initialization, and process signal handlers
 */
const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Start HTTP server
    server = app.listen(config.port, () => {
      console.log(`[Server] Server is running on port ${config.port}`);
      console.log(`[Server] API Base URL: http://localhost:${config.port}/api`);
      console.log(`[Server] Hello Endpoint: http://localhost:${config.port}/api/hello`);
      console.log(`[Server] Tasks Endpoint: http://localhost:${config.port}/api/tasks`);
    });
  } catch (error) {
    console.error(`[Server] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Graceful shutdown handling
const shutdown = async (signal) => {
  console.log(`[Server] ${signal} signal received. Initiating graceful shutdown...`);
  if (server) {
    server.close(async () => {
      console.log('[Server] HTTP server closed.');
      try {
        await mongoose.connection.close();
        console.log('[MongoDB] Connection closed.');
      } catch (err) {
        console.error('[MongoDB] Error during connection close:', err.message);
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();

module.exports = { app, startServer };
