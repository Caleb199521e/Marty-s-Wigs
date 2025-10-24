const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all gallery items (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    
    const items = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured gallery items
router.get('/featured', async (req, res) => {
  try {
    const items = await Gallery.find({ featured: true }).sort({ order: 1 }).limit(4);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create gallery item (admin only)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const galleryData = {
      ...req.body,
      imageUrl: req.file ? req.file.path : req.body.imageUrl
    };
    
    const item = new Gallery(galleryData);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update gallery item (admin only)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }
    
    const item = await Gallery.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete gallery item (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
