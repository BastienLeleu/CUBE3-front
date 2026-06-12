import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../auth.service';
import { Router, provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: { register: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockAuthService = {
      register: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should be valid when filled correctly', () => {
    component.registerForm.controls['first_name'].setValue('John');
    component.registerForm.controls['last_name'].setValue('Doe');
    component.registerForm.controls['email'].setValue('test@test.com');
    component.registerForm.controls['password'].setValue('password123');
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should be invalid if password is less than 8 characters', () => {
    component.registerForm.controls['first_name'].setValue('John');
    component.registerForm.controls['last_name'].setValue('Doe');
    component.registerForm.controls['email'].setValue('test@test.com');
    component.registerForm.controls['password'].setValue('pass'); // Too short
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should not call authService.register if form is invalid', () => {
    component.onSubmit();
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it('should call authService.register and navigate on success', async () => {
    vi.useFakeTimers();
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.registerForm.controls['first_name'].setValue('John');
    component.registerForm.controls['last_name'].setValue('Doe');
    component.registerForm.controls['email'].setValue('test@test.com');
    component.registerForm.controls['password'].setValue('password123');
    
    component.onSubmit();
    
    expect(mockAuthService.register).toHaveBeenCalledWith({
      first_name: 'John',
      last_name: 'Doe',
      email: 'test@test.com',
      password: 'password123'
    });
    
    expect(component.successMessage).toBeTruthy();
    
    vi.advanceTimersByTime(2000);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    
    vi.useRealTimers();
  });

  it('should set errorMessage on failure', () => {
    mockAuthService.register.mockReturnValue(throwError(() => ({ error: { message: 'Registration failed' } })));
    
    component.registerForm.controls['first_name'].setValue('John');
    component.registerForm.controls['last_name'].setValue('Doe');
    component.registerForm.controls['email'].setValue('test@test.com');
    component.registerForm.controls['password'].setValue('password123');
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Registration failed');
  });

  it('should extract errorMessage from array correctly on failure', () => {
    mockAuthService.register.mockReturnValue(throwError(() => ({ error: { message: ['Error 1', 'Error 2'] } })));
    
    component.registerForm.controls['first_name'].setValue('John');
    component.registerForm.controls['last_name'].setValue('Doe');
    component.registerForm.controls['email'].setValue('test@test.com');
    component.registerForm.controls['password'].setValue('password123');
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Error 1');
  });
});
