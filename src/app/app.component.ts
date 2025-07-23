import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header></app-header>
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
      <!-- Temporarily comment out loading to test -->
      <!-- <app-loading></app-loading> -->
    </div>
  `
})
export class AppComponent implements OnInit {
  title = 'Mall - فروشگاه‌ساز آنلاین';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Initialize authentication state
    this.initializeApp();
  }

  private initializeApp(): void {
    // Check for existing authentication token
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Validate token with backend
      // this.authService.validateToken(token).subscribe();
    }
    
    // Set up any global app settings
    this.setupGlobalSettings();
  }

  private setupGlobalSettings(): void {
    // Set RTL direction
    document.dir = 'rtl';
    document.lang = 'fa';
    
    // Add any global CSS classes
    document.body.classList.add('rtl', 'persian-font');
  }
}
