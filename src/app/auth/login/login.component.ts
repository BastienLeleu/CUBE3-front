import { Component, inject, ChangeDetectorRef } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../auth.service';
import { CartService } from '../../cart/cart';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule
],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly messageService = inject(MessageService);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.cartService.fetchUserCart().subscribe({
          next: (cart) => {
            if (cart && cart.items && cart.items.length > 0) {
              this.messageService.add({ severity: 'info', summary: 'Panier synchronisé', detail: `Vous avez ${cart.items.length} produit(s) en attente.` });
              this.cartService.toggleCart(true);
            }
            this.cdr.detectChanges();
            this.router.navigate(['/catalog']);
          },
          error: () => {
            this.cdr.detectChanges();
            this.router.navigate(['/catalog']);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          this.errorMessage = 'Serveur injoignable, veuillez réessayer plus tard.';
        } else {
          const msg = err.error?.message;
          this.errorMessage = Array.isArray(msg) ? msg[0] : (msg || 'Identifiants invalides');
        }
        this.cdr.detectChanges();
      }
    });
  }
}
