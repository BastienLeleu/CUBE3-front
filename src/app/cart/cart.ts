import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    images?: string[];
  };
}

export interface Cart {
  items: CartItem[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cart`;

  cart = signal<Cart>({ items: [], total: 0 });
  isCartVisible = signal<boolean>(false);

  fetchUserCart() {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap(data => this.cart.set(data))
    );
  }

  addToCart(productId: string, quantity = 1) {
    return this.http.post<Cart>(`${this.apiUrl}/add`, { product_id: productId, quantity }).pipe(
      tap(data => {
        this.cart.set(data);
        this.toggleCart(true); // Auto-open cart on add
      })
    );
  }

  removeFromCart(cartItemId: string) {
    return this.http.delete<Cart>(`${this.apiUrl}/remove/${cartItemId}`).pipe(
      tap(data => this.cart.set(data))
    );
  }

  toggleCart(visible?: boolean) {
    const nextState = visible !== undefined ? visible : !this.isCartVisible();
    this.isCartVisible.set(nextState);
    if (nextState) {
      this.fetchUserCart().subscribe();
    }
  }
}
