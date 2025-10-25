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
    const items = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured gallery items (public)
router.get('/featured', async (req, res) => {
  try {
    const items = await Gallery.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(4);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image (admin only)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = req.file.path || req.file.location || `/uploads/${req.file.filename}`;

    const galleryItem = new Gallery({
      title: req.body.title || 'Untitled',
      imageUrl: imageUrl,
      category: req.body.category || 'wigs',
      featured: req.body.featured === 'true' || req.body.featured === true
    });

    await galleryItem.save();
    console.log('Gallery item saved:', galleryItem);

    res.status(201).json(galleryItem);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Toggle featured status (admin only)
router.patch('/:id/featured', authMiddleware, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    
    item.featured = !item.featured;
    await item.save();
    
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update gallery item (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, category: req.body.category },
      { new: true }
    );
    
    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete gallery item (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
