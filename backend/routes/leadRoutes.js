import express from 'express';
import Lead from '../models/Lead.js';

const router = express.Router();

// Get all leads (populated)
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate('employee', 'firstName lastName roleLevel avatar')
      .populate('asset', 'name type currentValue')
      .sort({ date: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get leads for a specific employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const leads = await Lead.find({ employee: req.params.employeeId })
      .populate('employee', 'firstName lastName roleLevel avatar')
      .populate('asset', 'name type currentValue')
      .sort({ date: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Top Performing Employees (based on total generated amount)
router.get('/performance/top-employees', async (req, res) => {
  try {
    const topEmployees = await Lead.aggregate([
      { $match: { status: 'Closed' } },
      { $group: { _id: '$employee', totalRevenue: { $sum: '$amount' }, dealsClosed: { $sum: 1 } } },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'employeeDetails' } },
      { $unwind: '$employeeDetails' },
      { $addFields: { 'employeeDetails.name': { $concat: ['$employeeDetails.firstName', ' ', '$employeeDetails.lastName'] } } }
    ]);
    res.json(topEmployees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Biggest Clients
router.get('/performance/top-clients', async (req, res) => {
  try {
    const topClients = await Lead.aggregate([
      { $group: { _id: '$client', totalVolume: { $sum: '$amount' }, activeDeals: { $sum: 1 } } },
      { $sort: { totalVolume: -1 } },
      { $limit: 5 }
    ]);
    res.json(topClients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a lead
router.post('/', async (req, res) => {
  const lead = new Lead(req.body);
  try {
    const newLead = await lead.save();
    res.status(201).json(newLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a lead
router.put('/:id', async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('employee', 'firstName lastName roleLevel avatar');
    res.json(updatedLead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a lead
router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
