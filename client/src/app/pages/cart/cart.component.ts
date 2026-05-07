import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  apiUrl = environment.apiUrl.replace('/api', '');

  constructor(public cart: CartService) {}

  ngOnInit(): void {
    this.cart.items$.subscribe(items => this.items = items);
  }

  updateQty(productId: string, event: any): void {
    this.cart.updateQty(productId, +event.target.value);
  }

  remove(productId: string): void {
    this.cart.remove(productId);
  }

  formatCurrency(amount: number): string {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  }
}