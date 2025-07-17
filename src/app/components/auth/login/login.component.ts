import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900">
            ورود به پلتفرم فروشگاه‌ساز
          </h2>
          <p class="mt-2 text-gray-600">
            وارد حساب کاربری خود شوید و فروشگاه‌تان را مدیریت کنید
          </p>
        </div>
        
        <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form class="space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                نام کاربری
              </label>
              <input
                id="username"
                name="username"
                type="text"
                formControlName="username"
                required
                class="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="نام کاربری خود را وارد کنید"
              />
              <div *ngIf="loginForm.get('username')?.touched && loginForm.get('username')?.errors" class="mt-2 text-sm text-red-600">
                <div *ngIf="loginForm.get('username')?.errors?.['required']">نام کاربری الزامی است</div>
              </div>
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                formControlName="password"
                required
                class="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="رمز عبور خود را وارد کنید"
              />
              <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors" class="mt-2 text-sm text-red-600">
                <div *ngIf="loginForm.get('password')?.errors?.['required']">رمز عبور الزامی است</div>
              </div>
            </div>

            <div *ngIf="errorMessage" class="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg">
              {{ errorMessage }}
            </div>

            <div>
              <button
                type="submit"
                [disabled]="loginForm.invalid || isLoading"
                class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span *ngIf="isLoading" class="ml-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isLoading ? 'در حال ورود...' : 'ورود' }}
              </button>
            </div>

            <div class="text-center">
              <span class="text-sm text-gray-600">
                حساب کاربری ندارید؟
                <a class="font-medium text-blue-600 hover:text-blue-500 cursor-pointer mr-1" (click)="router.navigate(['/register'])">
                  درخواست فروشگاه
                </a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      direction: rtl;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { username, password } = this.loginForm.value;
      
      this.authService.login(username, password).subscribe({
        next: () => {
          this.router.navigate(['/my-store']);
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'ورود ناموفق بود. لطفاً دوباره تلاش کنید.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
