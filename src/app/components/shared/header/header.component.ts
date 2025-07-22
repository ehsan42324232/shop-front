import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-header',
  template: `
    <header class="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
      <nav class="mx-auto max-w-7xl px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Modern Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                ShopSphere
              </span>
              <span class="text-xs text-gray-400 font-medium">Digital Commerce Platform</span>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-8">
            <a href="#" class="nav-link text-gray-300 hover:text-white font-medium transition-colors duration-300">Dashboard</a>
            <a href="#" class="nav-link text-gray-300 hover:text-white font-medium transition-colors duration-300">Products</a>
            <a href="#" class="nav-link text-gray-300 hover:text-white font-medium transition-colors duration-300">Analytics</a>
            <a href="#" class="nav-link text-gray-300 hover:text-white font-medium transition-colors duration-300">Orders</a>
            <a href="#" class="nav-link text-gray-300 hover:text-white font-medium transition-colors duration-300">Settings</a>
          </div>

          <!-- Right Side Actions -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="hidden md:flex items-center">
              <div class="relative">
                <input 
                  type="text" 
                  placeholder="Search..."
                  class="w-64 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all duration-300">
                <svg class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Notifications -->
            <button class="relative p-2 text-gray-400 hover:text-white transition-colors duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5 5-5h-5m-6 10v-2a6 6 0 10-12 0v2a2 2 0 01-2 2h16a2 2 0 01-2-2z"></path>
              </svg>
              <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            <!-- Live Chat Toggle -->
            <button 
              (click)="toggleLiveChat()"
              class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <span class="hidden sm:inline">Live Chat</span>
            </button>

            <!-- User Profile Dropdown -->
            <div class="relative" (click)="toggleUserMenu()">
              <button class="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors duration-300">
                <div class="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-semibold">{{ getUserInitials() }}</span>
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-white text-sm font-medium">{{ getUserDisplayName() }}</p>
                  <p class="text-gray-400 text-xs">{{ getCurrentUser()?.role || 'Member' }}</p>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div 
                *ngIf="showUserMenu" 
                [@slideDown]
                class="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl py-2">
                <div class="px-4 py-3 border-b border-white/10">
                  <p class="text-white font-medium">{{ getUserDisplayName() }}</p>
                  <p class="text-gray-400 text-sm">{{ getCurrentUser()?.email || 'user@example.com' }}</p>
                </div>
                
                <a href="#" class="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Profile Settings
                </a>
                
                <a href="#" class="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                  Payment Methods
                </a>
                
                <a href="#" class="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Account Settings
                </a>
                
                <div class="border-t border-white/10 my-2"></div>
                
                <button 
                  (click)="logout()" 
                  class="flex items-center w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-300">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>

            <!-- Mobile Menu Button -->
            <button 
              (click)="toggleMobileMenu()"
              class="lg:hidden p-2 text-gray-400 hover:text-white transition-colors duration-300">
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
          class="lg:hidden mt-4 p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-white/10">
          <div class="flex flex-col space-y-4">
            <!-- Mobile Search -->
            <div class="relative">
              <input 
                type="text" 
                placeholder="Search..."
                class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
              <svg class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            <!-- Mobile Navigation Links -->
            <a href="#" class="text-gray-300 hover:text-white font-medium transition-colors duration-300 py-2">Dashboard</a>
            <a href="#" class="text-gray-300 hover:text-white font-medium transition-colors duration-300 py-2">Products</a>
            <a href="#" class="text-gray-300 hover:text-white font-medium transition-colors duration-300 py-2">Analytics</a>
            <a href="#" class="text-gray-300 hover:text-white font-medium transition-colors duration-300 py-2">Orders</a>
            <a href="#" class="text-gray-300 hover:text-white font-medium transition-colors duration-300 py-2">Settings</a>
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
      background: linear-gradient(90deg, #06b6d4, #8b5cf6);
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

  toggleLiveChat(): void {
    // Emit event to parent component or service to show live chat
    // This could be handled by a global service
    console.log('Toggle live chat');
  }

  getCurrentUser() {
    // Return current user from auth service
    return this.authService.getCurrentUser();
  }

  getUserDisplayName(): string {
    const user = this.getCurrentUser();
    if (user) {
      // Handle new User model with firstName and lastName
      if ('firstName' in user && 'lastName' in user) {
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
        return fullName || user.username || user.email || 'User';
      }
      // Handle legacy user format with first_name and last_name
      if ('first_name' in user && 'last_name' in user) {
        const legacyUser = user as any;
        const fullName = [legacyUser.first_name, legacyUser.last_name].filter(Boolean).join(' ');
        return fullName || legacyUser.username || legacyUser.email || 'User';
      }
      // Fallback to username or email
      return user.username || user.email || 'User';
    }
    return 'User';
  }

  getUserInitials(): string {
    const user = this.getCurrentUser();
    if (user) {
      // Handle new User model with firstName and lastName
      if ('firstName' in user && 'lastName' in user) {
        const initials = [user.firstName, user.lastName]
          .filter(Boolean)
          .map(name => name!.charAt(0))
          .join('')
          .toUpperCase();
        return initials || user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
      }
      // Handle legacy user format with first_name and last_name
      if ('first_name' in user && 'last_name' in user) {
        const legacyUser = user as any;
        const initials = [legacyUser.first_name, legacyUser.last_name]
          .filter(Boolean)
          .map((name: string) => name.charAt(0))
          .join('')
          .toUpperCase();
        return initials || legacyUser.username?.charAt(0).toUpperCase() || legacyUser.email?.charAt(0).toUpperCase() || 'U';
      }
      // Fallback to username or email
      return user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
    }
    return 'U';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}