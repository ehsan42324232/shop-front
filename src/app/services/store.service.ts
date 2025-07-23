import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface StoreRequest {
  store_name: string;
  store_name_en: string;
  subdomain: string;
  business_type: string;
  description: string;
  business_license?: string;
  national_id: string;
  address: string;
  contact_phone: string;
  contact_email?: string;
  website_url?: string;
  estimated_products?: number;
  monthly_sales_estimate?: string;
}

export interface StoreRequestStatus {
  id: number;
  store_name: string;
  subdomain: string;
  status: string;
  status_display: string;
  created_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
}

export interface Store {
  id: number;
  name: string;
  name_en: string;
  domain: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface StoreTheme {
  theme_name: string;
  color_scheme: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  layout_type: string;
  logo?: File | string;
  banner_image?: File | string;
  show_search: boolean;
  show_categories: boolean;
  show_cart: boolean;
  show_wishlist: boolean;
  show_reviews: boolean;
}

export interface StoreSettings {
  meta_title: string;
  meta_description: string;
  free_shipping_threshold?: number;
  shipping_cost: number;
  min_order_amount?: number;
  accept_cash_on_delivery: boolean;
  accept_online_payment: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  instagram_url?: string;
  telegram_url?: string;
  whatsapp_number?: string;
}

export interface StoreDashboard {
  store: Store;
  today_visitors: number;
  today_orders: number;
  today_revenue: number;
  month_visitors: number;
  month_orders: number;
  month_revenue: number;
  total_products: number;
  active_products: number;
  out_of_stock_products: number;
  weekly_sales_chart: any[];
  popular_products: any[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = environment.apiUrl + '/api/store/';
  
  private currentStoreSubject = new BehaviorSubject<Store | null>(null);
  public currentStore$ = this.currentStoreSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Create store request
   */
  createStoreRequest(data: StoreRequest): Observable<ApiResponse<StoreRequestStatus>> {
    return this.http.post<ApiResponse<StoreRequestStatus>>(
      `${this.apiUrl}request/create/`, 
      data, 
      this.getAuthHeaders()
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get my store request status
   */
  getMyStoreRequest(): Observable<ApiResponse<StoreRequestStatus>> {
    return this.http.get<ApiResponse<StoreRequestStatus>>(
      `${this.apiUrl}request/my/`, 
      this.getAuthHeaders()
    ).pipe(catchError(this.handleError));
  }

  /**
   * Check subdomain availability
   */
  checkSubdomainAvailability(subdomain: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}subdomain/check/`, 
      { subdomain }, 
      this.getAuthHeaders()
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get store creation wizard data
   */
  getWizardData(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}request/wizard-data/`
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get my store
   */
  getMyStore(): Observable<ApiResponse<Store>> {
    return this.http.get<ApiResponse<Store>>(
      `${this.apiUrl}my-store/`, 
      this.getAuthHeaders()
    ).pipe(
      tap(response => {
        if (response.success && response.store) {
          this.currentStoreSubject.next(response.store);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get store dashboard
   */
  getStoreDashboard(): Observable<ApiResponse<StoreDashboard>> {
    return this.http.get<ApiResponse<StoreDashboard>>(
      `${this.apiUrl}dashboard/`, 
      this.getAuthHeaders()
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get store theme
   */
  getStoreTheme(): Observable<ApiResponse<StoreTheme>> {
    return this.http.get<ApiResponse<StoreTheme>>(
      `${this.apiUrl}theme/`, 
      this.getAuthHeaders()
    ).pipe(catchError(this.handleError));
  }

  /**
   * Update store theme
   */
  updateStoreTheme(theme: Partial<StoreTheme>): Observable<ApiResponse<StoreTheme>> {
    const formData = new FormData();
    
    Object.keys(theme).forEach(key => {
      const value = (theme as any)[key];
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value);
        }
      }
    });

    return this.http.patch<ApiResponse<StoreTheme>>(
      `${this.apiUrl}theme/`, 
      formData, 
      this.getAuthHeadersForFormData()
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get store settings
   */
  getStoreSettings(): Observable<ApiResponse<StoreSettings>> {
    return this.http.get<ApiResponse<StoreSettings>>(
      `${this.apiUrl}settings/`, 
      this.getAuthHeaders()
    ).pipe(catchError(this.handleError));
  }

  /**
   * Update store settings
   */
  updateStoreSettings(settings: Partial<StoreSettings>): Observable<ApiResponse<StoreSettings>> {
    return this.http.patch<ApiResponse<StoreSettings>>(
      `${this.apiUrl}settings/`, 
      settings, 
      this.getAuthHeaders()
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get store analytics
   */
  getStoreAnalytics(startDate?: string, endDate?: string): Observable<ApiResponse<any>> {
    let url = `${this.apiUrl}analytics/`;
    const params = [];
    
    if (startDate) params.push(`start_date=${startDate}`);
    if (endDate) params.push(`end_date=${endDate}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<ApiResponse<any>>(url, this.getAuthHeaders())
      .pipe(catchError(this.handleError));
  }

  /**
   * Get current store
   */
  getCurrentStore(): Store | null {
    return this.currentStoreSubject.value;
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  /**
   * Get auth headers for form data
   */
  private getAuthHeadersForFormData() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'خطایی رخ داده است. لطفاً مجدداً تلاش کنید.';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.';
    } else if (error.status === 401) {
      errorMessage = 'دسترسی غیرمجاز. لطفاً مجدداً وارد شوید.';
    } else if (error.status === 404) {
      errorMessage = 'سرویس درخواستی یافت نشد.';
    } else if (error.status === 500) {
      errorMessage = 'خطای سرور. لطفاً بعداً تلاش کنید.';
    }

    console.error('Store API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Format currency (Toman)
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  }

  /**
   * Get business type display name
   */
  getBusinessTypeDisplay(type: string): string {
    const businessTypes: { [key: string]: string } = {
      'clothing': 'پوشاک',
      'electronics': 'لوازم الکترونیکی',
      'home': 'لوازم خانه',
      'food': 'مواد غذایی',
      'beauty': 'زیبایی و سلامت',
      'books': 'کتاب و نشریات',
      'sports': 'ورزش و تفریح',
      'automotive': 'خودرو و موتورسیکلت',
      'toys': 'اسباب بازی',
      'handmade': 'دست‌ساز',
      'other': 'سایر'
    };
    return businessTypes[type] || type;
  }

  /**
   * Validate Iranian national ID
   */
  validateNationalId(nationalId: string): boolean {
    if (!/^\d{10}$/.test(nationalId)) {
      return false;
    }
    
    const check = parseInt(nationalId[9]);
    const sum = nationalId.split('').slice(0, 9)
      .reduce((acc, digit, index) => acc + parseInt(digit) * (10 - index), 0);
    const remainder = sum % 11;
    
    return remainder < 2 ? check === remainder : check === 11 - remainder;
  }
}
