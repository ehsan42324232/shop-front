import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private ordersUrl = '/api/orders/';
  private createOrderUrl = '/api/orders/create/';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('X-Store-Domain', window.location.hostname);
  }

  createOrder(storeId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.createOrderUrl, { store_id: storeId }, { headers });
  }

  getOrders(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.ordersUrl, { headers });
  }

  getOrder(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.ordersUrl}${id}/`, { headers });
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch(`${this.ordersUrl}${id}/`, { status }, { headers });
  }
}
