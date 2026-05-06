
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id?: string; name: string; description: string; category: string;
  quantity: number; price: number; imageUrl?: string; createdBy?: string;
}
export interface ProductsResponse {
  data: Product[];
  pagination: { total: number; page: number; limit: number; totalPages: number; };
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = environment.apiUrl + '/products';

  constructor(private http: HttpClient) {}

  getProducts(params: { search?: string; category?: string; page?: number; limit?: number; } = {}): Observable<ProductsResponse> {
    let p = new HttpParams();
    if (params.search) p = p.set('search', params.search);
    if (params.category) p = p.set('category', params.category);
    if (params.page) p = p.set('page', params.page.toString());
    if (params.limit) p = p.set('limit', params.limit.toString());
    return this.http.get<ProductsResponse>(this.apiUrl, { params: p });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(this.apiUrl + '/' + id);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl + '/categories');
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, formData);
  }

  updateProduct(id: string, formData: FormData): Observable<Product> {
    return this.http.put<Product>(this.apiUrl + '/' + id, formData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id);
  }
}
