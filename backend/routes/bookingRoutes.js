// routes/bookingRoutes.js
import express from 'express';
import Booking from '../models/Booking.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// helper
const getCourtName = (courtId) => {
  const courts = { 1: 'Indoor Court ', 2: 'Outdoor Court', 3: 'Indoor Court', 4: 'OutdoorCourt' };
  return courts[courtId] || `Court ${courtId}`;
};

/* ---------- USER ROUTES ---------- */


router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { courtId, date, time, price } = req.body;
    const userId = req.user.userId;

    if (!courtId || !date || !time || !price) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existingBooking = await Booking.findOne({ courtId, date, time });
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const courtName = getCourtName(courtId);

    const booking = new Booking({
      userId,
      courtId,
      courtName,
      date,
      time,
      price,
      status: 'confirmed',     
    });

    await booking.save();

    res.status(201).json({ message: 'Booking created successfully', data: booking });
  } catch (err) {
    if(err.code ===11000){
      return res.status(400).json({message:'This time slot is already booked. Please choose another slot.'})
    }
    console.log('Booking error:', err);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Get user bookings
router.get('/user-bookings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });

    res.json({ message: 'Bookings fetched', data: bookings });
  } catch (err) {
    console.log('Fetch bookings error:', err);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Update booking 
router.put('/update/:id', authMiddleware, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.userId;
    const { courtId, date, time, price } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Completed booking cannot be edited' });
    }

    if (courtId) {
      booking.courtId = courtId;
      booking.courtName = getCourtName(courtId);
    }
    if (date) booking.date = date;
    if (time) booking.time = time;
    if (price) booking.price = price;

    await booking.save();

    res.json({ message: 'Booking updated', data: booking });
  } catch (err) {
    console.log('Update booking error:', err);
    res.status(500).json({ message: 'Error updating booking' });
  }
});

// Cancel / delete booking (user)
router.delete('/cancel/:id', authMiddleware, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.userId;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Booking.findByIdAndDelete(bookingId);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.log('Cancel booking error:', err);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});



// Get all bookings with user email (admin panel)
router.get('/bookings/all', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const bookings = await Booking.find()
      .populate('userId', 'email')
      .sort({ date: 1, time: 1 });

    res.json({ message: 'All bookings fetched', data: bookings });
  } catch (err) {
    console.log('Fetch all bookings error:', err);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Admin update booking status
router.patch('/admin/status/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status } = req.body; 
    const allowed = ['confirmed' ];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'email');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: 'Status updated', data: booking });
  } catch (err) {
    console.log('Update status error:', err);
    res.status(500).json({ message: 'Error updating status' });
  }
});

export default router;
