import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  template: `
    <header class="gradient-bg shadow-lg sticky top-0 z-50" dir="rtl">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center space-x-3 space-x-reverse">
            <div class="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white border-opacity-30">
              <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                <circle cx="6" cy="8" r="1" opacity="0.7"/>
                <circle cx="18" cy="14" r="1" opacity="0.7"/>
                <line x1="7" y1="8" x2="10" y2="10" stroke="currentColor" stroke-width="0.5" opacity="0.6"/>
                <line x1="14" y1="10" x2="17" y2="13" stroke="currentColor" stroke-width="0.5" opacity="0.6"/>
              </svg>
            </div>
            <div class="cursor-pointer" (click)="router.navigate(['/'])">
              <h1 class="text-2xl font-bold text-white">
                سایت‌ساز
              </h1>
              <p class="text-sm text-white text-opacity-80 font-medium">همسایه</p>
            </div>
          </div>

          <!-- Navigation Menu -->
          <nav class="hidden md:flex items-center space-x-8 space-x-reverse" *ngIf="currentUser$ | async">
            <a class="text-white text-opacity-80 hover:text-white font-medium transition-colors cursor-pointer glass-morphism px-4 py-2 rounded-lg" 
               (click)="router.navigate(['/my-store'])">
              پنل مدیریت
            </a>
            <a class="text-white text-opacity-80 hover:text-white font-medium transition-colors cursor-pointer glass-morphism px-4 py-2 rounded-lg" 
               (click)="router.navigate(['/products'])">
              محصولات
            </a>
            <a class="text-white text-opacity-80 hover:text-white font-medium transition-colors cursor-pointer glass-morphism px-4 py-2 rounded-lg" 
               (click)="router.navigate(['/orders'])">
              سفارشات
            </a>
            <a class="text-white text-opacity-80 hover:text-white font-medium transition-colors cursor-pointer glass-morphism px-4 py-2 rounded-lg" 
               (click)="router.navigate(['/analytics'])">
              آمار و گزارش
            </a>
          </nav>

          <!-- User Menu -->
          <div *ngIf="currentUser$ | async as user; else authButtons" class="relative">
            <div class="flex items-center space-x-3 space-x-reverse cursor-pointer glass-morphism p-3 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-200" (click)="toggleUserMenu()">
              <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-sm font-semibold border border-white border-opacity-30">
                {{ user.username.charAt(0).toUpperCase() }}
              </div>
              <div class="hidden md:block">
                <p class="text-white font-medium">{{ user.username }}</p>
                <p class="text-white text-opacity-70 text-xs">خوش آمدید!</p>
              </div>
              <svg class="w-4 h-4 text-white text-opacity-70 transition-transform duration-200" [class.rotate-180]="showUserMenu" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            
            <!-- Dropdown Menu -->
            <div *ngIf="showUserMenu" class="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100">
              <a class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 cursor-pointer" 
                 (click)="router.navigate(['/my-store']); toggleUserMenu()">
                <svg class="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                فروشگاه من
              </a>
              <a class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 cursor-pointer" 
                 (click)="router.navigate(['/orders']); toggleUserMenu()">
                <svg class="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                سفارشات
              </a>
              <a class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 cursor-pointer" 
                 (click)="router.navigate(['/analytics']); toggleUserMenu()">
                <svg class="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                آمار و گزارش
              </a>
              <hr class="my-2 border-gray-100">
              <a class="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer" 
                 (click)="logout()">
                <svg class="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                خروج
              </a>
            </div>
          </div>

          <!-- Auth Buttons -->
          <ng-template #authButtons>
            <div class="flex items-center space-x-3 space-x-reverse">
              <button class="px-6 py-2.5 text-white text-opacity-80 hover:text-white font-medium transition-colors duration-200 glass-morphism rounded-xl" 
                      (click)="router.navigate(['/login'])">
                ورود
              </button>
              <button class="px-6 py-2.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium rounded-xl transition-all duration-200 border border-white border-opacity-30 backdrop-blur-sm" 
                      (click)="showRequestForm = true">
                درخواست سایت
              </button>
            </div>
          </ng-template>
        </div>
      </div>
      
      <!-- Request Form Modal -->
      <div *ngIf="showRequestForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">درخواست ساخت سایت</h2>
            <button (click)="showRequestForm = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form (ngSubmit)="submitRequest()" #requestForm="ngForm">
            <div class="space-y-4">
              <!-- Store Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">نام فروشگاه</label>
                <input 
                  type="text" 
                  [(ngModel)]="storeRequest.storeName"
                  name="storeName"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="مثال: فروشگاه همسایه">
              </div>
              
              <!-- Phone Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
                <input 
                  type="tel" 
                  [(ngModel)]="storeRequest.phoneNumber"
                  name="phoneNumber"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="09123456789">
              </div>
              
              <!-- Product Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">نوع محصولات</label>
                <input 
                  type="text" 
                  [(ngModel)]="storeRequest.productType"
                  name="productType"
                  required
                  list="productTypes"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="پوشاک، لوازم خانگی، الکترونیک، ...">
                <datalist id="productTypes">
                  <option value="پوشاک">
                  <option value="کفش و کیف">
                  <option value="لوازم خانگی">
                  <option value="الکترونیک">
                  <option value="کتاب و لوازم التحریر">
                  <option value="زیبایی و بهداشت">
                  <option value="ورزش و سرگرمی">
                  <option value="خودرو و موتور">
                  <option value="مواد غذایی">
                  <option value="صنایع دستی">
                  <option value="سایر">
                </datalist>
              </div>
            </div>
            
            <div class="flex space-x-3 space-x-reverse mt-8">
              <button 
                type="submit" 
                [disabled]="!requestForm.form.valid"
                class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                ارسال درخواست
              </button>
              <button 
                type="button" 
                (click)="showRequestForm = false"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      direction: rtl;
    }
    .container {
      max-width: 1280px;
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>;
  showUserMenu = false;
  showRequestForm = false;
  
  storeRequest = {
    storeName: '',
    phoneNumber: '',
    productType: ''
  };

  constructor(
    public router: Router,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }
  
  submitRequest(): void {
    console.log('Store Request Submitted:', this.storeRequest);
    // TODO: Send request to backend API
    alert('درخواست شما با موفقیت ارسال شد! به زودی با شما تماس خواهیم گرفت.');
    this.showRequestForm = false;
    this.storeRequest = {
      storeName: '',
      phoneNumber: '',
      productType: ''
    };
  }
}
