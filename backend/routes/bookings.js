const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { authMiddleware } = require('../middleware/auth');

// Create booking (public)
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    
    // TODO: Send confirmation email/SMS
    
    res.status(201).json({ 
      message: 'Booking request submitted successfully',
      booking 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all bookings (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }
    
    const bookings = await Booking.find(filter).sort({ date: 1, createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status (admin only)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
