const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  contact: {
    phone: String,
    email: String,
    address: String,
    whatsapp: String
  },
  social: {
    instagram: String,
    tiktok: String,
    facebook: String
  },
  businessHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  hero: {
    title: String,
    subtitle: String,
    imageUrl: String
  },
  about: {
    title: String,
    description: String,
    imageUrl: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
