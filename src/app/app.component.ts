import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <app-loading></app-loading>
    </div>
  `
})
export class AppComponent implements OnInit {
  title = 'shop-frontend';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Initialize authentication state
  }
}
