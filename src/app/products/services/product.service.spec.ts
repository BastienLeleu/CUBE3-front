import { TestBed } from '@angular/core/testing';
import { ProductService, GetProductsParams } from './product.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpClientMock: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    httpClientMock = {
      get: vi.fn().mockReturnValue(of([]))
    };

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(ProductService);
  });

  it('should call HttpClient.get with apiUrl and empty params when params is undefined', () => {
    service.getProducts();

    expect(httpClientMock.get).toHaveBeenCalledWith(`${environment.apiUrl}/products`, {
      params: new HttpParams()
    });

    const calledParams = httpClientMock.get.mock.calls[0][1].params as HttpParams;
    expect(calledParams.keys()).toHaveLength(0);
  });

  it('should transform GetProductsParams into HttpParams and send only truthy values', () => {
    const params: GetProductsParams = {
      search: 'test',
      category: 'Cards',
      condition: 'NEW'
    };

    service.getProducts(params);

    const calledParams = httpClientMock.get.mock.calls[0][1].params as HttpParams;
    expect(calledParams.get('search')).toBe('test');
    expect(calledParams.get('category')).toBe('Cards');
    expect(calledParams.get('condition')).toBe('NEW');
    expect(calledParams.keys()).toHaveLength(3);
  });

  it('should ignore falsy values when transforming GetProductsParams', () => {
    const params: GetProductsParams = {
      search: '',
      category: 'Cards',
      condition: undefined
    };

    // We force falsy values to verify the runtime behavior described
    const trickyParams = {
      ...params,
      minPrice: null,
      maxPrice: 0
    } as unknown as GetProductsParams;

    service.getProducts(trickyParams);

    const calledParams = httpClientMock.get.mock.calls[0][1].params as HttpParams;
    
    // Only 'category' should be retained because it's truthy
    expect(calledParams.has('search')).toBe(false); // '' is falsy
    expect(calledParams.has('condition')).toBe(false); // undefined is falsy
    expect(calledParams.has('minPrice')).toBe(false); // null is falsy
    expect(calledParams.has('maxPrice')).toBe(false); // 0 is falsy
    
    expect(calledParams.get('category')).toBe('Cards');
    expect(calledParams.keys()).toHaveLength(1);
  });
});
