import { Component, inject, Signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { CartService } from '../../../cart/cart';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);


  cartItemCount: Signal<number> = computed(() => {
    const cart = this.cartService.cart();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  });

  openCart() {
    this.cartService.toggleCart(true);
  }

  logout() {
    this.authService.logout();
  }
}
