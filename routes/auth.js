import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     // Fixed credentials check
//     if (email === '12345@gmail.com' && password === '12345') {
//       // Create or find the admin user
//       let user = await User.findOne({ email });
//       if (!user) {
//         user = new User({ email, password });
//         await user.save();
//       }
      
//       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      
//       return res.json({
//         message: 'Login successful',
//         token,
//         user: { id: user._id, email: user.email }
//       });
//     }

//     res.status(401).json({ message: 'Invalid credentials' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email, password);

    const user = await User.findOne({ email });
    console.log('Found user:', user);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export default router;
