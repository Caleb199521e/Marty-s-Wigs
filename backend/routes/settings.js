const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get settings (public)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload hero image (admin only) - separate from gallery
router.post('/hero-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    console.log('Hero image upload request received');
    console.log('File:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = req.file.path || req.file.location || `/uploads/${req.file.filename}`;
    
    // Update settings with hero image
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }
    
    settings.hero = settings.hero || {};
    settings.hero.image = imageUrl;
    
    await settings.save();
    
    console.log('Hero image saved to settings:', imageUrl);
    res.json({ imageUrl, message: 'Hero image uploaded successfully' });
    
  } catch (error) {
    console.error('Hero image upload error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Upload about image (admin only)
router.post('/about-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    console.log('About image upload request received');
    console.log('File:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = req.file.path || req.file.location || `/uploads/${req.file.filename}`;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }
    
    settings.about = settings.about || {};
    settings.about.image = imageUrl;
    
    await settings.save();
    
    console.log('About image saved to settings:', imageUrl);
    res.json({ imageUrl, message: 'About image uploaded successfully' });
    
  } catch (error) {
    console.error('About image upload error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update settings (admin only)
router.put('/', authMiddleware, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
