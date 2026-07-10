import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './auth/interceptors/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { CartService } from './cart/cart';
import { catchError, of, take } from 'rxjs';

export function initializeApp(authService: AuthService, cartService: CartService, messageService: MessageService) {
  return () => {
    if (authService.isAuthenticated()) {
      return cartService.fetchUserCart().pipe(
        take(1),
        catchError(() => {
          messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de synchroniser le panier.' });
          return of(null);
        })
      );
    }
    return of(null);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService, CartService, MessageService],
      multi: true
    },
    MessageService,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({ 
      theme: { 
        preset: Aura,
        options: {
          darkModeSelector: '.dark'
        }
      } 
    })
  ]
};
