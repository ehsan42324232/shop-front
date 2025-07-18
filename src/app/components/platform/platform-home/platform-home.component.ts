import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-platform-home',
  template: `
    <!-- Navigation -->
    <nav class="fixed w-full z-50 glass-morphism">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShopFlow
              </h2>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <a href="#features" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
              <a href="#demo" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Demo</a>
              <a href="#pricing" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Pricing</a>
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="gradient-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="animate-fade-in-up">
          <h1 class="text-5xl md:text-7xl font-bold text-white mb-6">
            Build Your
            <span class="typing-text text-yellow-300">Multi-Store Empire</span>
          </h1>
          <p class="text-xl md:text-2xl text-white mb-8 opacity-90 max-w-3xl mx-auto">
            The most powerful e-commerce platform that lets you create, manage, and scale multiple online stores from a single dashboard.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Start Free Trial
            </button>
            <button class="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
      
      <!-- Floating Elements -->
      <div class="absolute top-20 left-10 animate-float">
        <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span class="text-2xl">🛍️</span>
        </div>
      </div>
      <div class="absolute top-40 right-20 animate-float" style="animation-delay: -2s">
        <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span class="text-xl">💎</span>
        </div>
      </div>
      <div class="absolute bottom-20 left-20 animate-float" style="animation-delay: -4s">
        <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span class="text-2xl">🚀</span>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to <span class="text-blue-600">Succeed</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            From inventory management to analytics, we provide all the tools you need to build and grow your online business.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature Cards with animations -->
          <div class="feature-demo bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-lg">
            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
              <span class="text-2xl text-white">🏪</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Multi-Store Management</h3>
            <p class="text-gray-600 mb-6">Manage unlimited stores from one powerful dashboard. Switch between stores seamlessly.</p>
            <div class="bg-white p-4 rounded-lg shadow-inner">
              <div class="flex space-x-2 mb-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div class="space-y-2">
                <div class="h-2 bg-blue-200 rounded animate-pulse"></div>
                <div class="h-2 bg-purple-200 rounded animate-pulse" style="animation-delay: 0.5s"></div>
                <div class="h-2 bg-green-200 rounded animate-pulse" style="animation-delay: 1s"></div>
              </div>
            </div>
          </div>

          <!-- Add other feature cards similarly... -->
          <div class="feature-demo bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-2xl shadow-lg">
            <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6 animate-bounce-slow" style="animation-delay: -1s">
              <span class="text-2xl text-white">📊</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Advanced Analytics</h3>
            <p class="text-gray-600 mb-6">Real-time insights and detailed reports to track your business performance.</p>
            <div class="bg-white p-4 rounded-lg shadow-inner">
              <div class="flex items-end space-x-1 h-20">
                <div class="w-6 bg-purple-300 rounded-t animate-pulse" style="height: 60%"></div>
                <div class="w-6 bg-purple-400 rounded-t animate-pulse" style="height: 80%; animation-delay: 0.2s"></div>
                <div class="w-6 bg-purple-500 rounded-t animate-pulse" style="height: 100%; animation-delay: 0.4s"></div>
                <div class="w-6 bg-purple-400 rounded-t animate-pulse" style="height: 70%; animation-delay: 0.6s"></div>
              </div>
            </div>
          </div>

          <!-- Continue with remaining feature cards -->
          <div class="feature-demo bg-gradient-to-br from-green-50 to-teal-100 p-8 rounded-2xl shadow-lg">
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce-slow" style="animation-delay: -2s">
              <span class="text-2xl text-white">🎨</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Custom Themes</h3>
            <p class="text-gray-600 mb-6">Beautiful, responsive themes that make your store stand out.</p>
            <div class="bg-white p-4 rounded-lg shadow-inner">
              <div class="grid grid-cols-3 gap-2">
                <div class="h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded animate-pulse"></div>
                <div class="h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded animate-pulse" style="animation-delay: 0.3s"></div>
                <div class="h-8 bg-gradient-to-r from-pink-400 to-red-500 rounded animate-pulse" style="animation-delay: 0.6s"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, <span class="text-green-600">Transparent</span> Pricing
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your business. Start free and scale as you grow.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-500 transition-all transform hover:scale-105">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Starter</h3>
              <div class="text-4xl font-bold text-gray-900 mb-2">$0</div>
              <div class="text-gray-600 mb-6">per month</div>
              <button class="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                Start Free
              </button>
            </div>
            <ul class="mt-8 space-y-4">
              <li class="flex items-center">
                <span class="text-green-500 mr-3">✓</span>
                <span>1 Store</span>
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-3">✓</span>
                <span>Up to 100 products</span>
              </li>
            </ul>
          </div>

          <div class="bg-blue-600 border-2 border-blue-600 rounded-2xl p-8 transform scale-105 relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
            </div>
            <div class="text-center">
              <h3 class="text-2xl font-bold text-white mb-4">Professional</h3>
              <div class="text-4xl font-bold text-white mb-2">$29</div>
              <div class="text-blue-200 mb-6">per month</div>
              <button class="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started
              </button>
            </div>
            <ul class="mt-8 space-y-4 text-white">
              <li class="flex items-center">
                <span class="text-yellow-400 mr-3">✓</span>
                <span>5 Stores</span>
              </li>
              <li class="flex items-center">
                <span class="text-yellow-400 mr-3">✓</span>
                <span>Unlimited products</span>
              </li>
            </ul>
          </div>

          <div class="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-500 transition-all transform hover:scale-105">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
              <div class="text-4xl font-bold text-gray-900 mb-2">$99</div>
              <div class="text-gray-600 mb-6">per month</div>
              <button class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Contact Sales
              </button>
            </div>
            <ul class="mt-8 space-y-4">
              <li class="flex items-center">
                <span class="text-green-500 mr-3">✓</span>
                <span>Unlimited stores</span>
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-3">✓</span>
                <span>AI-powered insights</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="animate-fade-in-up">
            <div class="text-4xl md:text-5xl font-bold text-white mb-2" #storesCount>0</div>
            <div class="text-gray-400 text-lg">Active Stores</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="text-4xl md:text-5xl font-bold text-white mb-2" #revenueCount>$0</div>
            <div class="text-gray-400 text-lg">Total Revenue</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.4s">
            <div class="text-4xl md:text-5xl font-bold text-white mb-2" #ordersCount>0</div>
            <div class="text-gray-400 text-lg">Orders Processed</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.6s">
            <div class="text-4xl md:text-5xl font-bold text-white mb-2" #countriesCount>0</div>
            <div class="text-gray-400 text-lg">Countries Served</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .gradient-bg {
      background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
      background-size: 400% 400%;
      animation: gradient 15s ease infinite;
    }
    
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .glass-morphism {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.18);
    }
    
    .feature-demo {
      transition: all 0.3s ease;
    }
    
    .feature-demo:hover {
      transform: scale(1.05);
    }
    
    .typing-text {
      border-right: 3px solid #3B82F6;
      white-space: nowrap;
      overflow: hidden;
      animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
    }
    
    @keyframes typing {
      from { width: 0 }
      to { width: 100% }
    }
    
    @keyframes blink-caret {
      from, to { border-color: transparent }
      50% { border-color: #3B82F6; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) }
      50% { transform: translateY(-20px) }
    }
    
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(30px) }
      100% { opacity: 1; transform: translateY(0) }
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out;
    }
    
    .animate-bounce-slow {
      animation: bounce 3s infinite;
    }
    
    @media (max-width: 768px) {
      .typing-text {
        animation: none;
        border-right: none;
        white-space: normal;
        overflow: visible;
      }
    }
  `]
})
export class PlatformHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('storesCount', { static: false }) storesCount!: ElementRef;
  @ViewChild('revenueCount', { static: false }) revenueCount!: ElementRef;
  @ViewChild('ordersCount', { static: false }) ordersCount!: ElementRef;
  @ViewChild('countriesCount', { static: false }) countriesCount!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.setupSmoothScrolling();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  private setupSmoothScrolling(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector((this as HTMLAnchorElement).getAttribute('href')!);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  private animateCounter(element: HTMLElement, finalValue: number, duration: number = 2000): void {
    const start = 0;
    const increment = finalValue / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= finalValue) {
        current = finalValue;
        clearInterval(timer);
      }
      
      if (element.textContent?.includes('$')) {
        element.textContent = '$' + Math.floor(current).toLocaleString() + 'M';
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  }

  private setupIntersectionObserver(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('bg-gray-900')) {
            // Animate stats when they come into view
            if (this.storesCount?.nativeElement) {
              this.animateCounter(this.storesCount.nativeElement, 25000);
            }
            if (this.revenueCount?.nativeElement) {
              this.animateCounter(this.revenueCount.nativeElement, 150);
            }
            if (this.ordersCount?.nativeElement) {
              this.animateCounter(this.ordersCount.nativeElement, 2500000);
            }
            if (this.countriesCount?.nativeElement) {
              this.animateCounter(this.countriesCount.nativeElement, 150);
            }
          }
        }
      });
    }, observerOptions);

    // Observe the stats section
    const statsSection = document.querySelector('.bg-gray-900');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }
}