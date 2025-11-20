import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('process.env.DATABASE', process.env.DATABASE);
    const conn = await mongoose.connect(process.env.DATABASE || '');
    console.log(` MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(' MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
