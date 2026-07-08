import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogComponent } from './catalog.component';
import { ProductService } from '../services/product.service';
import { Product, ProductCondition } from '../../core/models/product.model';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;
  let productServiceMock: { getProducts: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    productServiceMock = {
      getProducts: vi.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [CatalogComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        MessageService,
        provideNoopAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial filter defaults', () => {
    expect(component.searchQuery()).toBe('');
    expect(component.selectedCategory()).toBeNull();
    expect(component.selectedCondition()).toBeNull();
    expect(component.priceRange()).toEqual([0, 5000]);
  });

  it('should call loadProducts on init and populate products', () => {
    const mockProducts = [
      { 
        id: '1', 
        title: 'Test Product', 
        condition: ProductCondition.NEW,
        seller: { first_name: 'John', last_name: 'Doe' }
      } as unknown as Product
    ];
    productServiceMock.getProducts.mockReturnValue(of(mockProducts));

    fixture.detectChanges(); // calls ngOnInit -> loadProducts

    expect(productServiceMock.getProducts).toHaveBeenCalledWith({
      search: undefined,
      category: undefined,
      condition: undefined,
      minPrice: '0',
      maxPrice: '5000'
    });
    expect(component.products()).toEqual(mockProducts);
  });

  it('should invoke loadProducts when onFilterChange is called', () => {
    vi.spyOn(component, 'loadProducts');
    component.onFilterChange();
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('should return correct severity for each ProductCondition', () => {
    expect(component.getConditionSeverity(ProductCondition.NEW)).toBe('success');
    expect(component.getConditionSeverity(ProductCondition.VERY_GOOD)).toBe('info');
    expect(component.getConditionSeverity(ProductCondition.GOOD)).toBe('warn');
    expect(component.getConditionSeverity(ProductCondition.USED)).toBe('danger');
    
    // Test the default branch
    expect(component.getConditionSeverity('UNKNOWN' as unknown as ProductCondition)).toBe('info');
  });

  it('should handle errors in loadProducts and set errorMessage', () => {
    const error = new Error('Network error');
    productServiceMock.getProducts.mockReturnValue(throwError(() => error));

    fixture.detectChanges(); // triggers loadProducts via ngOnInit

    expect(component.errorMessage()).toBe('Network error');
  });
});
