import { Component, inject } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../cart';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cart',
  imports: [DrawerModule, ButtonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);

  cart = this.cartService.cart;

  get isVisible(): boolean {
    return this.cartService.isCartVisible();
  }

  set isVisible(val: boolean) {
    this.cartService.toggleCart(val);
  }

  closeCart(): void {
    this.cartService.toggleCart(false);
  }

  removeItem(cartItemId: string): void {
    this.cartService.removeFromCart(cartItemId).subscribe({
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de supprimer ce produit du panier.'
        });
      }
    });
  }
}
