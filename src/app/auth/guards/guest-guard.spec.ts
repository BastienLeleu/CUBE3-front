import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { guestGuard } from './guest-guard';
import { AuthService } from '../auth.service';
import { vi } from 'vitest';

describe('guestGuard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAuthService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;

  beforeEach(() => {
    mockAuthService = {
      isAuthenticated: vi.fn()
    };
    mockRouter = {
      navigate: vi.fn(),
      createUrlTree: vi.fn().mockReturnValue('mockUrlTree')
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should return true if user is not authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    const result = TestBed.runInInjectionContext(() => guestGuard({} as import('@angular/router').ActivatedRouteSnapshot, {} as import('@angular/router').RouterStateSnapshot));
    expect(result).toBe(true);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should return a UrlTree to navigate to catalog if authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() => guestGuard({} as import('@angular/router').ActivatedRouteSnapshot, {} as import('@angular/router').RouterStateSnapshot));
    expect(result).toBe('mockUrlTree');
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/catalog']);
  });
});
