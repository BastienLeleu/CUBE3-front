import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject<object>(PLATFORM_ID);

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  
  // Utilisation des Signals d'Angular pour gérer l'état réactif de l'utilisateur
  currentUser = signal<Record<string, unknown> | null>(null);

  constructor() {
    this.checkSession();
  }

  private checkSession() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        // Dans un cas réel, on décoderait le JWT pour récupérer l'utilisateur,
        // ou on appellerait une route /auth/me
        this.currentUser.set({ isAuthenticated: true });
      }
    }
  }

  register(userData: Record<string, unknown>): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: Record<string, unknown>): Observable<{ access_token?: string; user?: Record<string, unknown> }> {
    return this.http.post<{ access_token?: string; user?: Record<string, unknown> }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: { access_token?: string; user?: Record<string, unknown> }) => {
        if (response.access_token) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.access_token);
          }
          this.currentUser.set(response.user ?? null);
        }
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
