import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

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

  private readonly messageService = inject(MessageService);

  cart = signal<Cart>({ items: [], total: 0 });
  isCartVisible = signal<boolean>(false);

  fetchUserCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap(data => this.cart.set(data))
    );
  }

  addToCart(productId: string, quantity = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add`, { product_id: productId, quantity }).pipe(
      tap(data => {
        this.cart.set(data);
        this.toggleCart(true, true); // Auto-open cart on add, skip redundant fetch
      })
    );
  }

  removeFromCart(cartItemId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/remove/${cartItemId}`).pipe(
      tap(data => this.cart.set(data))
    );
  }

  toggleCart(visible?: boolean, skipFetch = false): void {
    const nextState = visible ?? !this.isCartVisible();
    this.isCartVisible.set(nextState);
    if (nextState && !skipFetch) {
      this.fetchUserCart().subscribe({
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger le panier.'
          });
          this.isCartVisible.set(false);
        }
      });
    }
  }
}
