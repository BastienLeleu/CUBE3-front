import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { CartService } from '../../cart/cart';
import { Router, provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: { login: ReturnType<typeof vi.fn> };
  let mockCartService: { fetchUserCart: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockAuthService = {
      login: vi.fn().mockReturnValue(of({}))
    };
    mockCartService = {
      fetchUserCart: vi.fn().mockReturnValue(of({ items: [], total: 0 }))
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CartService, useValue: mockCartService },
        MessageService,
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should be valid when filled correctly', () => {
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('password123');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should not call authService.login if form is invalid', () => {
    component.onSubmit();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should call authService.login and navigate on success', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('password123');
    
    component.onSubmit();
    
    expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' });
    expect(mockCartService.fetchUserCart).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/catalog']);
  });

  it('should set errorMessage on failure', () => {
    mockAuthService.login.mockReturnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));
    
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('password123');
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Invalid credentials');
  });

  it('should extract errorMessage from array correctly on failure', () => {
    mockAuthService.login.mockReturnValue(throwError(() => ({ error: { message: ['Error 1', 'Error 2'] } })));
    
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('password123');
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Error 1');
  });
});
