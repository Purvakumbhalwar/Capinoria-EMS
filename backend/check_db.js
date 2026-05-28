import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/capinoria-ems');
  const empUser = await User.findOne({ roleLevel: 'Employee' });
  console.log("Found Employee:", empUser);
  process.exit(0);
}

check();
