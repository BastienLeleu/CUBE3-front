import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from './app.routes';
import { AuthService } from './auth/auth.service';
import { vi } from 'vitest';

describe('App Routes', () => {
  let router: Router;
  let location: Location;
  let authServiceMock: { isAuthenticated: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should block unauthenticated users from protected routes and redirect to /login', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    
    await router.navigate(['/catalog']);
    expect(location.path()).toBe('/login');
  });

  it('should redirect authenticated users to /catalog on default route', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    
    await router.navigate(['/']);
    expect(location.path()).toBe('/catalog');
  });

  it('should allow unauthenticated users to access AuthLayoutComponent routes like /login and /register', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    
    await router.navigate(['/login']);
    expect(location.path()).toBe('/login');
    
    await router.navigate(['/register']);
    expect(location.path()).toBe('/register');
  });

  it('should redirect wildcard routes to /catalog', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    
    await router.navigate(['/some-random-url']);
    expect(location.path()).toBe('/catalog');
  });

  it('should block authenticated users from AuthLayoutComponent routes and redirect to /catalog', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    
    await router.navigate(['/login']);
    expect(location.path()).toBe('/catalog');
    
    await router.navigate(['/register']);
    expect(location.path()).toBe('/catalog');
  });
});
