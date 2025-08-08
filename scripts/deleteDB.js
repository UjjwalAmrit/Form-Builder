import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const deleteDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/formbuilder';
    await mongoose.connect(uri);
    await mongoose.connection.dropDatabase();
    console.log('Database deleted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting database:', error);
    process.exit(1);
  }
};

deleteDatabase();
