import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ContactRequest {
  name: string;
  phone: string;
  email?: string;
  business_type: string;
  company_name?: string;
  website_url?: string;
  estimated_products?: number;
  message?: string;
  source?: string;
}

export interface PlatformStats {
  active_stores: string;
  daily_sales: string;
  customer_satisfaction: string;
  years_experience: string;
}

export interface PlatformSettings {
  hero_title: string;
  hero_subtitle: string;
  meta_title: string;
  meta_description: string;
  support_email: string;
  support_phone: string;
  telegram_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  enable_registration: boolean;
  enable_demo_requests: boolean;
  enable_chat_support: boolean;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface HomepageData {
  settings: PlatformSettings;
  stats: PlatformStats;
  faqs: FAQ[];
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
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
export class HomepageService {
  private apiUrl = environment.apiUrl + '/api/homepage/';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Submit contact form request
   */
  submitContactRequest(data: ContactRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}contact/`, 
      data, 
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Submit quick contact form
   */
  submitQuickContact(name: string, phone: string, message?: string): Observable<ApiResponse<any>> {
    const data = { name, phone, message };
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}quick-contact/`, 
      data, 
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get platform settings
   */
  getPlatformSettings(): Observable<PlatformSettings> {
    return this.http.get<PlatformSettings>(`${this.apiUrl}settings/`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get platform statistics
   */
  getPlatformStats(): Observable<ApiResponse<PlatformStats>> {
    return this.http.get<ApiResponse<PlatformStats>>(`${this.apiUrl}stats/`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get all homepage data in single request
   */
  getHomepageData(): Observable<ApiResponse<HomepageData>> {
    return this.http.get<ApiResponse<HomepageData>>(`${this.apiUrl}homepage-data/`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Subscribe to newsletter
   */
  subscribeNewsletter(email: string, source: string = 'homepage'): Observable<ApiResponse<any>> {
    const data = { email, source };
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}newsletter/`, 
      data, 
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get FAQ list
   */
  getFAQs(category?: string): Observable<FAQ[]> {
    let url = `${this.apiUrl}faq/`;
    if (category) {
      url += `?category=${category}`;
    }
    return this.http.get<FAQ[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Health check
   */
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}health/`).pipe(
      catchError(this.handleError)
    );
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
    } else if (error.status === 404) {
      errorMessage = 'سرویس درخواستی یافت نشد.';
    } else if (error.status === 500) {
      errorMessage = 'خطای سرور. لطفاً بعداً تلاش کنید.';
    }

    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Validate Iranian phone number
   */
  validateIranianPhone(phone: string): boolean {
    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Format Iranian phone number
   */
  formatIranianPhone(phone: string): string {
    const cleanPhone = phone.replace(/\s/g, '').replace('+98', '0');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('09')) {
      return `${cleanPhone.substr(0, 4)} ${cleanPhone.substr(4, 3)} ${cleanPhone.substr(7)}`;
    }
    return phone;
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
      'other': 'سایر'
    };
    return businessTypes[type] || type;
  }

  /**
   * Format number with Persian separators
   */
  formatNumber(num: number): string {
    return num.toLocaleString('fa-IR');
  }

  /**
   * Convert English numbers to Persian
   */
  toPersianNumbers(str: string): string {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';
    
    for (let i = 0; i < englishDigits.length; i++) {
      str = str.replace(new RegExp(englishDigits[i], 'g'), persianDigits[i]);
    }
    return str;
  }

  /**
   * Convert Persian numbers to English
   */
  toEnglishNumbers(str: string): string {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';
    
    for (let i = 0; i < persianDigits.length; i++) {
      str = str.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i]);
    }
    return str;
  }
}
