const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return; // Use existing connection

  try {
    // Ensure MONGO_URI is set in Vercel Environment Variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // DO NOT process.exit(1) here; let the error bubble up to the handler
    throw error; 
  }
};

module.exports = connectDB;