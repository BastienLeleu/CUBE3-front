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

  private checkSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedIn = localStorage.getItem('is_logged_in');
      if (isLoggedIn === 'true') {
        try {
          const userDataStr = localStorage.getItem('user_data');
          if (!userDataStr) {
            throw new Error('No user data');
          }
          const userData = JSON.parse(userDataStr);
          this.currentUser.set(userData);
        } catch {
          this.clearLocalState();
        }
      }
    }
  }

  register(userData: Record<string, unknown>): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: Record<string, unknown>): Observable<{ message?: string; user?: Record<string, unknown> }> {
    return this.http.post<{ message?: string; user?: Record<string, unknown> }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.user) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('is_logged_in', 'true');
            localStorage.setItem('user_data', JSON.stringify(response.user));
          }
          this.currentUser.set(response.user);
        }
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => this.handleLogout(),
      error: () => this.handleLogout() // On nettoie même si l'API échoue
    });
  }

  private handleLogout(): void {
    this.clearLocalState();
    this.router.navigate(['/login']);
  }

  private clearLocalState(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('is_logged_in');
      localStorage.removeItem('user_data');
    }
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('is_logged_in') !== 'true') {
        return false;
      }
      try {
        const userDataStr = localStorage.getItem('user_data');
        if (!userDataStr) throw new Error('No user data');
        JSON.parse(userDataStr);
        return true;
      } catch {
        this.clearLocalState();
        return false;
      }
    }
    return false;
  }
}
