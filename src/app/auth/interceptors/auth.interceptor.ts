import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // L'authentification utilise désormais des cookies HttpOnly.
  // On s'assure que le navigateur envoie bien les cookies avec chaque requête.
  const cloned = req.clone({
    withCredentials: true
  });
  
  return next(cloned);
};
