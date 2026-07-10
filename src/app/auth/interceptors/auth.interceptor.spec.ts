import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { vi } from 'vitest';

describe('authInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should clone the request and set withCredentials to true', () => {
    const request = new HttpRequest('GET', '/test-url');
    const next: HttpHandlerFn = vi.fn().mockImplementation((req) => req);

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, next);
    });

    expect(next).toHaveBeenCalled();
    const clonedReq = (next as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0] as HttpRequest<unknown>;
    expect(clonedReq.withCredentials).toBe(true);
  });
});
