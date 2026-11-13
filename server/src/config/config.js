const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI,
  dbName: process.env.DB_NAME || 'Hammoq',
};

module.exports = config;
