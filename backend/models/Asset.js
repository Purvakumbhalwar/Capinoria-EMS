import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Listed Share', 'Unlisted Share', 'Mutual Fund'], required: true },
  currentValue: { type: Number, required: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('Asset', assetSchema);
