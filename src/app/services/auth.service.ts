import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: number;
  username: string;
  phone: string;
  email?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  business_name?: string;
  is_store_owner: boolean;
  is_phone_verified: boolean;
  is_approved: boolean;
}

export interface OTPRequest {
  phone: string;
  purpose?: 'login' | 'register' | 'password_reset' | 'phone_verify';
}

export interface OTPVerification {
  phone: string;
  otp_code: string;
  purpose?: 'login' | 'register' | 'password_reset' | 'phone_verify';
}

export interface RegisterRequest {
  phone: string;
  otp_code: string;
  first_name: string;
  last_name: string;
  business_name?: string;
  national_id?: string;
  is_store_owner?: boolean;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  token?: string;
  expires_at?: string;
  errors?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/api/auth/';
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  /**
   * Send OTP to phone number
   */
  sendOTP(data: OTPRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}send-otp/`, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Verify OTP code
   */
  verifyOTP(data: OTPVerification): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}verify-otp/`, data, this.httpOptions)
      .pipe(
        tap(response => {
          if (response.success && response.user && response.token) {
            this.setAuthData(response.user, response.token);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Register new user
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}register/`, data, this.httpOptions)
      .pipe(
        tap(response => {
          if (response.success && response.user && response.token) {
            this.setAuthData(response.user, response.token);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}logout/`, {}, this.getAuthHeaders())
      .pipe(
        tap(() => {
          this.clearAuthData();
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get user profile
   */
  getProfile(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiUrl}profile/`, this.getAuthHeaders())
      .pipe(catchError(this.handleError));
  }

  /**
   * Update user profile
   */
  updateProfile(data: Partial<AuthUser>): Observable<AuthUser> {
    return this.http.patch<AuthUser>(`${this.apiUrl}profile/`, data, this.getAuthHeaders())
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          this.saveUserToStorage(user);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Check authentication status
   */
  checkAuthStatus(): Observable<any> {
    const token = this.getStoredToken();
    if (!token) {
      return new Observable(observer => {
        observer.next({ authenticated: false });
        observer.complete();
      });
    }

    return this.http.get(`${this.apiUrl}status/`, this.getAuthHeaders())
      .pipe(
        tap((response: any) => {
          if (response.authenticated && response.user) {
            this.setAuthData(response.user, token);
          } else {
            this.clearAuthData();
          }
        }),
        catchError(() => {
          this.clearAuthData();
          return new Observable(observer => {
            observer.next({ authenticated: false });
            observer.complete();
          });
        })
      );
  }

  /**
   * Change password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<AuthResponse> {
    const data = {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: newPassword
    };
    
    return this.http.post<AuthResponse>(`${this.apiUrl}change-password/`, data, this.getAuthHeaders())
      .pipe(catchError(this.handleError));
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Check if user is store owner
   */
  isStoreOwner(): boolean {
    const user = this.getCurrentUser();
    return user ? user.is_store_owner : false;
  }

  /**
   * Force logout (clear local data)
   */
  forceLogout(): void {
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  /**
   * Set authentication data
   */
  private setAuthData(user: AuthUser, token: string): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.saveTokenToStorage(token);
    this.saveUserToStorage(user);
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.removeFromStorage();
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders() {
    const token = this.getStoredToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  /**
   * Save token to storage
   */
  private saveTokenToStorage(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Save user to storage
   */
  private saveUserToStorage(user: AuthUser): void {
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  /**
   * Get token from storage
   */
  private getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Get user from storage
   */
  private getStoredUser(): AuthUser | null {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Remove data from storage
   */
  private removeFromStorage(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
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
      this.forceLogout();
    } else if (error.status === 404) {
      errorMessage = 'سرویس درخواستی یافت نشد.';
    } else if (error.status === 500) {
      errorMessage = 'خطای سرور. لطفاً بعداً تلاش کنید.';
    }

    console.error('Auth API Error:', error);
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
   * Clean phone number for API
   */
  cleanPhoneNumber(phone: string): string {
    return phone.replace(/\s/g, '').replace('+98', '0');
  }
}
