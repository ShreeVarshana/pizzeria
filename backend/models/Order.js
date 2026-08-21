const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String },
    type: { type: String, enum: ['pizza', 'custom'], default: 'pizza' },
    ingredientsCost: { type: Number, default: 0 },
    ingredients: [{ name: String, price: Number }]
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    items: { type: [OrderItemSchema], required: true },
    pizzaSubtotal: { type: Number, required: true },
    ingredientsTotal: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ['placed', 'paid'], default: 'placed' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
