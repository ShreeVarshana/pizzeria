export interface Pizza {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'veg' | 'nonveg';
  ingredients: string;
  toppings: string;
}
