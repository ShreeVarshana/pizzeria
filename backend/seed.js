const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Pizza = require('./models/Pizza');
const Ingredient = require('./models/Ingredient');

const rawIngredients = require('./data/ingredients.json');
const rawPizzas = require('./data/pizzas.json');

// Map the provided dataset's field names (tname, type, topping[]) onto our schema
// (name, category, toppings as a comma-separated string).
const ingredients = rawIngredients.map((ing) => ({
  name: ing.tname,
  price: ing.price,
  image: ing.image
}));

const pizzas = rawPizzas.map((p) => ({
  name: p.name,
  description: p.description,
  price: Number(p.price),
  image: p.image,
  category: p.type === 'veg' ? 'veg' : 'nonveg',
  ingredients: Array.isArray(p.ingredients) ? p.ingredients.join(', ') : p.ingredients,
  toppings: Array.isArray(p.topping) ? p.topping.join(', ') : p.topping
}));

async function seed() {
  await connectDB();
  await Pizza.deleteMany({});
  await Ingredient.deleteMany({});
  await Pizza.insertMany(pizzas);
  await Ingredient.insertMany(ingredients);
  console.log('Seed data inserted:', pizzas.length, 'pizzas,', ingredients.length, 'ingredients');
  mongoose.connection.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
