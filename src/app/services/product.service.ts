import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = '/api/products/';
  private ratingsUrl = '/api/ratings/';
  private commentsUrl = '/api/comments/';

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

  getProduct(id: number): Observable<Product> {
    const headers = this.getHeaders();
    return this.http.get<Product>(`${this.apiUrl}${id}/`, { headers });
  }

  addRating(productId: number, rating: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.ratingsUrl, { 
      product: productId, 
      rating 
    }, { headers });
  }

  addComment(productId: number, text: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.commentsUrl, { 
      product: productId, 
      text 
    }, { headers });
  }

  searchProducts(query: string): Observable<any> {
    const headers = this.getHeaders();
    const params = new HttpParams().set('search', query);
    return this.http.get(this.apiUrl, { headers, params });
  }

  getProductsByCategory(categoryId: number): Observable<any> {
    const headers = this.getHeaders();
    const params = new HttpParams().set('category', categoryId.toString());
    return this.http.get(this.apiUrl, { headers, params });
  }
}
