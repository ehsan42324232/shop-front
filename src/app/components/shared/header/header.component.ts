import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-header',
  template: `
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Platform Name -->
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0 flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              </div>
              <div class="flex flex-col">
                <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  فروشگاه‌ساز
                </span>
                <span class="text-xs text-gray-500 font-medium hidden sm:block">پلتفرم ساخت فروشگاه آنلاین</span>
              </div>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:block">
            <div class="flex items-center space-x-8">
              <a href="#" class="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                ویژگی‌ها
              </a>
              <a href="#" class="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                قیمت‌ها
              </a>
              <a href="#" class="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                نمونه‌ها
              </a>
              <a href="#" class="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                پشتیبانی
              </a>
            </div>
          </div>

          <!-- Right Side Actions -->
          <div class="flex items-center space-x-4">
            
            <!-- User Menu if Logged In -->
            <div class="relative" *ngIf="getCurrentUser(); else authButtons">
              <button 
                (click)="toggleUserMenu()" 
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-semibold">{{ getUserInitials() }}</span>
                </div>
                <span class="hidden md:block text-gray-700 font-medium">{{ getUserDisplayName() }}</span>
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- User Dropdown -->
              <div 
                *ngIf="showUserMenu" 
                [@slideDown]
                class="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900">{{ getUserDisplayName() }}</p>
                  <p class="text-sm text-gray-500">{{ getCurrentUser()?.email }}</p>
                </div>
                
                <a href="/my-store" class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg class="w-4 h-4 ml-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m0 0h2M7 3v18"></path>
                  </svg>
                  فروشگاه من
                </a>
                
                <a href="/products" class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg class="w-4 h-4 ml-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m14 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m14 0H6m14 0l-3-3m3 3l-3 3M6 13l3-3m-3 3l3 3"></path>
                  </svg>
                  مدیریت محصولات
                </a>
                
                <a href="/orders" class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg class="w-4 h-4 ml-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  سفارشات
                </a>
                
                <a href="/analytics" class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg class="w-4 h-4 ml-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  آمار و گزارش
                </a>
                
                <div class="border-t border-gray-100 my-2"></div>
                
                <button 
                  (click)="logout()" 
                  class="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <svg class="w-4 h-4 ml-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  خروج
                </button>
              </div>
            </div>

            <!-- Auth Buttons for Non-Logged Users -->
            <ng-template #authButtons>
              <div class="flex items-center space-x-3">
                <button 
                  (click)="navigateToLogin()"
                  class="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
                  ورود
                </button>
                <button 
                  (click)="navigateToRegister()"
                  class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg">
                  شروع رایگان
                </button>
              </div>
            </ng-template>

            <!-- Mobile Menu Button -->
            <button 
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div 
          *ngIf="showMobileMenu" 
          [@slideDown]
          class="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
          <div class="flex flex-col space-y-3">
            <a href="#" class="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300">ویژگی‌ها</a>
            <a href="#" class="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300">قیمت‌ها</a>
            <a href="#" class="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300">نمونه‌ها</a>
            <a href="#" class="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300">پشتیبانی</a>
            
            <div class="border-t pt-3 mt-3" *ngIf="!getCurrentUser()">
              <div class="flex flex-col space-y-3">
                <button 
                  (click)="navigateToLogin()"
                  class="text-gray-700 hover:text-blue-600 font-medium py-2 text-right transition-colors duration-300">
                  ورود
                </button>
                <button 
                  (click)="navigateToRegister()"
                  class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg transition-all duration-300">
                  شروع رایگان
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .nav-link {
      position: relative;
    }
    
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      transition: width 0.3s ease;
    }
    
    .nav-link:hover::after {
      width: 100%;
    }
  `],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {
  showUserMenu = false;
  showMobileMenu = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize component
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.showMobileMenu = false;
    }
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    if (this.showMobileMenu) {
      this.showUserMenu = false;
    }
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  getUserDisplayName(): string {
    const user = this.getCurrentUser();
    if (user) {
      if ('firstName' in user && 'lastName' in user) {
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
        return fullName || user.username || user.email || 'کاربر';
      }
      if ('first_name' in user && 'last_name' in user) {
        const legacyUser = user as any;
        const fullName = [legacyUser.first_name, legacyUser.last_name].filter(Boolean).join(' ');
        return fullName || legacyUser.username || legacyUser.email || 'کاربر';
      }
      return user.username || user.email || 'کاربر';
    }
    return 'کاربر';
  }

  getUserInitials(): string {
    const user = this.getCurrentUser();
    if (user) {
      if ('firstName' in user && 'lastName' in user) {
        const initials = [user.firstName, user.lastName]
          .filter(Boolean)
          .map(name => name!.charAt(0))
          .join('')
          .toUpperCase();
        return initials || user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'ک';
      }
      if ('first_name' in user && 'last_name' in user) {
        const legacyUser = user as any;
        const initials = [legacyUser.first_name, legacyUser.last_name]
          .filter(Boolean)
          .map((name: string) => name.charAt(0))
          .join('')
          .toUpperCase();
        return initials || legacyUser.username?.charAt(0).toUpperCase() || legacyUser.email?.charAt(0).toUpperCase() || 'ک';
      }
      return user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'ک';
    }
    return 'ک';
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}