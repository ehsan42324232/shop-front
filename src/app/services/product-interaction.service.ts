
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductInteractionService {
  private rateUrl = '/api/products/';
  private commentUrl = '/api/products/';

  constructor(private http: HttpClient) {}

  rateProduct(productId: number, rating: number): Observable<any> {
    return this.http.post(`${this.rateUrl}${productId}/rate/`, { rating });
  }

  commentProduct(productId: number, comment: string): Observable<any> {
    return this.http.post(`${this.commentUrl}${productId}/comment/`, { comment });
  }
}
