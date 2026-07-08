import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './auth/auth.service';
import { CartService } from './cart/cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('collector-front');

  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.cartService.fetchUserCart().subscribe();
    }
  }
}
