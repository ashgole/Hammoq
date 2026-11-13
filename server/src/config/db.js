const mongoose = require('mongoose');
const dns = require('dns');
const config = require('./config');

// Ensure DNS resolves MongoDB SRV records reliably across all network environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('[MongoDB] Warning: Could not override DNS servers:', dnsErr.message);
}

/**
 * Connect to MongoDB database
 * Single Responsibility: MongoDB connection lifecycle and event monitoring
 */
const connectDB = async () => {
  if (!config.mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  // Setup Mongoose connection event listeners
  mongoose.connection.on('connected', () => {
    console.log(`[MongoDB] Connected successfully to database: ${config.dbName}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[MongoDB] Connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('[MongoDB] Connection disconnected');
  });

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      dbName: config.dbName,
    });
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Initial connection failure: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
