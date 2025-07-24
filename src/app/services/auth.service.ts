import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface OTPRequest {
  phone: string;
}

export interface OTPVerification {
  phone: string;
  code: string;
}

export interface User {
  id: number;
  phone: string;
  name?: string;
  email?: string;
  store?: any;
  is_store_owner: boolean;
  is_customer: boolean;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  expires_in?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public isAuthenticated$ = this.currentUser$.pipe(
    map(user => !!user)
  );

  constructor(private http: HttpClient) {
    // Check for existing token on service initialization
    this.loadStoredAuth();
  }

  // Load stored authentication data
  private loadStoredAuth(): void {
    const token = localStorage.getItem('mall_token');
    const userString = localStorage.getItem('mall_user');
    
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        this.tokenSubject.next(token);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearStoredAuth();
      }
    }
  }

  // Store authentication data
  private storeAuth(token: string, user: User): void {
    localStorage.setItem('mall_token', token);
    localStorage.setItem('mall_user', JSON.stringify(user));
    this.tokenSubject.next(token);
    this.currentUserSubject.next(user);
  }

  // Clear stored authentication data
  private clearStoredAuth(): void {
    localStorage.removeItem('mall_token');
    localStorage.removeItem('mall_user');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  // Get HTTP headers with authorization
  private getHeaders(): HttpHeaders {
    const token = this.tokenSubject.value;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // Request OTP for phone number
  requestOTP(phoneData: OTPRequest): Observable<AuthResponse> {
    const formattedPhone = this.formatPhoneNumber(phoneData.phone);
    
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/request-otp/`,
      { phone: formattedPhone },
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success) {
          console.log('OTP sent successfully to:', formattedPhone);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Verify OTP and authenticate user
  verifyOTP(verificationData: OTPVerification): Observable<AuthResponse> {
    const formattedPhone = this.formatPhoneNumber(verificationData.phone);
    
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/verify-otp/`,
      { 
        phone: formattedPhone,
        code: verificationData.code 
      },
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.user && response.token) {
          this.storeAuth(response.token, response.user);
          console.log('User authenticated successfully:', response.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Register new store owner
  registerStoreOwner(registrationData: {
    phone: string;
    name: string;
    business_name: string;
    business_type?: string;
  }): Observable<AuthResponse> {
    const formattedPhone = this.formatPhoneNumber(registrationData.phone);
    
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register-store-owner/`,
      {
        ...registrationData,
        phone: formattedPhone
      },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Register new customer
  registerCustomer(registrationData: {
    phone: string;
    name: string;
    email?: string;
  }): Observable<AuthResponse> {
    const formattedPhone = this.formatPhoneNumber(registrationData.phone);
    
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register-customer/`,
      {
        ...registrationData,
        phone: formattedPhone
      },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get current user profile
  getCurrentUser(): Observable<User> {
    return this.http.get<{ user: User }>(
      `${this.apiUrl}/profile/`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.user),
      tap(user => this.currentUserSubject.next(user)),
      catchError(this.handleError)
    );
  }

  // Update user profile
  updateProfile(profileData: Partial<User>): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(
      `${this.apiUrl}/profile/`,
      profileData,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.currentUserSubject.next(response.user);
          localStorage.setItem('mall_user', JSON.stringify(response.user));
        }
      }),
      catchError(this.handleError)
    );
  }

  // Refresh authentication token
  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/refresh-token/`,
      {},
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.token && response.user) {
          this.storeAuth(response.token, response.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Logout user
  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/logout/`,
      {},
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        this.clearStoredAuth();
        console.log('User logged out successfully');
      }),
      catchError(error => {
        // Even if logout fails on server, clear local data
        this.clearStoredAuth();
        return throwError(error);
      })
    );
  }

  // Check if user is store owner
  isStoreOwner(): boolean {
    const user = this.currentUserSubject.value;
    return user?.is_store_owner ?? false;
  }

  // Check if user is customer
  isCustomer(): boolean {
    const user = this.currentUserSubject.value;
    return user?.is_customer ?? false;
  }

  // Get current user value (synchronous)
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Get current token value (synchronous)
  getTokenValue(): string | null {
    return this.tokenSubject.value;
  }

  // Format Iranian phone number
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Handle different Iranian phone number formats
    if (digits.startsWith('0')) {
      // Convert 09xxxxxxxxx to +989xxxxxxxxx
      return '+98' + digits.substring(1);
    } else if (digits.startsWith('98')) {
      // Already in international format
      return '+' + digits;
    } else if (digits.startsWith('9') && digits.length === 10) {
      // 9xxxxxxxxx format
      return '+98' + digits;
    } else if (digits.length === 11 && digits.startsWith('09')) {
      // 09xxxxxxxxx format
      return '+98' + digits.substring(1);
    }
    
    // Default: assume it needs +98 prefix
    return '+98' + digits;
  }

  // Validate Iranian phone number
  isValidPhoneNumber(phone: string): boolean {
    const formatted = this.formatPhoneNumber(phone);
    // Iranian mobile numbers: +989xxxxxxxxx (13 digits total)
    const iranianMobileRegex = /^\+989[0-9]{9}$/;
    return iranianMobileRegex.test(formatted);
  }

  // Validate OTP code
  isValidOTPCode(code: string): boolean {
    const digits = code.replace(/\D/g, '');
    return digits.length >= 4 && digits.length <= 6;
  }

  // Request password reset (fallback for non-OTP scenarios)
  requestPasswordReset(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/request-password-reset/`,
      { email },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Check authentication status
  checkAuthStatus(): Observable<boolean> {
    const token = this.getTokenValue();
    if (!token) {
      return new Observable(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    return this.getCurrentUser().pipe(
      map(user => !!user),
      catchError(() => {
        this.clearStoredAuth();
        return new Observable(observer => {
          observer.next(false);
          observer.complete();
        });
      })
    );
  }

  // Handle HTTP errors
  private handleError = (error: any) => {
    console.error('Auth Service Error:', error);
    
    let errorMessage = 'خطایی رخ داد. لطفاً دوباره تلاش کنید.';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.detail) {
      errorMessage = error.error.detail;
    } else if (error.status === 0) {
      errorMessage = 'عدم اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.';
    } else if (error.status === 401) {
      errorMessage = 'احراز هویت ناموفق. لطفاً دوباره وارد شوید.';
      this.clearStoredAuth();
    } else if (error.status === 403) {
      errorMessage = 'شما اجازه دسترسی به این بخش را ندارید.';
    } else if (error.status === 404) {
      errorMessage = 'منبع مورد نظر یافت نشد.';
    } else if (error.status >= 500) {
      errorMessage = 'خطای سرور. لطفاً بعداً تلاش کنید.';
    }

    return throwError({
      ...error,
      message: errorMessage
    });
  };

  // Clean up service
  destroy(): void {
    this.currentUserSubject.complete();
    this.tokenSubject.complete();
  }
}
