import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const createToken = (user) =>
  jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// USER SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);

    user = new User({ email, password: hash, isAdmin: false });
    await user.save();

    const token = createToken(user);

    res.status(201).json({
      message: 'User created successfully',
      data: { token, user: { _id: user._id, email: user.email, isAdmin: user.isAdmin } },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// USER LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const admin = await User.findOne({email, isAdmin:true});
      if(admin){
        return res.status(400).json({
          message: 'This email is registered as an admin. Please use Admin Login.',
        });
      }

    const user = await User.findOne({email});
    if (!user)
      return res.status(400).json({ message: 'User not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ message: 'Invalid password' });

    const token = createToken(user);

    res.json({
      message: 'Login successful',
      data: { token, user: { _id: user._id, email: user.email, isAdmin: user.isAdmin } },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN SIGNUP
router.post('/admin-signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: 'Admin already exists' });

    const hash = await bcrypt.hash(password, 10);

    user = new User({ email, password: hash, isAdmin: true });
    await user.save();

    const token = createToken(user);

    res.status(201).json({
      message: 'Admin account created successfully',
      data: { token, user: { _id: user._id, email: user.email, isAdmin: user.isAdmin } },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN LOGIN
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email, isAdmin: true });
    if (!user)
      return res.status(400).json({ message: 'Admin not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ message: 'Invalid password' });

    const token = createToken(user);

    res.json({
      message: 'Admin login successful',
      data: { token, user: { _id: user._id, email: user.email, isAdmin: user.isAdmin } },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
