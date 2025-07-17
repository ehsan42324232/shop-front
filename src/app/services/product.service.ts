import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models';
import { environment } from '../../environments/environment';
import { ProductAttributeValue, SetProductAttributeRequest } from '../models/product-attribute-value.model';
import { BulkImportLog } from '../models/bulk-import-log.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private ratingsUrl = `${environment.apiUrl}/ratings`;
  private commentsUrl = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('X-Store-Domain', window.location.hostname);
  }

  getProducts(params?: any): Observable<any> {
    const headers = this.getHeaders();
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get(this.apiUrl, { headers, params: httpParams });
  }

  getProduct(id: string): Observable<Product> {
    const headers = this.getHeaders();
    return this.http.get<Product>(`${this.apiUrl}/${id}`, { headers });
  }

  createProduct(product: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Product Attributes
  getProductAttributes(productId: string): Observable<ProductAttributeValue[]> {
    return this.http.get<ProductAttributeValue[]>(`${this.apiUrl}/${productId}/attributes`);
  }

  setProductAttributes(productId: string, attributes: SetProductAttributeRequest[]): Observable<ProductAttributeValue[]> {
    return this.http.post<ProductAttributeValue[]>(`${this.apiUrl}/${productId}/attributes`, {
      attributes: attributes
    });
  }

  updateProductAttributes(productId: string, attributes: SetProductAttributeRequest[]): Observable<ProductAttributeValue[]> {
    return this.http.put<ProductAttributeValue[]>(`${this.apiUrl}/${productId}/attributes`, {
      attributes: attributes
    });
  }

  // Bulk Import
  bulkImport(formData: FormData): Observable<BulkImportLog> {
    return this.http.post<BulkImportLog>(`${this.apiUrl}/bulk_import`, formData);
  }

  // Featured Products
  getFeaturedProducts(): Observable<Product[]> {
    const headers = this.getHeaders();
    return this.http.get<Product[]>(`${this.apiUrl}/featured`, { headers });
  }

  // Search
  searchProducts(query: string, params?: any): Observable<any> {
    const headers = this.getHeaders();
    let httpParams = new HttpParams().set('q', query);
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get(`${this.apiUrl}/search`, { headers, params: httpParams });
  }

  // Ratings and Comments
  addRating(productId: string, rating: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.ratingsUrl, { 
      product: productId, 
      score: rating 
    }, { headers });
  }

  addComment(productId: string, text: string, title?: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.commentsUrl, { 
      product: productId, 
      text,
      title
    }, { headers });
  }

  // Category filtering
  getProductsByCategory(categoryId: string): Observable<any> {
    const headers = this.getHeaders();
    const params = new HttpParams().set('category', categoryId);
    return this.http.get(this.apiUrl, { headers, params });
  }

  // Attribute filtering
  getProductsByAttributes(attributes: { [key: string]: string }): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    
    Object.keys(attributes).forEach(key => {
      if (attributes[key]) {
        params = params.set(`attr_${key}`, attributes[key]);
      }
    });
    
    return this.http.get(this.apiUrl, { headers, params });
  }

  // Price filtering
  getProductsByPriceRange(minPrice?: number, maxPrice?: number): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    
    if (minPrice !== undefined) {
      params = params.set('min_price', minPrice.toString());
    }
    if (maxPrice !== undefined) {
      params = params.set('max_price', maxPrice.toString());
    }
    
    return this.http.get(this.apiUrl, { headers, params });
  }

  // Stock filtering
  getProductsByStock(inStock?: boolean): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    
    if (inStock !== undefined) {
      params = params.set('in_stock', inStock.toString());
    }
    
    return this.http.get(this.apiUrl, { headers, params });
  }

  // Add to basket
  addToBasket(productId: string, quantity: number = 1): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/${productId}/add_to_basket`, {
      quantity
    }, { headers });
  }
}
