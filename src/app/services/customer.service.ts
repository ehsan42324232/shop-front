import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface CustomerProfile {
  id: number;
  user: any;
  phone: string;
  national_id?: string;
  birth_date?: string;
  gender?: string;
  province?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  wallet_balance: number;
  loyalty_points: number;
  status: string;
  status_display: string;
  sms_notifications: boolean;
  email_notifications: boolean;
  marketing_notifications: boolean;
  phone_verified: boolean;
  email_verified: boolean;
  registration_date: string;
  total_orders: number;
  total_spent: number;
}

interface CustomerAddress {
  id?: number;
  title: string;
  recipient_name: string;
  recipient_phone: string;
  province: string;
  city: string;
  district?: string;
  address: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  is_active: boolean;
}

interface WalletTransaction {
  id: number;
  transaction_id: string;
  transaction_type: string;
  transaction_type_display: string;
  amount: number;
  formatted_amount: string;
  balance_before: number;
  balance_after: number;
  description: string;
  created_at: string;
  persian_date: string;
}

interface CustomerNotification {
  id: number;
  notification_type: string;
  notification_type_display: string;
  title: string;
  message: string;
  is_read: boolean;
  reference_url?: string;
  created_at: string;
  persian_date: string;
  time_ago: string;
}

interface CustomerOrder {
  id: string;
  date: string;
  status: string;
  status_display: string;
  total: number;
  items_count: number;
  payment_method: string;
  shipping_address: string;
  tracking_number?: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/api/customer`;
  private profileSubject = new BehaviorSubject<CustomerProfile | null>(null);
  public profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Profile Management
  getProfile(): Observable<CustomerProfile> {
    return this.http.get<CustomerProfile>(`${this.apiUrl}/profile/`, {
      headers: this.getHeaders()
    }).pipe(
      map(profile => {
        this.profileSubject.next(profile);
        return profile;
      })
    );
  }

  updateProfile(profileData: Partial<CustomerProfile>): Observable<CustomerProfile> {
    return this.http.patch<CustomerProfile>(`${this.apiUrl}/profile/`, profileData, {
      headers: this.getHeaders()
    }).pipe(
      map(profile => {
        this.profileSubject.next(profile);
        return profile;
      })
    );
  }

  // Dashboard Statistics
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/dashboard_stats/`, {
      headers: this.getHeaders()
    });
  }

  // Wallet Management
  chargeWallet(amount: number, paymentMethod: string = 'ONLINE'): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/charge_wallet/`, {
      amount: amount,
      payment_method: paymentMethod
    }, {
      headers: this.getHeaders()
    });
  }

  redeemPoints(points: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/redeem_points/`, {
      points: points
    }, {
      headers: this.getHeaders()
    });
  }

  // Wallet Transactions
  getWalletTransactions(page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/wallet-transactions/`, {
      headers: this.getHeaders(),
      params: {
        page: page.toString(),
        per_page: perPage.toString()
      }
    });
  }

  getWalletSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/wallet-transactions/summary/`, {
      headers: this.getHeaders()
    });
  }

  // Address Management
  getAddresses(): Observable<CustomerAddress[]> {
    return this.http.get<CustomerAddress[]>(`${this.apiUrl}/addresses/`, {
      headers: this.getHeaders()
    });
  }

  createAddress(address: CustomerAddress): Observable<CustomerAddress> {
    return this.http.post<CustomerAddress>(`${this.apiUrl}/addresses/`, address, {
      headers: this.getHeaders()
    });
  }

  updateAddress(id: number, address: Partial<CustomerAddress>): Observable<CustomerAddress> {
    return this.http.patch<CustomerAddress>(`${this.apiUrl}/addresses/${id}/`, address, {
      headers: this.getHeaders()
    });
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/addresses/${id}/`, {
      headers: this.getHeaders()
    });
  }

  setDefaultAddress(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/addresses/${id}/set_default/`, {}, {
      headers: this.getHeaders()
    });
  }

  // Order History
  getOrderHistory(filters: {
    status?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
  } = {}): Observable<any> {
    let params: any = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params[key] = filters[key];
      }
    });

    return this.http.get(`${this.apiUrl}/profile/order_history/`, {
      headers: this.getHeaders(),
      params: params
    });
  }

  // Notifications
  getNotifications(page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications/`, {
      headers: this.getHeaders(),
      params: {
        page: page.toString(),
        per_page: perPage.toString()
      }
    });
  }

  markNotificationAsRead(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/${id}/mark_read/`, {}, {
      headers: this.getHeaders()
    });
  }

  markAllNotificationsAsRead(): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/mark_all_read/`, {}, {
      headers: this.getHeaders()
    });
  }

  getUnreadNotificationsCount(): Observable<{unread_count: number}> {
    return this.http.get<{unread_count: number}>(`${this.apiUrl}/notifications/unread_count/`, {
      headers: this.getHeaders()
    });
  }

  // Wishlist Management
  getWishlist(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/wishlist/`, {
      headers: this.getHeaders()
    });
  }

  toggleWishlist(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/wishlist/toggle/`, {
      product_id: productId
    }, {
      headers: this.getHeaders()
    });
  }

  removeFromWishlist(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/wishlist/${id}/`, {
      headers: this.getHeaders()
    });
  }

  // Reviews
  getMyReviews(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reviews/my_reviews/`, {
      headers: this.getHeaders()
    });
  }

  createReview(reviewData: {
    product: number;
    rating: number;
    title: string;
    comment: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reviews/`, reviewData, {
      headers: this.getHeaders()
    });
  }

  updateReview(id: number, reviewData: Partial<any>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reviews/${id}/`, reviewData, {
      headers: this.getHeaders()
    });
  }

  // Utility Methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  }

  formatPersianDate(date: string): string {
    const persianDate = new Date(date).toLocaleDateString('fa-IR');
    return persianDate;
  }

  validateIranianPhone(phone: string): boolean {
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  validateIranianNationalId(nationalId: string): boolean {
    if (!nationalId || nationalId.length !== 10) return false;
    
    // Check if all digits are the same
    if (/^(\d)\1{9}$/.test(nationalId)) return false;
    
    // Calculate check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(nationalId[i]) * (10 - i);
    }
    
    const remainder = sum % 11;
    const checkDigit = remainder < 2 ? remainder : 11 - remainder;
    
    return parseInt(nationalId[9]) === checkDigit;
  }

  validateIranianPostalCode(postalCode: string): boolean {
    const postalCodeRegex = /^\d{10}$/;
    return postalCodeRegex.test(postalCode.replace(/\s/g, ''));
  }

  // Persian provinces and cities
  getIranianProvinces(): string[] {
    return [
      'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز', 'ایلام',
      'بوشهر', 'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان رضوی',
      'خراسان شمالی', 'خوزستان', 'زنجان', 'سمنان', 'سیستان و بلوچستان',
      'فارس', 'قزوین', 'قم', 'کردستان', 'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد',
      'گلستان', 'گیلان', 'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد'
    ];
  }

  getCitiesByProvince(province: string): string[] {
    const cities: {[key: string]: string[]} = {
      'تهران': ['تهران', 'اسلامشهر', 'کرج', 'ورامین', 'شهریار', 'پاکدشت'],
      'اصفهان': ['اصفهان', 'کاشان', 'نجف‌آباد', 'خمینی‌شهر', 'فولادشهر'],
      'فارس': ['شیراز', 'کازرون', 'مرودشت', 'فسا', 'داراب'],
      'خراسان رضوی': ['مشهد', 'نیشابور', 'سبزوار', 'تربت حیدریه', 'قوچان'],
      'آذربایجان شرقی': ['تبریز', 'مراغه', 'میانه', 'مرند', 'اهر'],
      // Add more provinces and cities as needed
    };
    
    return cities[province] || [];
  }

  // Error handling
  handleError(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    } else if (error.error && typeof error.error === 'string') {
      return error.error;
    } else if (error.message) {
      return error.message;
    } else {
      return 'خطای غیرمنتظره‌ای رخ داد';
    }
  }

  // Local storage helpers
  saveProfileToStorage(profile: CustomerProfile): void {
    localStorage.setItem('customer_profile', JSON.stringify(profile));
  }

  getProfileFromStorage(): CustomerProfile | null {
    const stored = localStorage.getItem('customer_profile');
    return stored ? JSON.parse(stored) : null;
  }

  clearProfileFromStorage(): void {
    localStorage.removeItem('customer_profile');
  }

  // Cache management
  private cache = new Map<string, {data: any, timestamp: number}>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, {data, timestamp: Date.now()});
  }

  clearCache(): void {
    this.cache.clear();
  }
}
