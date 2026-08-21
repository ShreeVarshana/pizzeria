const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pizzeria';
    await mongoose.connect(uri);
    console.log('MongoDB connected:', uri);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('The API will keep running, but database routes will fail until MongoDB is reachable.');
  }
};

module.exports = connectDB;
