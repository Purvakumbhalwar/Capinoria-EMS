import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Simple password for now, encrypt in production
  phone: { type: String },
  department: { type: String },
  roleLevel: { type: String },
  employeeId: { type: String },
  avatar: { type: String },
  location: { type: String },
  status: { type: String, default: 'Active' },
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.virtual('role').get(function() {
  return this.roleLevel;
});

export default mongoose.model('User', userSchema);
