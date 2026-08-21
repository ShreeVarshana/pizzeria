import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { OrderPizzaComponent } from './components/order-pizza/order-pizza.component';
import { BuildPizzaComponent } from './components/build-pizza/build-pizza.component';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'order-pizza', component: OrderPizzaComponent },
  { path: 'build-pizza', component: BuildPizzaComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '' }
];
