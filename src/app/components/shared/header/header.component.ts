import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BasketService } from '../../../services/basket.service';
import { User } from '../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-blue-600 cursor-pointer" 
                (click)="router.navigate(['/'])">
              ShopPlatform
            </h1>
          </div>

          <!-- Search Bar -->
          <div class="flex-1 max-w-lg mx-8">
            <div class="relative">
              <input
                type="text"
                placeholder="Search products..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                (keyup.enter)="onSearch($event)"
                #searchInput
              />
              <button 
                class="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                (click)="onSearch(searchInput)">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex items-center space-x-6">
            <!-- Basket -->
            <div class="relative cursor-pointer" (click)="router.navigate(['/basket'])">
              <svg class="w-6 h-6 text-gray-600 hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 8.32a2 2 0 01-1.98 1.68H9m8 0a2 2 0 11-4 0m4 0a2 2 0 11-4 0"></path>
              </svg>
              <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    *ngIf="(basketCount$ | async)! > 0">
                {{ basketCount$ | async }}
              </span>
            </div>

            <!-- User Menu -->
            <div *ngIf="currentUser$ | async as user; else authButtons" class="relative">
              <div class="flex items-center space-x-2 cursor-pointer" (click)="toggleUserMenu()">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {{ user.username.charAt(0).toUpperCase() }}
                </div>
                <span class="text-gray-700">{{ user.username }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              <!-- Dropdown Menu -->
              <div *ngIf="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" 
                   (click)="router.navigate(['/profile']); toggleUserMenu()">
                  Profile
                </a>
                <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" 
                   (click)="router.navigate(['/orders']); toggleUserMenu()">
                  My Orders
                </a>
                <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" 
                   (click)="router.navigate(['/stores']); toggleUserMenu()">
                  My Stores
                </a>
                <hr class="my-1">
                <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" 
                   (click)="logout()">
                  Logout
                </a>
              </div>
            </div>

            <!-- Auth Buttons -->
            <ng-template #authButtons>
              <button class="text-gray-600 hover:text-blue-600 font-medium" 
                      (click)="router.navigate(['/login'])">
                Login
              </button>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" 
                      (click)="router.navigate(['/register'])">
                Register
              </button>
            </ng-template>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .container {
      max-width: 1200px;
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
