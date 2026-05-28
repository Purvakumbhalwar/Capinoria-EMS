import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  avatar: { type: String },
  status: { type: String, enum: ['Active', 'On Leave', 'Terminated'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
