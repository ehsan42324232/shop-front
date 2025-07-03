
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = '/api/products/';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    const headers = new HttpHeaders().set('X-Store-Domain', window.location.hostname);
    return this.http.get(this.apiUrl, { headers });
  }

  getProduct(id: number): Observable<any> {
    const headers = new HttpHeaders().set('X-Store-Domain', window.location.hostname);
    return this.http.get(`${this.apiUrl}${id}/`, { headers });
  }
}
