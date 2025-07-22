import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-landing-page',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
          <div class="shape shape-5"></div>
        </div>
      </div>

      <!-- Modern Header -->
      <header class="relative z-50 px-6 py-4">
        <nav class="mx-auto max-w-7xl flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Modern Logo -->
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              </div>
              <span class="text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                ShopSphere
              </span>
            </div>
          </div>
          
          <!-- Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-gray-300 hover:text-white transition-colors duration-300">Features</a>
            <a href="#pricing" class="text-gray-300 hover:text-white transition-colors duration-300">Pricing</a>
            <a href="#contact" class="text-gray-300 hover:text-white transition-colors duration-300">Contact</a>
            <button 
              (click)="navigateToLogin()"
              class="px-4 py-2 text-white bg-transparent border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300">
              Sign In
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <button class="md:hidden text-white" (click)="toggleMobileMenu()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </nav>

        <!-- Mobile Menu -->
        <div *ngIf="mobileMenuOpen" class="md:hidden mt-4 p-4 bg-black/20 backdrop-blur-sm rounded-lg">
          <div class="flex flex-col space-y-4">
            <a href="#features" class="text-gray-300 hover:text-white transition-colors duration-300">Features</a>
            <a href="#pricing" class="text-gray-300 hover:text-white transition-colors duration-300">Pricing</a>
            <a href="#contact" class="text-gray-300 hover:text-white transition-colors duration-300">Contact</a>
            <button 
              (click)="navigateToLogin()"
              class="px-4 py-2 text-white bg-transparent border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300 w-full">
              Sign In
            </button>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <main class="relative z-10 px-6 pt-20 pb-32">
        <div class="mx-auto max-w-7xl text-center">
          <div [@fadeInUp]="animationState" class="space-y-8">
            <!-- Hero Badge -->
            <div class="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm text-white">
              <span class="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
              New: Advanced Analytics Dashboard Available
            </div>

            <!-- Hero Title -->
            <h1 class="text-5xl md:text-7xl font-bold text-white leading-tight">
              Build Your
              <span class="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Digital Empire
              </span>
              Today
            </h1>

            <!-- Hero Subtitle -->
            <p class="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your business with our cutting-edge e-commerce platform. 
              Create stunning online stores, manage inventory, and scale globally with zero technical complexity.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button 
                (click)="startFreeTrial()"
                class="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <span class="relative z-10 flex items-center">
                  Start Free Trial
                  <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button 
                (click)="watchDemo()"
                class="px-8 py-4 text-white border border-white/30 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center group">
                <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                </svg>
                Watch Demo
              </button>
            </div>

            <!-- Trust Indicators -->
            <div class="pt-16">
              <p class="text-gray-400 text-sm mb-8">Trusted by over 50,000+ businesses worldwide</p>
              <div class="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div class="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <span class="text-white font-semibold">TechCorp</span>
                </div>
                <div class="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <span class="text-white font-semibold">InnovateX</span>
                </div>
                <div class="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <span class="text-white font-semibold">GlobalTrade</span>
                </div>
                <div class="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <span class="text-white font-semibold">FutureStore</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Contact Section -->
      <section id="contact" class="relative z-10 px-6 py-32 bg-black/20 backdrop-blur-sm">
        <div class="mx-auto max-w-4xl text-center">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get
            <span class="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Started?</span>
          </h2>
          <p class="text-xl text-gray-300 mb-12">
            Join thousands of businesses already using ShopSphere to grow their online presence
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              (click)="startFreeTrial()"
              class="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300">
              Start Your Free Trial
            </button>
            <button 
              (click)="openLiveChat()"
              class="px-8 py-4 text-white border border-white/30 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Chat with Sales
            </button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="relative z-10 px-6 py-16 border-t border-white/10">
        <div class="mx-auto max-w-7xl">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="flex items-center space-x-3 mb-8 md:mb-0">
              <div class="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              </div>
              <span class="text-xl font-bold text-white">ShopSphere</span>
            </div>
            
            <div class="flex space-x-6 text-gray-400">
              <a href="#" class="hover:text-white transition-colors duration-300">Privacy</a>
              <a href="#" class="hover:text-white transition-colors duration-300">Terms</a>
              <a href="#" class="hover:text-white transition-colors duration-300">Support</a>
            </div>
          </div>
          
          <div class="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; 2025 ShopSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>

    <!-- Live Chat Component -->
    <app-live-chat *ngIf="showLiveChat" (onClose)="closeLiveChat()"></app-live-chat>
  `,
  styles: [`
    .floating-shapes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 1;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(168, 85, 247, 0.1));
      animation: float 20s infinite linear;
    }

    .shape-1 {
      width: 300px;
      height: 300px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 200px;
      height: 200px;
      top: 70%;
      right: 20%;
      animation-delay: -5s;
    }

    .shape-3 {
      width: 400px;
      height: 400px;
      top: 30%;
      right: 10%;
      animation-delay: -10s;
    }

    .shape-4 {
      width: 150px;
      height: 150px;
      bottom: 20%;
      left: 30%;
      animation-delay: -15s;
    }

    .shape-5 {
      width: 250px;
      height: 250px;
      top: 50%;
      left: 50%;
      animation-delay: -7s;
    }

    @keyframes float {
      0% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.5;
      }
      50% {
        transform: translateY(-100px) rotate(180deg);
        opacity: 0.8;
      }
      100% {
        transform: translateY(0px) rotate(360deg);
        opacity: 0.5;
      }
    }

    @media (max-width: 768px) {
      .shape {
        display: none;
      }
    }
  `],
  animations: [
    trigger('fadeInUp', [
      state('in', style({opacity: 1, transform: 'translateY(0)'})),
      transition('void => *', [
        style({opacity: 0, transform: 'translateY(30px)'}),
        animate(1000)
      ])
    ])
  ]
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  mobileMenuOpen = false;
  showLiveChat = false;
  animationState = 'in';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Component initialization logic
  }

  ngAfterViewInit(): void {
    // Add smooth scrolling for navigation links
    this.setupSmoothScrolling();
  }

  private setupSmoothScrolling(): void {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  startFreeTrial(): void {
    // Navigate to registration with free trial
    this.router.navigate(['/auth/register'], { 
      queryParams: { plan: 'starter', trial: 'true' }
    });
  }

  watchDemo(): void {
    // Open demo video or navigate to demo page
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  }

  selectPlan(plan: string): void {
    // Navigate to registration with selected plan
    this.router.navigate(['/auth/register'], { 
      queryParams: { plan: plan }
    });
  }

  openLiveChat(): void {
    this.showLiveChat = true;
  }

  closeLiveChat(): void {
    this.showLiveChat = false;
  }
}