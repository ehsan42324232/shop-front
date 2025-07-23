import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  isMenuOpen = false;
  isLoggedIn = false;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Check if user is logged in
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    // Check localStorage or token service
    const token = localStorage.getItem('auth_token');
    this.isLoggedIn = !!token;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToPlatform() {
    this.router.navigate(['/platform']);
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
