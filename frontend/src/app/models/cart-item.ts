export interface CartIngredient {
  name: string;
  price: number;
}

export interface CartItem {
  id: string;            // unique id for this cart line (pizza id, or generated for custom pizzas)
  name: string;
  unitPrice: number;     // base price per pizza
  quantity: number;
  image: string;
  type: 'pizza' | 'custom';
  ingredients?: CartIngredient[]; // only for custom-built pizzas
  ingredientsCost?: number;      // sum of ingredients[] price, per single pizza
}
