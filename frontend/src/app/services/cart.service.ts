import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { environment } from '../../environments/environment';

export interface CartTotals {
  pizzaSubtotal: number;
  ingredientsTotal: number;
  total: number;
  itemCount: number;
}

const STORAGE_KEY = 'pizzeria_cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  private loadFromStorage(): CartItem[] {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private persist(items: CartItem[]) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  get currentItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  /** Add a whole pizza from the Order Pizza page (or increment qty if already in cart) */
  addPizza(id: string, name: string, unitPrice: number, image: string) {
    const items = [...this.currentItems];
    const existing = items.find((i) => i.id === id && i.type === 'pizza');
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ id, name, unitPrice, quantity: 1, image, type: 'pizza' });
    }
    this.persist(items);
  }

  /** Add a custom pizza built on the Build Your Pizza page */
  addCustomPizza(name: string, image: string, ingredients: { name: string; price: number }[]) {
    const ingredientsCost = ingredients.reduce((sum, ing) => sum + ing.price, 0);
    const items = [...this.currentItems];
    const id = `custom-${Date.now()}`;
    items.push({
      id,
      name,
      unitPrice: 0,
      quantity: 1,
      image,
      type: 'custom',
      ingredients,
      ingredientsCost
    });
    this.persist(items);
  }

  increment(id: string) {
    const items = this.currentItems.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
    this.persist(items);
  }

  decrement(id: string) {
    const items = this.currentItems
      .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
      .filter((i) => i.quantity > 0);
    this.persist(items);
  }

  removeItem(id: string) {
    const items = this.currentItems.filter((i) => i.id !== id);
    this.persist(items);
  }

  clearCart() {
    this.persist([]);
  }

  getTotals(items: CartItem[] = this.currentItems): CartTotals {
    const pizzaSubtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const ingredientsTotal = items.reduce(
      (sum, i) => sum + (i.ingredientsCost ? i.ingredientsCost * i.quantity : 0),
      0
    );
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    return {
      pizzaSubtotal,
      ingredientsTotal,
      total: pizzaSubtotal + ingredientsTotal,
      itemCount
    };
  }

  /** Checkout: POST the cart to the backend, then clear it on success */
  checkout(): Observable<any> {
    const items = this.currentItems;
    const totals = this.getTotals(items);
    const payload = {
      items: items.map((i) => ({
        name: i.name,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        image: i.image,
        type: i.type,
        ingredientsCost: i.ingredientsCost || 0,
        ingredients: i.ingredients || []
      })),
      pizzaSubtotal: totals.pizzaSubtotal,
      ingredientsTotal: totals.ingredientsTotal,
      total: totals.total
    };
    return this.http.post(this.baseUrl, payload);
  }
}
