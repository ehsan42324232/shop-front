import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BasketService } from '../../../services/basket.service';
import { User } from '../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-100 sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer" 
                (click)="router.navigate(['/'])">
              ShopPlatform
            </h1>
          </div>

          <!-- Search Bar -->
          <div class="flex-1 max-w-2xl mx-8">
            <div class="relative">
              <input
                type="text"
                placeholder="Search for amazing products..."
                class="w-full px-6 py-3 pl-12 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                (keyup.enter)="onSearch($event)"
                #searchInput
              />
              <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <button 
                class="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                (click)="onSearch(searchInput)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex items-center space-x-6">
            <!-- Basket -->
            <div class="relative cursor-pointer group" (click)="router.navigate(['/basket'])">
              <div class="p-3 rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-all duration-200">
                <svg class="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 8.32a2 2 0 01-1.98 1.68H9m8 0a2 2 0 11-4 0m4 0a2 2 0 11-4 0"></path>
                </svg>
              </div>
              <span class="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold shadow-lg"
                    *ngIf="(basketCount$ | async)! > 0">
                {{ basketCount$ | async }}
              </span>
            </div>

            <!-- User Menu -->
            <div *ngIf="currentUser$ | async as user; else authButtons" class="relative">
              <div class="flex items-center space-x-3 cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-all duration-200" (click)="toggleUserMenu()">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                  {{ user.username.charAt(0).toUpperCase() }}
                </div>
                <div class="hidden md:block">
                  <p class="text-gray-700 font-medium">{{ user.username }}</p>
                  <p class="text-gray-400 text-xs">Welcome back!</p>
                </div>
                <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" [class.rotate-180]="showUserMenu" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              <!-- Dropdown Menu -->
              <div *ngIf="showUserMenu" class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100 animate-in slide-in-from-top-2 duration-200">
                <a class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 cursor-pointer" 
                   (click)="router.navigate(['/profile']); toggleUserMenu()">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Profile
                </a>
                <a class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 cursor-pointer" 
                   (click)="router.navigate(['/orders']); toggleUserMenu()">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  My Orders
                </a>
                <a class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 cursor-pointer" 
                   (click)="router.navigate(['/stores']); toggleUserMenu()">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  My Stores
                </a>
                <hr class="my-2 border-gray-100">
                <a class="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer" 
                   (click)="logout()">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Logout
                </a>
              </div>
            </div>

            <!-- Auth Buttons -->
            <ng-template #authButtons>
              <div class="flex items-center space-x-3">
                <button class="px-6 py-2.5 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200" 
                        (click)="router.navigate(['/login'])">
                  Sign In
                </button>
                <button class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
                        (click)="router.navigate(['/register'])">
                  Get Started
                </button>
              </div>
            </ng-template>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .container {
      max-width: 1280px;
    }
    
    @keyframes slide-in-from-top {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-in {
      animation: slide-in-from-top 0.2s ease-out;
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>;
  basketCount$: Observable<number>;
  showUserMenu = false;

  constructor(
    public router: Router,
    private authService: AuthService,
    private basketService: BasketService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.basketCount$ = this.basketService.basketCount$;
  }

  ngOnInit(): void {}

  onSearch(input: any): void {
    const query = input.value || input.target?.value;
    if (query?.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: query.trim() } });
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }
}
