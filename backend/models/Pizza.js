const mongoose = require('mongoose');

const PizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    // 'veg' -> green indicator, 'nonveg' -> red indicator (see screenshots)
    category: { type: String, enum: ['veg', 'nonveg'], required: true },
    ingredients: { type: String, required: true }, // e.g. "dough/flour,pizza sauce,pizza seasoning,cheese"
    toppings: { type: String, required: true } // e.g. "Paneer,Fried Onion,Green olive"
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pizza', PizzaSchema);
