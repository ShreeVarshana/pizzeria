const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');

// GET /api/ingredients - list all ingredients (Build Ur Pizza page)
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ createdAt: 1 });
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/ingredients
router.post('/', async (req, res) => {
  try {
    const ingredient = new Ingredient(req.body);
    const saved = await ingredient.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/ingredients/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Ingredient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: 'Ingredient not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/ingredients/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Ingredient.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Ingredient not found' });
    res.json({ message: 'Ingredient deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
