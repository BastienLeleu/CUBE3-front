import { Component, inject } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../cart';

@Component({
  selector: 'app-cart',
  imports: [DrawerModule, ButtonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent {
  private cartService = inject(CartService);

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

  removeItem(cartItemId: string) {
    this.cartService.removeFromCart(cartItemId).subscribe();
  }
}
