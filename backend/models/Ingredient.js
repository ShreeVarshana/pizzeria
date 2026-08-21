const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ingredient', IngredientSchema);
