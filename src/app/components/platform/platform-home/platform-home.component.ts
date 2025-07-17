import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-platform-home',
  template: `
    <div class="min-h-screen bg-gray-50" dir="rtl">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div class="container mx-auto px-4 py-16">
          <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6">
              پلتفرم فروشگاه‌ساز
            </h1>
            <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              فروشگاه آنلاین خود را در کمترین زمان راه‌اندازی کنید
            </p>
            <div class="space-x-4 space-x-reverse">
              <button 
                *ngIf="!isLoggedIn" 
                (click)="goToRegister()"
                class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                درخواست فروشگاه
              </button>
              <button 
                *ngIf="!isLoggedIn"
                (click)="goToLogin()"
                class="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                ورود
              </button>
              <button 
                *ngIf="isLoggedIn"
                (click)="goToDashboard()"
                class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                پنل مدیریت فروشگاه
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="container mx-auto px-4 py-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">
            چرا پلتفرم ما را انتخاب کنید؟
          </h2>
          <p class="text-lg text-gray-600">
            امکانات کاملی که برای راه‌اندازی فروشگاه آنلاین نیاز دارید
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6 bg-white rounded-lg shadow-lg">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">راه‌اندازی سریع</h3>
            <p class="text-gray-600">فروشگاه خود را در کمتر از ۵ دقیقه راه‌اندازی کنید</p>
          </div>

          <div class="text-center p-6 bg-white rounded-lg shadow-lg">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">امنیت بالا</h3>
            <p class="text-gray-600">تمام اطلاعات شما با بالاترین سطح امنیت محافظت می‌شود</p>
          </div>

          <div class="text-center p-6 bg-white rounded-lg shadow-lg">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">گزارش‌گیری دقیق</h3>
            <p class="text-gray-600">آمار و گزارش‌های کاملی از فروش‌های خود دریافت کنید</p>
          </div>
        </div>
      </div>

      <!-- How it Works -->
      <div class="bg-gray-100 py-16">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-800 mb-4">
              چگونه کار می‌کند؟
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="font-bold">1</span>
              </div>
              <h3 class="font-bold mb-2">ثبت‌نام</h3>
              <p class="text-gray-600">حساب کاربری خود را ایجاد کنید</p>
            </div>

            <div class="text-center">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="font-bold">2</span>
              </div>
              <h3 class="font-bold mb-2">درخواست فروشگاه</h3>
              <p class="text-gray-600">اطلاعات فروشگاه خود را وارد کنید</p>
            </div>

            <div class="text-center">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="font-bold">3</span>
              </div>
              <h3 class="font-bold mb-2">تأیید و راه‌اندازی</h3>
              <p class="text-gray-600">فروشگاه شما تأیید و راه‌اندازی می‌شود</p>
            </div>

            <div class="text-center">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="font-bold">4</span>
              </div>
              <h3 class="font-bold mb-2">شروع فروش</h3>
              <p class="text-gray-600">محصولات خود را اضافه کنید و شروع به فروش کنید</p>
            </div>
          </div>
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
export class PlatformHomeComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToDashboard(): void {
    this.router.navigate(['/my-store']);
  }
}
