import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRouter = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'browser' } // Simulate browser for localStorage
      ]
    });
    
    // Setup local storage mock
    let store: Record<string, string> = {};
    const mockLocalStorage = {
      getItem: (key: string): string | null => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    window.localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request on register', () => {
    const mockData = { email: 'test@test.com', password: 'password' };
    
    service.register(mockData).subscribe();

    const req = httpMock.expectOne(`${service['apiUrl']}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush({ message: 'Success' });
  });

  it('should set is_logged_in and user on successful login', () => {
    const mockCredentials = { email: 'test@test.com', password: 'password' };
    const mockResponse = { message: 'Success', user: { id: 1, email: 'test@test.com' } };

    service.login(mockCredentials).subscribe();

    const req = httpMock.expectOne(`${service['apiUrl']}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse);

    expect(localStorage.getItem('is_logged_in')).toBe('true');
    expect(localStorage.getItem('user_data')).toBe(JSON.stringify(mockResponse.user));
    expect(service.currentUser()).toEqual(mockResponse.user);
  });

  it('should call API, clear storage and user on logout and redirect', () => {
    localStorage.setItem('is_logged_in', 'true');
    localStorage.setItem('user_data', '{"id":1}');
    service.currentUser.set({ id: 1 });

    service.logout();

    const req = httpMock.expectOne(`${service['apiUrl']}/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({}); // mock successful response

    expect(localStorage.getItem('is_logged_in')).toBeNull();
    expect(localStorage.getItem('user_data')).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should verify authentication correctly', () => {
    expect(service.isAuthenticated()).toBe(false);
    localStorage.setItem('is_logged_in', 'true');
    localStorage.setItem('user_data', JSON.stringify({ id: '1' }));
    expect(service.isAuthenticated()).toBe(true);
  });
});
