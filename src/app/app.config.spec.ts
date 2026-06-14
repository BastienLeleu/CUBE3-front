import { AuthService } from './auth/auth.service';
import { CartService } from './cart/cart';
import { initializeApp } from './app.config';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { MessageService } from 'primeng/api';

describe('AppConfig initializeApp', () => {
  let mockAuthService: { isAuthenticated: ReturnType<typeof vi.fn> };
  let mockCartService: { fetchUserCart: ReturnType<typeof vi.fn> };
  let mockMessageService: { add: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockAuthService = {
      isAuthenticated: vi.fn()
    };
    mockCartService = {
      fetchUserCart: vi.fn()
    };
    mockMessageService = {
      add: vi.fn()
    };
    
    // Silence console.error for test output cleanliness
    vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch the cart if the user is authenticated', () => {
    return new Promise<void>((resolve) => {
      mockAuthService.isAuthenticated.mockReturnValue(true);
      mockCartService.fetchUserCart.mockReturnValue(of({ items: [] }));

      const initFn = initializeApp(
        mockAuthService as unknown as AuthService, 
        mockCartService as unknown as CartService,
        mockMessageService as unknown as MessageService
      );
      const result$ = initFn();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(mockCartService.fetchUserCart).toHaveBeenCalled();

      if (result$) {
        result$.subscribe(res => {
          expect(res).toEqual({ items: [] });
          resolve();
        });
      }
    });
  });

  it('should return null and handle error if fetchUserCart throws when authenticated', () => {
    return new Promise<void>((resolve) => {
      mockAuthService.isAuthenticated.mockReturnValue(true);
      mockCartService.fetchUserCart.mockReturnValue(throwError(() => new Error('API Error')));

      const initFn = initializeApp(
        mockAuthService as unknown as AuthService, 
        mockCartService as unknown as CartService,
        mockMessageService as unknown as MessageService
      );
      const result$ = initFn();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(mockCartService.fetchUserCart).toHaveBeenCalled();

      if (result$) {
        result$.subscribe(res => {
          expect(res).toBeNull();
          expect(console.error).toHaveBeenCalledWith('APP_INITIALIZER fetchUserCart failed:', expect.any(Error));
          expect(mockMessageService.add).toHaveBeenCalledWith({ severity: 'error', summary: 'Erreur', detail: 'Impossible de synchroniser le panier.' });
          resolve();
        });
      }
    });
  });

  it('should return null without fetching cart if user is not authenticated', () => {
    return new Promise<void>((resolve) => {
      mockAuthService.isAuthenticated.mockReturnValue(false);

      const initFn = initializeApp(
        mockAuthService as unknown as AuthService, 
        mockCartService as unknown as CartService,
        mockMessageService as unknown as MessageService
      );
      const result$ = initFn();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(mockCartService.fetchUserCart).not.toHaveBeenCalled();

      if (result$) {
        result$.subscribe(res => {
          expect(res).toBeNull();
          resolve();
        });
      }
    });
  });
});
