import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, of } from 'rxjs';
import { User } from '../models';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  refresh_token?: string;
  user: User;
  message?: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  confirm_password?: string;
}

interface StoreRequestData {
  store_name: string;
  domain: string;
  description: string;
  business_type: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl || 'http://localhost:8000/api';
  private registerUrl = `${this.apiUrl}/auth/register/`;
  private loginUrl = `${this.apiUrl}/auth/login/`;
  private logoutUrl = `${this.apiUrl}/auth/logout/`;
  private profileUrl = `${this.apiUrl}/auth/profile/`;
  private storeRequestUrl = `${this.apiUrl}/auth/request-store/`;
  private changePasswordUrl = `${this.apiUrl}/auth/change-password/`;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.isAuthenticatedSubject.next(true);
      this.loadUserProfile().subscribe();
    } else {
      this.logout();
    }
  }

  register(data: RegisterData): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post(this.registerUrl, data).pipe(
      tap((response: any) => {
        console.log('Registration successful:', response);
      }),
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  login(username: string, password: string): Observable<LoginResponse> {
    this.loadingSubject.next(true);
    return this.http.post<LoginResponse>(this.loginUrl, { username, password }).pipe(
      tap((response: LoginResponse) => {
        this.setToken(response.token);
        if (response.refresh_token) {
          this.setRefreshToken(response.refresh_token);
        }
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  logout(): Observable<any> {
    const token = this.getToken();
    
    // Always clear local data
    this.clearTokens();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // If we have a token, notify the server
    if (token) {
      return this.http.post(this.logoutUrl, {}, {
        headers: this.getAuthHeaders()
      }).pipe(
        catchError(() => of({})) // Ignore errors on logout
      );
    }
    
    return of({});
  }

  loadUserProfile(): Observable<User> {
    return this.http.get<User>(this.profileUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((user: User) => {
        this.currentUserSubject.next(user);
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.logout();
        }
        return throwError(error);
      })
    );
  }

  updateProfile(profileData: Partial<User>): Observable<User> {
    this.loadingSubject.next(true);
    return this.http.put<User>(this.profileUrl, profileData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((user: User) => {
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post(this.changePasswordUrl, {
      old_password: oldPassword,
      new_password: newPassword
    }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  requestStore(storeData: StoreRequestData): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post(this.storeRequestUrl, storeData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  // Token management
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }

  private clearTokens(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError('No refresh token available');
    }

    return this.http.post(`${this.apiUrl}/auth/refresh/`, {
      refresh: refreshToken
    }).pipe(
      tap((response: any) => {
        this.setToken(response.access);
        if (response.refresh) {
          this.setRefreshToken(response.refresh);
        }
      }),
      catchError((error) => {
        this.logout();
        return throwError(error);
      })
    );
  }

  // Utility methods
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  isStoreOwner(): boolean {
    const user = this.getCurrentUser();
    return user?.is_store_owner || false;
  }

  // Error handling
  private handleError = (error: any): Observable<never> => {
    console.error('Auth service error:', error);
    
    let errorMessage = 'An error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.detail) {
      errorMessage = error.error.detail;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Handle specific error codes
    switch (error.status) {
      case 401:
        if (this.isAuthenticated()) {
          this.logout();
        }
        errorMessage = 'Authentication failed. Please login again.';
        break;
      case 403:
        errorMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
    }

    return throwError({
      message: errorMessage,
      status: error.status,
      originalError: error
    });
  }
}
