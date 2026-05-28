import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
  client: { type: String, required: true },
  contact: { type: String, required: true },
  status: { type: String, enum: ['Hot Lead', 'Follow Up', 'Cold', 'Closed'], default: 'Cold' },
  date: { type: Date, required: true },
  amount: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
