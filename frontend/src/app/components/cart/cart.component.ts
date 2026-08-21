import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../models/cart-item';
import { CartService, CartTotals } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  totals: CartTotals = { pizzaSubtotal: 0, ingredientsTotal: 0, total: 0, itemCount: 0 };
  paying = false;
  paidMessage = '';
  errorMessage = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.items = items;
      this.totals = this.cartService.getTotals(items);
    });
  }

  increment(id: string): void {
    this.cartService.increment(id);
  }

  decrement(id: string): void {
    this.cartService.decrement(id);
  }

  remove(id: string): void {
    this.cartService.removeItem(id);
  }

  clear(): void {
    this.cartService.clearCart();
    this.paidMessage = '';
    this.errorMessage = '';
  }

  pay(): void {
    if (this.items.length === 0) return;
    this.paying = true;
    this.errorMessage = '';
    this.cartService.checkout().subscribe({
      next: () => {
        this.paying = false;
        this.paidMessage = 'Payment successful! Your pizza is on the way. 🍕';
        this.cartService.clearCart();
      },
      error: () => {
        this.paying = false;
        this.errorMessage = 'Payment failed. Please make sure the API server is running and try again.';
      }
    });
  }
}
