const express = require('express');
const router = express.Router();
const Pizza = require('../models/Pizza');

// GET /api/pizzas - list all pizzas (Order Pizza page)
router.get('/', async (req, res) => {
  try {
    const pizzas = await Pizza.find().sort({ createdAt: 1 });
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/pizzas/:id
router.get('/:id', async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    res.json(pizza);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/pizzas - create pizza (admin/seed use)
router.post('/', async (req, res) => {
  try {
    const pizza = new Pizza(req.body);
    const saved = await pizza.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/pizzas/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Pizza.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: 'Pizza not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/pizzas/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Pizza.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Pizza not found' });
    res.json({ message: 'Pizza deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
