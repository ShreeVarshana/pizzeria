const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders - checkout (Pay button on Shopping Cart page)
router.post('/', async (req, res) => {
  try {
    const { items, pizzaSubtotal, ingredientsTotal, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty. Cannot place an order.' });
    }
    if (typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ message: 'Invalid order total.' });
    }

    const order = new Order({
      items,
      pizzaSubtotal,
      ingredientsTotal,
      total,
      status: 'paid'
    });
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders - list past orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
