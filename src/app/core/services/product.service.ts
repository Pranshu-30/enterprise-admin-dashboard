import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Product, ProductCreateDto } from '../models';

const PRODUCTS_API = environment.apiProducts ?? `${environment.apiUrl}/products`;

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(PRODUCTS_API);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${PRODUCTS_API}/${id}`);
  }

  createProduct(dto: ProductCreateDto): Observable<Product> {
    return this.http.post<Product>(PRODUCTS_API, dto);
  }

  updateProduct(id: number, dto: Partial<ProductCreateDto>): Observable<Product> {
    return this.http.patch<Product>(`${PRODUCTS_API}/${id}`, dto);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${PRODUCTS_API}/${id}`);
  }
}
