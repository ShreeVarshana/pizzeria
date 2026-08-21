import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  itemCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.itemCount = this.cartService.getTotals(items).itemCount;
    });
  }
}
