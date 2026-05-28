import express from 'express';
import Asset from '../models/Asset.js';

const router = express.Router();

// Get all assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new asset
router.post('/', async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Top Assets Aggregation
router.get('/top', async (req, res) => {
  try {
    // This is a stub that will return assets roughly sorted by their innate value or total sales.
    // Real tracking would aggregate from Leads, but we can do a direct generic projection for quick load.
    const topAssets = await Asset.find().sort({ currentValue: -1 }).limit(5);
    res.json(topAssets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update asset
router.put('/:id', async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json(asset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
