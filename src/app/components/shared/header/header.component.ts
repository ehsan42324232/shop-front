import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50" dir="rtl">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center space-x-3 space-x-reverse">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer" 
                (click)="router.navigate(['/'])">
              فروشگاه‌ساز
            </h1>
          </div>

          <!-- Navigation Menu -->
          <nav class="hidden md:flex items-center space-x-8 space-x-reverse" *ngIf="currentUser$ | async">
            <a class="text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer" 
               (click)="router.navigate(['/my-store'])">
              پنل مدیریت
            </a>
            <a class="text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer" 
               (click)="router.navigate(['/products'])">
              محصولات
            </a>
            <a class="text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer" 
               (click)="router.navigate(['/orders'])">
              سفارشات
            </a>
            <a class="text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer" 
               (click)="router.navigate(['/analytics'])">
              آمار و گزارش
            </a>
          </nav>

          <!-- User Menu -->
          <div *ngIf="currentUser$ | async as user; else authButtons" class="relative">
            <div class="flex items-center space-x-3 space-x-reverse cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-all duration-200" (click)="toggleUserMenu()">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                {{ user.username.charAt(0).toUpperCase() }}
              </div>
              <div class="hidden md:block">
                <p class="text-gray-700 font-medium">{{ user.username }}</p>
                <p class="text-gray-400 text-xs">خوش آمدید!</p>
              </div>
              <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" [class.rotate-180]="showUserMenu" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <button class="px-6 py-2.5 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200" 
                      (click)="router.navigate(['/login'])">
                ورود
              </button>
              <button class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl" 
                      (click)="router.navigate(['/register'])">
                درخواست فروشگاه
              </button>
            </div>
          </ng-template>
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
}
