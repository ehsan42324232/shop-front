import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private registerUrl = '/api/auth/register/';
  private loginUrl = '/api/auth/login/';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in on service initialization
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
      // You might want to get user details from the server here
    }
  }

  register(username: string, email: string, password: string, firstName: string, lastName: string): Observable<any> {
    return this.http.post(this.registerUrl, { 
      username, 
      email, 
      password, 
      first_name: firstName, 
      last_name: lastName 
    });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this.isAuthenticatedSubject.next(true);
        if (res.user) {
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
