const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['wig', 'makeup'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priceRange: {
    min: Number,
    max: Number
  },
  priceNote: String,
  features: [String],
  duration: String,
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
