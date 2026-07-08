import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirection vers la page de login en gardant l'URL demandée pour y revenir plus tard
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
