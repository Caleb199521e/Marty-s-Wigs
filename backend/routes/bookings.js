const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { authMiddleware } = require('../middleware/auth');

// Create booking (public)
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    
    // Return success with booking data
    res.status(201).json({
      message: 'Booking request received successfully',
      booking: booking,
      whatsappNumber: process.env.WHATSAPP_NUMBER || null
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all bookings (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status (admin only)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete booking (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
