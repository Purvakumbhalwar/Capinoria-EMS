import express from 'express';
import Leave from '../models/Leave.js';

const router = express.Router();

// Get all leaves (populate employee details for HR)
router.get('/', async (req, res) => {
  try {
    const leaves = await Leave.find().populate('employee', 'firstName lastName roleLevel avatar').sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get leaves for specific employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.params.employeeId })
      .populate('employee', 'firstName lastName roleLevel avatar')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Apply for leave
router.post('/', async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    
    // send back with populated employee for reactive UI mapping
    const populated = await Leave.findById(leave._id).populate('employee', 'firstName lastName roleLevel avatar');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update leave status
router.patch('/:id', async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    ).populate('employee', 'firstName lastName roleLevel avatar');
    res.json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
