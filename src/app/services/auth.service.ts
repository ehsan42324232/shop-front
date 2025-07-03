
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private registerUrl = '/api/auth/register/';
  private loginUrl = '/api/auth/login/';

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<any> {
    return this.http.post(this.registerUrl, { username, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
