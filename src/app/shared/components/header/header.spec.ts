import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header';
import { CartService, Cart } from '../../../cart/cart';
import { AuthService } from '../../../auth/auth.service';
import { provideRouter } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { vi } from 'vitest';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAuthService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockCartService: any;
  let cartSignal: WritableSignal<Cart | null>;

  beforeEach(async () => {
    mockAuthService = {
      logout: vi.fn()
    };

    cartSignal = signal<Cart | null>({ items: [], total: 0 });

    mockCartService = {
      cart: cartSignal,
      toggleCart: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CartService, useValue: mockCartService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate cartItemCount correctly from signal', () => {
    // Empty cart
    expect(component.cartItemCount()).toBe(0);

    // Cart with items
    cartSignal.set({
      items: [
        { id: '1', product_id: 'p1', quantity: 2, product: { id: 'p1', title: 'Test', price: 10 } },
        { id: '2', product_id: 'p2', quantity: 1, product: { id: 'p2', title: 'Test 2', price: 20 } }
      ],
      total: 40
    });
    
    // The signal computation is reactive and should immediately reflect changes
    expect(component.cartItemCount()).toBe(3); // 2 + 1
  });

  it('should call authService.logout on logout', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should call cartService.toggleCart on openCart', () => {
    component.openCart();
    expect(mockCartService.toggleCart).toHaveBeenCalledWith(true);
  });
});
