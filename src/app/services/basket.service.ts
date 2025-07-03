
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private basketUrl = '/api/basket/';
  private addUrl = '/api/basket/add/';
  private checkoutUrl = '/api/checkout/';

  constructor(private http: HttpClient) {}

  getBasket(): Observable<any> {
    const headers = new HttpHeaders().set('X-Store-Domain', window.location.hostname);
    return this.http.get(this.basketUrl, { headers });
  }

  addToBasket(productId: number): Observable<any> {
    const headers = new HttpHeaders().set('X-Store-Domain', window.location.hostname);
    return this.http.post(this.addUrl, { product_id: productId }, { headers });
  }

  checkout(): Observable<any> {
    const headers = new HttpHeaders().set('X-Store-Domain', window.location.hostname);
    return this.http.post(this.checkoutUrl, {}, { headers });
  }
}
