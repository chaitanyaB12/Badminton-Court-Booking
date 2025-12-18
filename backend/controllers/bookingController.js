const Booking = require('../models/Booking');
const Court = require('../models/Court');
const pricingService = require('../services/pricingService');

// Get available slots
exports.getAvailableSlots = async (req, res) => {
  try {
    const { courtId, date } = req.query;
    const slots = [];

    for (let hour = 6; hour < 22; hour++) {
      const startTime = String(hour).padStart(2, '0') + ':00';
      const endTime = String(hour + 1).padStart(2, '0') + ':00';

      const exists = await Booking.findOne({
        court: courtId,
        bookingDate: date,
        startTime,
        status: 'CONFIRMED'
      });

      slots.push({
        startTime,
        endTime,
        available: !exists
      });
    }

    res.json({ success: true, data: slots });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { courtId, bookingDate, startTime, endTime, equipmentIds = [], coachId } = req.body;

    // Check availability
    const exists = await Booking.findOne({
      court: courtId,
      bookingDate,
      startTime,
      status: 'CONFIRMED'
    });

    if (exists) {
      return res.status(400).json({ success: false, message: 'Slot not available' });
    }

    // Get court for base price
    const court = await Court.findById(courtId);

    // Calculate price
    const priceBreakdown = await pricingService.calculatePrice({
      basePrice: court.basePrice,
      courtType: court.type,
      bookingDate,
      startTime,
      endTime,
      equipmentIds,
      coachId
    });

    // Create booking
    const booking = new Booking({
      user: req.user || 'guest',
      court: courtId,
      equipment: equipmentIds,
      coach: coachId || null,
      bookingDate,
      startTime,
      endTime,
      priceBreakdown,
      status: 'CONFIRMED'
    });

    await booking.save();
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user || 'guest' })
      .populate('court')
      .populate('equipment')
      .populate('coach')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'CANCELLED' },
      { new: true }
    );

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
