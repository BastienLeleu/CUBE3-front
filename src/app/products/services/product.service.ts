import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../core/models/product.model';
import { environment } from '../../../environments/environment';

export interface GetProductsParams {
  search?: string;
  category?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private http = inject(HttpClient);

  getProducts(params?: GetProductsParams): Observable<Product[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          httpParams = httpParams.set(key, value);
        }
      });
    }

    return this.http.get<Product[]>(this.apiUrl, { params: httpParams });
  }
}
