import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-platform-home',
  template: `
    <!-- Navigation -->
    <nav class="fixed w-full z-50 glass-morphism" dir="rtl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <!-- Logo SVG -->
              <svg width="150" height="40" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" class="ml-2">
                <defs>
                  <linearGradient id="toolboxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
                  </linearGradient>
                  <linearGradient id="toolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ea580c;stop-opacity:1" />
                  </linearGradient>
                  <linearGradient id="bagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <rect x="10" y="25" width="30" height="20" rx="3" fill="url(#toolboxGradient)"/>
                <rect x="20" y="22" width="10" height="5" rx="2" fill="url(#toolboxGradient)"/>
                <rect x="13" y="28" width="1.5" height="14" rx="0.5" fill="url(#toolGradient)"/>
                <rect x="16" y="26" width="1.5" height="16" rx="0.5" fill="url(#toolGradient)"/>
                <rect x="19" y="29" width="1.5" height="13" rx="0.5" fill="url(#toolGradient)"/>
                <rect x="22" y="27" width="1.5" height="15" rx="0.5" fill="url(#toolGradient)"/>
                <rect x="25" y="30" width="1.5" height="12" rx="0.5" fill="url(#toolGradient)"/>
                <rect x="28" y="26" width="1.5" height="16" rx="0.5" fill="url(#toolGradient)"/>
                <rect x="31" y="31" width="1.5" height="11" rx="0.5" fill="url(#toolGradient)"/>
                <rect x="34" y="28" width="1.5" height="14" rx="0.5" fill="url(#toolGradient)"/>
                <path d="M 45 25 L 55 25 Q 56 25 56 26 L 56 38 Q 56 40 55 40 L 45 40 Q 44 40 44 38 L 44 26 Q 44 25 45 25 Z" fill="url(#bagGradient)"/>
                <path d="M 47 25 Q 47 22 50 22 Q 53 22 53 25" stroke="url(#bagGradient)" stroke-width="1.5" fill="none"/>
                <text x="65" y="30" font-family="Vazir, Tahoma, Arial" font-size="12" font-weight="bold" fill="#1f2937">فروشگاه‌ساز</text>
                <text x="65" y="42" font-family="Vazir, Tahoma, Arial" font-size="10" font-weight="600" fill="#6b7280">جعبه‌ابزار</text>
              </svg>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="mr-10 flex items-baseline space-x-4 space-x-reverse">
              <a href="#features" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">ویژگی‌ها</a>
              <a href="#demo" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">نمایش</a>
              <a href="#pricing" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">تعرفه</a>
              <a href="#request" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">درخواست</a>
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                شروع کنید
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="gradient-bg min-h-screen flex items-center justify-center relative overflow-hidden" dir="rtl">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="animate-fade-in-up">
          <h1 class="text-5xl md:text-7xl font-bold text-white mb-6">
            <span class="typing-text text-yellow-300">امپراطوری چندفروشگاهی</span>
            خود را بسازید
          </h1>
          <p class="text-xl md:text-2xl text-white mb-8 opacity-90 max-w-3xl mx-auto">
            قدرتمندترین پلتفرم فروشگاه‌سازی که به شما امکان ایجاد، مدیریت و توسعه چندین فروشگاه آنلاین از یک پنل واحد را می‌دهد.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              شروع رایگان
            </button>
            <button class="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105">
              مشاهده نمایش
            </button>
          </div>
        </div>
      </div>
      
      <!-- Floating Elements -->
      <div class="absolute top-20 right-10 animate-float">
        <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span class="text-2xl">🛍️</span>
        </div>
      </div>
      <div class="absolute top-40 left-20 animate-float" style="animation-delay: -2s">
        <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span class="text-xl">💎</span>
        </div>
      </div>
      <div class="absolute bottom-20 right-20 animate-float" style="animation-delay: -4s">
        <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span class="text-2xl">🚀</span>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white" dir="rtl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            همه چیزهایی که برای <span class="text-blue-600">موفقیت</span> نیاز دارید
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            از مدیریت دسته‌بندی‌های انعطاف‌پذیر تا آنالیتیک پیشرفته، تمام ابزارهای لازم برای ساخت و رشد کسب‌وکار آنلاین شما.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature Cards -->
          <div class="feature-demo bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-lg">
            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
              <span class="text-2xl text-white">🏗️</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">دسته‌بندی انعطاف‌پذیر</h3>
            <p class="text-gray-600 mb-6">تا ۱۰ سطح دسته‌بندی و ۵۰ ویژگی برای هر محصول. بدون محدودیت، بدون قالب از پیش تعریف شده.</p>
            <div class="bg-white p-4 rounded-lg shadow-inner">
              <div class="space-y-2 text-sm">
                <div class="flex justify-between items-center">
                  <span>پوشاک</span>
                  <span class="text-blue-600">→ شلوار → زنانه</span>
                </div>
                <div class="flex justify-between items-center">
                  <span>الکترونیک</span>
                  <span class="text-purple-600">→ موبایل → سامسونگ</span>
                </div>
              </div>
            </div>
          </div>

          <div class="feature-demo bg-gradient-to-br from-green-50 to-teal-100 p-8 rounded-2xl shadow-lg">
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce-slow" style="animation-delay: -1s">
              <span class="text-2xl text-white">📊</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">مدیریت با اکسل</h3>
            <p class="text-gray-600 mb-6">آپلود و مدیریت دسته‌ها و محصولات از طریق فایل اکسل. سریع، آسان و حرفه‌ای.</p>
            <div class="bg-white p-4 rounded-lg shadow-inner">
              <div class="flex items-center space-x-2 space-x-reverse mb-2">
                <div class="w-4 h-4 bg-green-500 rounded animate-pulse"></div>
                <span class="text-sm">آپلود موفق</span>
              </div>
              <div class="text-xs text-gray-500">
                ۱۲۰ محصول و ۱۵ دسته‌بندی اضافه شد
              </div>
            </div>
          </div>

          <div class="feature-demo bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-2xl shadow-lg">
            <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6 animate-bounce-slow" style="animation-delay: -2s">
              <span class="text-2xl text-white">🏪</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">چندین فروشگاه</h3>
            <p class="text-gray-600 mb-6">مدیریت نامحدود فروشگاه از یک پنل قدرتمند. تغییر بین فروشگاه‌ها بدون مشکل.</p>
            <div class="bg-white p-4 rounded-lg shadow-inner">
              <div class="grid grid-cols-2 gap-2">
                <div class="text-center p-2 bg-blue-50 rounded">
                  <div class="text-sm font-bold">فروشگاه ۱</div>
                  <div class="text-xs text-gray-500">فعال</div>
                </div>
                <div class="text-center p-2 bg-purple-50 rounded">
                  <div class="text-sm font-bold">فروشگاه ۲</div>
                  <div class="text-xs text-gray-500">در حال ساخت</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Request Form Section -->
    <section id="request" class="py-20 bg-gray-100" dir="rtl">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            فروشگاه خود را <span class="text-purple-600">درخواست</span> کنید
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            تنها سه مرحله ساده: نام، شماره و نوع محصولات. ما بقیه کارها را انجام می‌دهیم.
          </p>
        </div>

        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <form class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">نام فروشگاه</label>
                <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="مثال: فروشگاه پوشاک آریا">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
                <input type="tel" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="09123456789">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نوع محصولات</label>
              <textarea rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="مثال: پوشاک زنانه و مردانه، کیف و کفش، لوازم جانبی..."></textarea>
            </div>
            
            <div class="text-center">
              <button type="submit" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                درخواست فروشگاه
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-gray-900" dir="rtl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="animate-fade-in-up">
            <div class="text-4xl md:text-5xl font-bold text-white mb-2" #storesCount>0</div>
            <div class="text-gray-400 text-lg">فروشگاه فعال</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="text-4xl md:text-5xl font-bold text-white mb-2" #revenueCount>0</div>
            <div class="text-gray-400 text-lg">میلیارد تومان فروش</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.4s">
            <div class="text-4xl md:text-5xl font-bold text-white mb-2" #ordersCount>0</div>
            <div class="text-gray-400 text-lg">سفارش پردازش شده</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.6s">
            <div class="text-4xl md:text-5xl font-bold text-white mb-2" #categoriesCount>0</div>
            <div class="text-gray-400 text-lg">دسته‌بندی متنوع</div>
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
    
    /* Persian font styles */
    body, * {
      font-family: 'Vazir', 'Tahoma', 'Arial', sans-serif;
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
  @ViewChild('categoriesCount', { static: false }) categoriesCount!: ElementRef;

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
      
      element.textContent = Math.floor(current).toLocaleString('fa-IR');
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
              this.animateCounter(this.storesCount.nativeElement, 2500);
            }
            if (this.revenueCount?.nativeElement) {
              this.animateCounter(this.revenueCount.nativeElement, 150);
            }
            if (this.ordersCount?.nativeElement) {
              this.animateCounter(this.ordersCount.nativeElement, 250000);
            }
            if (this.categoriesCount?.nativeElement) {
              this.animateCounter(this.categoriesCount.nativeElement, 1500);
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