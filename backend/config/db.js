const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DEFAULT_MONGODB_URI = 'mongodb+srv://sumitpatil7758_db_user:AFSLvjP6OXS6UkFV@cluster0.n4f7oqh.mongodb.net/campusconnect?retryWrites=true&w=majority&appName=Cluster0';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 15000,
      bufferCommands: true
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('MongoDB connected successfully');
      return mongooseInstance;
    }).catch((err) => {
      console.error('MongoDB connection error:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
};

module.exports = connectDB;
