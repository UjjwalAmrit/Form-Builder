import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const resetDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not found in .env file');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    
    // --- 1. Delete the Database ---
    console.log('Deleting existing database...');
    await mongoose.connection.dropDatabase();
    console.log('Database deleted successfully.');

    // --- 2. Seed the Database ---
    console.log('Seeding database with admin user...');
    const adminUser = new User({
      email: '12345@gmail.com',
      password: '12345'
    });
    await adminUser.save();
    console.log('Admin user created successfully.');
    
    // --- 3. Disconnect ---
    await mongoose.disconnect();
    console.log('Database reset completed successfully.');
    process.exit(0);

  } catch (error) {
    console.error('Error resetting database:', error);
    await mongoose.disconnect(); // Ensure disconnection on error
    process.exit(1);
  }
};

resetDatabase();