import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { BasketItem } from '../models';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private basketUrl = '/api/basket/';
  private addUrl = '/api/basket/add/';
  private updateUrl = '/api/basket/update/';
  private removeUrl = '/api/basket/remove/';
  private clearUrl = '/api/basket/clear/';
  private checkoutUrl = '/api/checkout/';

  private basketItemsSubject = new BehaviorSubject<BasketItem[]>([]);
  public basketItems$ = this.basketItemsSubject.asObservable();

  private basketCountSubject = new BehaviorSubject<number>(0);
  public basketCount$ = this.basketCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadBasket();
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('X-Store-Domain', window.location.hostname);
  }

  loadBasket(): void {
    this.getBasket().subscribe({
      next: (basket) => {
        const items = basket.items || [];
        this.basketItemsSubject.next(items);
        this.updateBasketCount(items);
      },
      error: (error) => {
        console.error('Error loading basket:', error);
        this.basketItemsSubject.next([]);
        this.basketCountSubject.next(0);
      }
    });
  }

  private updateBasketCount(items: BasketItem[]): void {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    this.basketCountSubject.next(count);
  }

  getBasket(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.basketUrl, { headers });
  }

  addToBasket(productId: number, quantity: number = 1): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.addUrl, { product_id: productId, quantity }, { headers }).pipe(
      tap(() => this.loadBasket())
    );
  }

  updateBasketItem(itemId: number, quantity: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.updateUrl}${itemId}/`, { quantity }, { headers }).pipe(
      tap(() => this.loadBasket())
    );
  }

  removeFromBasket(itemId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.removeUrl}${itemId}/`, { headers }).pipe(
      tap(() => this.loadBasket())
    );
  }

  clearBasket(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.clearUrl, {}, { headers }).pipe(
      tap(() => this.loadBasket())
    );
  }

  checkout(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.checkoutUrl, {}, { headers });
  }

  getBasketItems(): BasketItem[] {
    return this.basketItemsSubject.value;
  }

  getBasketCount(): number {
    return this.basketCountSubject.value;
  }
}
