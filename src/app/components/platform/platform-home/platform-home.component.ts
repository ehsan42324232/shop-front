import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-platform-home',
  template: `
    <!-- Navigation -->
    <nav class="fixed w-full z-50 glass-morphism" dir="rtl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <!-- Logo SVG - بزرگتر شده -->
              <svg width="220" height="60" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" class="ml-2">
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
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <rect x="20" y="30" width="60" height="40" rx="8" fill="url(#toolboxGradient)" filter="url(#glow)"/>
                <rect x="40" y="22" width="20" height="12" rx="6" fill="url(#toolboxGradient)"/>
                <rect x="25" y="38" width="3" height="24" rx="1.5" fill="url(#toolGradient)"/>
                <rect x="32" y="35" width="3" height="27" rx="1.5" fill="url(#toolGradient)"/>
                <rect x="39" y="40" width="3" height="22" rx="1.5" fill="url(#toolGradient)"/>
                <rect x="46" y="36" width="3" height="26" rx="1.5" fill="url(#toolGradient)"/>
                <rect x="53" y="42" width="3" height="20" rx="1.5" fill="url(#toolGradient)"/>
                <rect x="60" y="37" width="3" height="25" rx="1.5" fill="url(#toolGradient)"/>
                <rect x="67" y="41" width="3" height="21" rx="1.5" fill="url(#toolGradient)"/>
                <path d="M 90 35 L 115 35 Q 118 35 118 38 L 118 65 Q 118 70 115 70 L 90 70 Q 87 70 87 65 L 87 38 Q 87 35 90 35 Z" fill="url(#bagGradient)" filter="url(#glow)"/>
                <path d="M 95 35 Q 95 27 102.5 27 Q 110 27 110 35" stroke="url(#bagGradient)" stroke-width="3" fill="none"/>
                <text x="150" y="45" font-family="Vazirmatn" font-size="24" font-weight="800" fill="#1f2937">فروشگاه‌ساز</text>
                <text x="150" y="70" font-family="Vazirmatn" font-size="18" font-weight="600" fill="#6366f1">جعبه‌ابزار</text>
              </svg>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="mr-10 flex items-baseline space-x-6 space-x-reverse">
              <a href="#features" class="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition-colors">ویژگی‌ها</a>
              <a href="#demo" class="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition-colors">نمایش</a>
              <a href="#pricing" class="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition-colors">تعرفه</a>
              <a href="#request" class="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition-colors">درخواست</a>
              <button class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full text-lg font-medium transition-all transform hover:scale-105 shadow-lg">
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
          <h1 class="text-6xl md:text-8xl font-black text-white mb-8 leading-tight">
            بسازید، بفروشید، <br>
            <span class="typing-text text-yellow-300 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">موفق شوید</span>
          </h1>
          <p class="text-2xl md:text-3xl text-white mb-12 opacity-95 max-w-4xl mx-auto leading-relaxed font-medium">
            با <strong>فروشگاه‌ساز جعبه‌ابزار</strong> امپراطوری فروش آنلاین خود را بسازید
          </p>
          
          <!-- Key Benefits -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 hover:bg-opacity-30 transition-all">
              <div class="text-4xl mb-3">🚀</div>
              <h3 class="text-xl font-bold text-white mb-2">راه‌اندازی سریع</h3>
              <p class="text-white opacity-90">فقط ۵ دقیقه تا اولین فروش</p>
            </div>
            <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 hover:bg-opacity-30 transition-all">
              <div class="text-4xl mb-3">🏆</div>
              <h3 class="text-xl font-bold text-white mb-2">بدون محدودیت</h3>
              <p class="text-white opacity-90">هر نوع کسب‌وکاری را شروع کنید</p>
            </div>
            <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 hover:bg-opacity-30 transition-all">
              <div class="text-4xl mb-3">💰</div>
              <h3 class="text-xl font-bold text-white mb-2">درآمد تضمینی</h3>
              <p class="text-white opacity-90">از همین امروز شروع به کسب درآمد کنید</p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button class="bg-white text-blue-600 px-12 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-110 shadow-2xl border-4 border-white">
              🎯 همین حالا شروع کنید
            </button>
            <button class="border-4 border-white text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-110 backdrop-blur-sm">
              📹 ویدیو معرفی
            </button>
          </div>
          
          <!-- Trust Indicators -->
          <div class="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-80">
            <div class="text-white text-center">
              <div class="text-3xl font-bold">۲,۵۰۰+</div>
              <div class="text-sm">فروشگاه فعال</div>
            </div>
            <div class="text-white text-center">
              <div class="text-3xl font-bold">۱۵۰+</div>
              <div class="text-sm">میلیارد تومان فروش</div>
            </div>
            <div class="text-white text-center">
              <div class="text-3xl font-bold">۹۸%</div>
              <div class="text-sm">رضایت مشتریان</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Enhanced Floating Elements -->
      <div class="absolute top-20 right-10 animate-float">
        <div class="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
          <span class="text-3xl">💎</span>
        </div>
      </div>
      <div class="absolute top-40 left-20 animate-float" style="animation-delay: -2s">
        <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
          <span class="text-2xl">🛍️</span>
        </div>
      </div>
      <div class="absolute bottom-20 right-20 animate-float" style="animation-delay: -4s">
        <div class="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
          <span class="text-3xl">🚀</span>
        </div>
      </div>
    </section>

    <!-- Request Form Section - Enhanced -->
    <section id="request" class="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" dir="rtl">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-5xl md:text-6xl font-black text-white mb-8">
            همین الان <span class="text-yellow-400">شروع کنید!</span>
          </h2>
          <p class="text-2xl text-white opacity-90 max-w-2xl mx-auto leading-relaxed">
            فقط ۳ مرحله ساده تا اولین فروش شما
          </p>
        </div>

        <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
          <!-- Background decoration -->
          <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div class="relative z-10">
            <div class="text-center mb-8">
              <h3 class="text-3xl font-bold text-gray-900 mb-4">فرم درخواست فروشگاه</h3>
              <p class="text-gray-600">اطلاعات زیر را پر کنید تا در کمتر از ۲۴ ساعت فروشگاه شما آماده شود</p>
            </div>
            
            <form class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="relative">
                  <label class="block text-lg font-bold text-gray-700 mb-3">نام فروشگاه شما</label>
                  <input type="text" class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" placeholder="مثال: فروشگاه پوشاک آریا">
                  <div class="absolute top-2 left-4">
                    <span class="text-2xl">🏪</span>
                  </div>
                </div>
                <div class="relative">
                  <label class="block text-lg font-bold text-gray-700 mb-3">شماره تماس</label>
                  <input type="tel" class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" placeholder="09123456789">
                  <div class="absolute top-2 left-4">
                    <span class="text-2xl">📱</span>
                  </div>
                </div>
              </div>
              
              <div class="relative">
                <label class="block text-lg font-bold text-gray-700 mb-3">نوع محصولات شما</label>
                <textarea rows="5" class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" placeholder="مثال: پوشاک زنانه و مردانه، کیف و کفش، لوازم جانبی، زیورآلات...

نکته: هر چه دقیق‌تر توضیح دهید، فروشگاه بهتری برایتان طراحی می‌کنیم!"></textarea>
                <div class="absolute top-2 left-4">
                  <span class="text-2xl">📦</span>
                </div>
              </div>
              
              <!-- Benefits reminder -->
              <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border-2 border-green-200">
                <div class="flex items-start space-x-4 space-x-reverse">
                  <div class="text-3xl">🎁</div>
                  <div>
                    <h4 class="text-xl font-bold text-gray-900 mb-2">هدیه ویژه برای شما:</h4>
                    <ul class="text-gray-700 space-y-1">
                      <li>✅ راه‌اندازی رایگان</li>
                      <li>✅ آموزش کامل</li>
                      <li>✅ پشتیبانی ۳۰ روزه</li>
                      <li>✅ طراحی اختصاصی</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="text-center">
                <button type="submit" class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-16 py-5 rounded-full text-xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl">
                  🚀 درخواست فروشگاه (رایگان)
                </button>
                <p class="text-gray-500 mt-4">⏰ پاسخ در کمتر از ۲۴ ساعت</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-gray-900" dir="rtl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h3 class="text-4xl font-bold text-white mb-4">اعداد و ارقام</h3>
          <p class="text-xl text-gray-400">آمارهای واقعی عملکرد ما</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="animate-fade-in-up">
            <div class="text-5xl md:text-6xl font-black text-white mb-2" #storesCount>0</div>
            <div class="text-gray-400 text-lg">فروشگاه فعال</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="text-5xl md:text-6xl font-black text-white mb-2" #revenueCount>0</div>
            <div class="text-gray-400 text-lg">میلیارد تومان فروش</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.4s">
            <div class="text-5xl md:text-6xl font-black text-white mb-2" #ordersCount>0</div>
            <div class="text-gray-400 text-lg">سفارش پردازش شده</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.6s">
            <div class="text-5xl md:text-6xl font-black text-white mb-2" #categoriesCount>0</div>
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
    
    /* Persian font styles */
    * {
      font-family: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif !important;
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