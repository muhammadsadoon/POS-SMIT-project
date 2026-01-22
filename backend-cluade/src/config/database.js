const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10,
      retryWrites: true,
      dbName:"pos_project"
    });

    console.log('✅ MongoDB Connected Successfully');
    console.log(`📍 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);

    // Provide helpful error messages
    if (error.message.includes('authentication failed')) {
      console.error('💡 Check your MongoDB username and password in .env file');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('💡 Check your MongoDB URI hostname in .env file');
    } else if (error.message.includes('queryTxt ETIMEOUT')) {
      console.error('💡 Network timeout - check internet connection or MongoDB Atlas IP whitelist');
    } else if (error.message.includes('MONGODB_URI is not defined')) {
      console.error('💡 Please add MONGODB_URI to your .env file');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;

