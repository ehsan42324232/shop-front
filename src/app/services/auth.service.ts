import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface OTPResponse {
  success: boolean;
  message: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  sendOTP(phoneNumber: string, purpose: string = 'login'): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/auth/send-otp/`, {
      phone_number: phoneNumber,
      purpose: purpose
    });
  }

  verifyOTP(phoneNumber: string, otpCode: string, purpose: string = 'login'): Observable<OTPResponse> {
    return this.http.post<OTPResponse>(`${environment.apiUrl}/api/auth/verify-otp/`, {
      phone_number: phoneNumber,
      otp_code: otpCode,
      purpose: purpose
    });
  }

  login(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}