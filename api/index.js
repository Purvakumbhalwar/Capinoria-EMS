import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import employeeRoutes from '../backend/routes/employeeRoutes.js';
import leadRoutes from '../backend/routes/leadRoutes.js';
import authRoutes from '../backend/routes/authRoutes.js';
import assetRoutes from '../backend/routes/assetRoutes.js';
import leaveRoutes from '../backend/routes/leaveRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const uriToUse = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/capinoria-ems';
console.log('Attempting to connect to MONGODB_URI');
mongoose.connect(uriToUse)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Set up routes
app.use('/api/employees', employeeRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/leaves', leaveRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Capinoria EMS API is running' });
});

export default app;
