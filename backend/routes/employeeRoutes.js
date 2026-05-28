import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get all employees (mapped from Users)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const employees = users.map(u => ({
      _id: u._id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      phone: u.phone || 'N/A',
      location: u.location || 'Remote',
      role: u.roleLevel || 'Employee',
      department: u.department || 'General',
      avatar: u.avatar,
      status: u.isBlocked ? 'Blocked' : (u.status || 'Active')
    }));
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create an employee (Now creates a User)
router.post('/', async (req, res) => {
  const { name, employeeId, role, department, email, phone, location } = req.body;
  const nameParts = (name || '').trim().split(' ');
  const firstName = nameParts[0] || 'Unknown';
  const lastName = nameParts.slice(1).join(' ') || 'User';

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      firstName,
      lastName,
      email,
      phone,
      department,
      roleLevel: role || 'Employee',
      employeeId,
      password: 'password123', // Default password for HR onboarded employees
      location: location || 'Remote',
      status: 'Active'
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Block/Unblock an employee
router.put('/:id/block', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isBlocked = !user.isBlocked;
    const updatedUser = await user.save();
    
    // Return mapped object so frontend gets same format
    const emp = {
      _id: updatedUser._id,
      name: `${updatedUser.firstName} ${updatedUser.lastName}`,
      email: updatedUser.email,
      phone: updatedUser.phone || 'N/A',
      location: updatedUser.location || 'Remote',
      role: updatedUser.roleLevel || 'Employee',
      department: updatedUser.department || 'General',
      avatar: updatedUser.avatar,
      status: updatedUser.isBlocked ? 'Blocked' : (updatedUser.status || 'Active')
    };
    
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an employee (Deletes User)
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
