const mongoose = require('mongoose');
const config = require('./config');

// In local development only (NOT on Vercel serverless), configure fallback DNS if needed.
// On Vercel, dns.setServers overrides AWS Lambda internal DNS and causes SRV timeouts.
if (!process.env.VERCEL && !process.env.AWS_REGION) {
  try {
    const dns = require('dns');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (dnsErr) {
    // Ignore in environments where setting DNS is restricted
  }
}

let connectionPromise = null;

/**
 * Connect to MongoDB database with serverless connection caching.
 */
const connectDB = async () => {
  // If already connected, reuse existing connection immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If a connection is already in progress, await it
  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = process.env.MONGODB_URI || config.mongoUri;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined. Please add MONGODB_URI in Vercel Project Settings > Environment Variables.');
  }

  const dbName = process.env.DB_NAME || config.dbName || 'Hammoq';

  connectionPromise = mongoose.connect(mongoUri, {
    dbName: dbName,
    serverSelectionTimeoutMS: 5000, // Fail fast after 5s instead of hanging
  }).then((conn) => {
    console.log(`[MongoDB] Connected successfully to database: ${conn.connection.name}`);
    return conn;
  }).catch((err) => {
    connectionPromise = null;
    console.error(`[MongoDB] Connection error: ${err.message}`);
    throw err;
  });

  return connectionPromise;
};

module.exports = connectDB;
