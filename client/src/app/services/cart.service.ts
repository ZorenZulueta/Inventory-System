import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  maxStock: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartKey = 'stockflow_cart';
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  items$ = this.itemsSubject.asObservable();

  get items(): CartItem[] { return this.itemsSubject.value; }

  get totalItems(): number {
    return this.items.reduce((s, i) => s + i.quantity, 0);
  }

  get totalPrice(): number {
    return this.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }

  addToCart(product: any, qty = 1): void {
    const cart = [...this.items];
    const idx = cart.findIndex(i => i.productId === product.id);
    if (idx > -1) {
      const newQty = cart[idx].quantity + qty;
      cart[idx] = { ...cart[idx], quantity: Math.min(newQty, cart[idx].maxStock) };
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        imageUrl: product.imageUrl,
        maxStock: product.quantity,
      });
    }
    this.save(cart);
  }

  updateQty(productId: string, qty: number): void {
    const cart = this.items.map(i =>
      i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(qty, i.maxStock)) } : i
    );
    this.save(cart);
  }

  remove(productId: string): void {
    this.save(this.items.filter(i => i.productId !== productId));
  }

  clear(): void { this.save([]); }

  isInCart(productId: string): boolean {
    return this.items.some(i => i.productId === productId);
  }

  private save(cart: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.itemsSubject.next(cart);
  }

  private loadCart(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
    } catch { return []; }
  }
}