const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { authMiddleware } = require('../middleware/auth');

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { active: true };
    if (category) filter.category = category;
    
    const services = await Service.find(filter).sort({ order: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create service (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update service (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete service (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
