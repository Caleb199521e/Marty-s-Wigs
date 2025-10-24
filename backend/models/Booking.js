const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  email: String,
  service: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  depositPaid: {
    type: Boolean,
    default: false
  },
  totalPrice: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
