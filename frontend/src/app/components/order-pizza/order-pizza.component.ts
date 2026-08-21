import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pizza } from '../../models/pizza';
import { PizzaService } from '../../services/pizza.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order-pizza',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-pizza.component.html',
  styleUrl: './order-pizza.component.css'
})
export class OrderPizzaComponent implements OnInit {
  pizzas: Pizza[] = [];
  loading = true;
  error = '';
  addedIds = new Set<string>();
  activeFilter: 'all' | 'veg' | 'nonveg' = 'all';

  get visiblePizzas(): Pizza[] {
    return this.activeFilter === 'all'
      ? this.pizzas
      : this.pizzas.filter((pizza) => pizza.category === this.activeFilter);
  }

  constructor(private pizzaService: PizzaService, private cartService: CartService) {}

  ngOnInit(): void {
    this.pizzaService.getPizzas().subscribe({
      next: (data) => {
        this.pizzas = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load the menu. Please make sure the API server is running.';
        this.loading = false;
      }
    });
  }

  addToCart(pizza: Pizza): void {
    if (!pizza._id) return;
    this.cartService.addPizza(pizza._id, pizza.name, pizza.price, pizza.image);
    this.addedIds.add(pizza._id);
    setTimeout(() => this.addedIds.delete(pizza._id!), 1200);
  }

  setFilter(filter: 'all' | 'veg' | 'nonveg'): void {
    this.activeFilter = filter;
  }
}
