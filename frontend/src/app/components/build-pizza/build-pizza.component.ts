import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Ingredient } from '../../models/ingredient';
import { IngredientService } from '../../services/ingredient.service';
import { CartService } from '../../services/cart.service';

interface SelectableIngredient extends Ingredient {
  selected: boolean;
}

@Component({
  selector: 'app-build-pizza',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './build-pizza.component.html',
  styleUrl: './build-pizza.component.css'
})
export class BuildPizzaComponent implements OnInit {
  ingredients: SelectableIngredient[] = [];
  loading = true;
  error = '';
  built = false;

  constructor(private ingredientService: IngredientService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.ingredientService.getIngredients().subscribe({
      next: (data) => {
        this.ingredients = data.map((i) => ({ ...i, selected: false }));
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load ingredients. Please make sure the API server is running.';
        this.loading = false;
      }
    });
  }

  get totalCost(): number {
    return this.ingredients
      .filter((i) => i.selected)
      .reduce((sum, i) => sum + i.price, 0);
  }

  get selectedCount(): number {
    return this.ingredients.filter((i) => i.selected).length;
  }

  get selectedIngredients(): SelectableIngredient[] {
    return this.ingredients.filter((ingredient) => ingredient.selected);
  }

  buildPizza(): void {
    const selected = this.ingredients.filter((i) => i.selected);
    if (selected.length === 0) return;

    this.cartService.addCustomPizza(
      'Your Custom Pizza',
      'https://images.unsplash.com/photo-1548365328-9f547fb0953b?w=500',
      selected.map((i) => ({ name: i.name, price: i.price }))
    );

    this.built = true;
    setTimeout(() => this.router.navigate(['/cart']), 700);
  }
}
