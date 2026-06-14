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

  cart = this.cartService.cart;

  get isVisible(): boolean {
    return this.cartService.isCartVisible();
  }

  set isVisible(val: boolean) {
    this.cartService.toggleCart(val);
  }

  closeCart() {
    this.cartService.toggleCart(false);
  }

  private readonly messageService = inject(MessageService);

  removeItem(cartItemId: string) {
    this.cartService.removeFromCart(cartItemId).subscribe({
      error: (err) => {
        console.error('Erreur lors de la suppression du produit', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de supprimer ce produit du panier.'
        });
      }
    });
  }
}
