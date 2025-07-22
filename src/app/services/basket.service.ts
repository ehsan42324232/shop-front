import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { BasketItem, Product, LegacyProduct } from '../models';

export interface CartSummary {
  items: BasketItem[];
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
  variant_id?: number;
  attributes?: { [key: string]: string };
}

export interface UpdateCartItemRequest {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private apiUrl = environment.apiUrl || 'http://localhost:8000/api';
  private basketUrl = `${this.apiUrl}/basket/`;
  
  // Cart state management
  private cartItemsSubject = new BehaviorSubject<BasketItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();
  
  private cartTotalSubject = new BehaviorSubject<number>(0);
  public cartTotal$ = this.cartTotalSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load cart on service initialization
    this.loadCart();
  }

  /**
   * Load cart from server
   */
  loadCart(): Observable<BasketItem[]> {
    this.loadingSubject.next(true);
    
    return this.http.get<BasketItem[]>(this.basketUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(items => {
        this.updateCartState(items);
      }),
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Get cart summary with totals
   */
  getCartSummary(): Observable<CartSummary> {
    return this.http.get<CartSummary>(`${this.basketUrl}summary/`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(summary => {
        this.updateCartState(summary.items);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Add item to cart
   */
  addToCart(request: AddToCartRequest): Observable<BasketItem> {
    this.loadingSubject.next(true);
    
    return this.http.post<BasketItem>(`${this.basketUrl}add_item/`, request, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        // Reload cart to get updated state
        this.loadCart().subscribe();
      }),
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Update cart item quantity
   */
  updateCartItem(itemId: number, request: UpdateCartItemRequest): Observable<BasketItem> {
    this.loadingSubject.next(true);
    
    return this.http.post<BasketItem>(`${this.basketUrl}${itemId}/update_quantity/`, request, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        // Reload cart to get updated state
        this.loadCart().subscribe();
      }),
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Remove item from cart
   */
  removeFromCart(itemId: number): Observable<any> {
    this.loadingSubject.next(true);
    
    return this.http.delete(`${this.basketUrl}${itemId}/`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        // Reload cart to get updated state
        this.loadCart().subscribe();
      }),
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Clear entire cart
   */
  clearCart(): Observable<any> {
    this.loadingSubject.next(true);
    
    return this.http.post(`${this.basketUrl}clear/`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        this.updateCartState([]);
      }),
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Check if product is in cart
   */
  isProductInCart(productId: number): boolean {
    const items = this.cartItemsSubject.value;
    return items.some(item => item.product.id === productId);
  }

  /**
   * Get cart item by product ID
   */
  getCartItemByProduct(productId: number): BasketItem | undefined {
    const items = this.cartItemsSubject.value;
    return items.find(item => item.product.id === productId);
  }

  /**
   * Get current cart items
   */
  getCurrentCartItems(): BasketItem[] {
    return this.cartItemsSubject.value;
  }

  /**
   * Get current cart count
   */
  getCurrentCartCount(): number {
    return this.cartCountSubject.value;
  }

  /**
   * Get current cart total
   */
  getCurrentCartTotal(): number {
    return this.cartTotalSubject.value;
  }

  /**
   * Quick add to cart (simplified method)
   */
  quickAddToCart(product: LegacyProduct | Product, quantity: number = 1): Observable<BasketItem> {
    const request: AddToCartRequest = {
      product_id: product.id,
      quantity: quantity
    };
    
    return this.addToCart(request);
  }

  /**
   * Increase item quantity
   */
  increaseQuantity(itemId: number): Observable<BasketItem> {
    const item = this.getCurrentCartItems().find(i => i.id === itemId);
    if (!item) {
      return throwError('Item not found in cart');
    }
    
    return this.updateCartItem(itemId, { quantity: item.quantity + 1 });
  }

  /**
   * Decrease item quantity
   */
  decreaseQuantity(itemId: number): Observable<BasketItem | any> {
    const item = this.getCurrentCartItems().find(i => i.id === itemId);
    if (!item) {
      return throwError('Item not found in cart');
    }
    
    if (item.quantity <= 1) {
      return this.removeFromCart(itemId);
    }
    
    return this.updateCartItem(itemId, { quantity: item.quantity - 1 });
  }

  /**
   * Calculate cart totals
   */
  private calculateTotals(items: BasketItem[]): { count: number, total: number } {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.total_price, 0);
    
    return { count, total };
  }

  /**
   * Update cart state
   */
  private updateCartState(items: BasketItem[]): void {
    this.cartItemsSubject.next(items);
    
    const { count, total } = this.calculateTotals(items);
    this.cartCountSubject.next(count);
    this.cartTotalSubject.next(total);
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: any): Observable<never> => {
    console.error('Basket service error:', error);
    
    let errorMessage = 'An error occurred while processing your cart';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.detail) {
      errorMessage = error.error.detail;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Handle specific error codes
    switch (error.status) {
      case 400:
        if (error.error?.error?.includes('stock')) {
          errorMessage = 'Insufficient stock available';
        } else if (error.error?.error?.includes('quantity')) {
          errorMessage = 'Invalid quantity specified';
        }
        break;
      case 401:
        errorMessage = 'Please login to manage your cart';
        break;
      case 404:
        errorMessage = 'Product not found';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later';
        break;
    }

    return throwError({
      message: errorMessage,
      status: error.status,
      originalError: error
    });
  }

  /**
   * Validate cart before checkout
   */
  validateCart(): Observable<{ valid: boolean; errors: string[] }> {
    return this.http.post<{ valid: boolean; errors: string[] }>(`${this.basketUrl}validate/`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Apply coupon code
   */
  applyCoupon(couponCode: string): Observable<{ success: boolean; discount: number; message: string }> {
    return this.http.post<{ success: boolean; discount: number; message: string }>(`${this.basketUrl}apply-coupon/`, {
      coupon_code: couponCode
    }, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        // Reload cart to get updated totals
        this.loadCart().subscribe();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Remove coupon
   */
  removeCoupon(): Observable<any> {
    return this.http.post(`${this.basketUrl}remove-coupon/`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        // Reload cart to get updated totals
        this.loadCart().subscribe();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Estimate shipping cost
   */
  estimateShipping(shippingAddress: any): Observable<{ cost: number; methods: any[] }> {
    return this.http.post<{ cost: number; methods: any[] }>(`${this.basketUrl}estimate-shipping/`, {
      address: shippingAddress
    }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Save cart for later (for guests becoming users)
   */
  saveCartForUser(userToken: string): Observable<any> {
    return this.http.post(`${this.basketUrl}save-for-user/`, {
      user_token: userToken
    }, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        this.loadCart().subscribe();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get saved carts (for users with multiple saved carts)
   */
  getSavedCarts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.basketUrl}saved/`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Merge guest cart with user cart
   */
  mergeGuestCart(guestCartData: any): Observable<BasketItem[]> {
    return this.http.post<BasketItem[]>(`${this.basketUrl}merge-guest-cart/`, {
      guest_cart: guestCartData
    }, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(items => {
        this.updateCartState(items);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get cart analytics (for store owners)
   */
  getCartAnalytics(dateRange?: { start: Date; end: Date }): Observable<any> {
    let params = {};
    if (dateRange) {
      params = {
        start_date: dateRange.start.toISOString().split('T')[0],
        end_date: dateRange.end.toISOString().split('T')[0]
      };
    }

    return this.http.get(`${this.basketUrl}analytics/`, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }
}
