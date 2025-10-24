const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true
  },
  clientImage: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  comment: {
    type: String,
    required: true
  },
  service: String,
  featured: {
    type: Boolean,
    default: false
  },
  approved: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
