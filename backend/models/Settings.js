const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  hero: {
    title: String,
    subtitle: String,
    image: String
  },
  contact: {
    phone: String,
    whatsapp: String,
    email: String,
    address: String
  },
  social: {
    instagram: String,
    tiktok: String,
    facebook: String
  },
  about: {
    title: String,
    description: String,
    image: String  // Add about image field
  },
  businessHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
