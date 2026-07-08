import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CartService, Cart } from './cart';
import { environment } from '../../environments/environment';
import { MessageService } from 'primeng/api';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/cart`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartService,
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService
      ]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty cart', () => {
    const initialCart = service.cart();
    expect(initialCart.items).toHaveLength(0);
    expect(initialCart.total).toBe(0);
  });

  it('fetchUserCart should update signal on success', () => {
    const mockCart: Cart = {
      items: [
        { id: '1', product_id: 'p1', quantity: 2, product: { id: 'p1', title: 'Test', price: 10 } }
      ],
      total: 20
    };

    service.fetchUserCart().subscribe();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCart);

    const updatedCart = service.cart();
    expect(updatedCart).toEqual(mockCart);
  });

  it('toggleCart should fetch cart if set to true', () => {
    service.toggleCart(true);

    expect(service.isCartVisible()).toBe(true);
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ items: [], total: 0 });
  });

  it('toggleCart should toggle boolean state', () => {
    service.toggleCart(); // should be true
    const req = httpMock.expectOne(apiUrl);
    req.flush({ items: [], total: 0 });
    expect(service.isCartVisible()).toBe(true);

    service.toggleCart(); // should be false
    expect(service.isCartVisible()).toBe(false);
  });

  it('addToCart should post to api, update signal and auto-open cart', () => {
    const mockCart: Cart = {
      items: [
        { id: '1', product_id: 'p1', quantity: 1, product: { id: 'p1', title: 'Test', price: 10 } }
      ],
      total: 10
    };

    service.addToCart('p1', 1).subscribe();

    const reqAdd = httpMock.expectOne(`${apiUrl}/add`);
    expect(reqAdd.request.method).toBe('POST');
    expect(reqAdd.request.body).toEqual({ product_id: 'p1', quantity: 1 });
    reqAdd.flush(mockCart);

    expect(service.cart()).toEqual(mockCart);
    expect(service.isCartVisible()).toBe(true);
  });
});
