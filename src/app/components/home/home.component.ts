import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <div class="relative">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
        <div class="container mx-auto px-4 py-20 relative">
          <div class="max-w-4xl mx-auto text-center">
            <div class="mb-8">
              <h1 class="text-5xl md:text-7xl font-bold mb-6">
                <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Shop Amazing
                </span>
                <br>
                <span class="text-gray-800">Products Online</span>
              </h1>
              <p class="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Discover thousands of high-quality products from trusted sellers around the world. 
                Fast delivery, secure payments, and amazing deals await you.
              </p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                (click)="router.navigate(['/products'])"
                class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <span class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  Start Shopping
                </span>
              </button>
              <button 
                (click)="router.navigate(['/register'])"
                class="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 bg-white/50 backdrop-blur-sm">
                <span class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                  Join Now - It's Free
                </span>
              </button>
            </div>

            <!-- Features Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div class="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Lightning Fast</h3>
                <p class="text-gray-600">Quick browsing, instant search, and super-fast checkout process.</p>
              </div>
              
              <div class="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Secure & Safe</h3>
                <p class="text-gray-600">Your data and payments are protected with enterprise-grade security.</p>
              </div>
              
              <div class="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Customer Love</h3>
                <p class="text-gray-600">Join thousands of happy customers who trust our platform.</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Decorative Elements -->
        <div class="absolute top-10 left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-xl"></div>
        <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-400/10 rounded-full blur-xl"></div>
      </section>

      <!-- Quick Stats -->
      <section class="py-16 bg-white/50 backdrop-blur-sm border-y border-gray-100">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">1M+</div>
              <div class="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">50K+</div>
              <div class="text-gray-600">Products</div>
            </div>
            <div>
              <div class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">99.9%</div>
              <div class="text-gray-600">Uptime</div>
            </div>
            <div>
              <div class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">24/7</div>
              <div class="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Navigation Test Section -->
      <section class="py-16">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl font-bold text-gray-800 mb-8">Test Navigation</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                (click)="router.navigate(['/products'])"
                class="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m14 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m14 0H6m14 0l-3-3m3 3l-3 3M6 13l3-3m-3 3l3 3"></path>
                  </svg>
                </div>
                <h3 class="font-semibold text-gray-800 mb-1">Products</h3>
                <p class="text-sm text-gray-600">Browse all products</p>
              </button>
              
              <button 
                (click)="router.navigate(['/login'])"
                class="p-6 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                </div>
                <h3 class="font-semibold text-gray-800 mb-1">Login</h3>
                <p class="text-sm text-gray-600">Sign in to your account</p>
              </button>
              
              <button 
                (click)="router.navigate(['/register'])"
                class="p-6 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                </div>
                <h3 class="font-semibold text-gray-800 mb-1">Register</h3>
                <p class="text-sm text-gray-600">Create new account</p>
              </button>
              
              <button 
                (click)="router.navigate(['/basket'])"
                class="p-6 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200">
                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 8.32a2 2 0 01-1.98 1.68H9m8 0a2 2 0 11-4 0m4 0a2 2 0 11-4 0"></path>
                  </svg>
                </div>
                <h3 class="font-semibold text-gray-800 mb-1">Cart</h3>
                <p class="text-sm text-gray-600">View shopping cart</p>
              </button>
            </div>
            
            <div class="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 class="font-semibold text-blue-800 mb-2">🎉 Navigation Working!</h4>
              <p class="text-blue-700 text-sm">Click any button above to test the routing system. The design is now modern and beautiful!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent {
  constructor(public router: Router) {}
}
