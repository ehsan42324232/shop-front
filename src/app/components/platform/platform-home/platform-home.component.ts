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
              <!-- Logo SVG -->
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
            پلتفرم فروشگاهی <br>
            <span class="typing-text text-yellow-300 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">حرفه‌ای</span>
          </h1>
          <p class="text-2xl md:text-3xl text-white mb-12 opacity-95 max-w-4xl mx-auto leading-relaxed font-medium">
            توسعه یافته توسط <strong>فارغ‌التحصیلان شریف</strong> - کیفیت جهانی، قیمت ایرانی
          </p>
          
          <!-- Key Benefits -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 hover:bg-opacity-30 transition-all">
              <div class="text-4xl mb-3">📸</div>
              <h3 class="text-xl font-bold text-white mb-2">اتصال به اینستاگرام</h3>
              <p class="text-white opacity-90">خواندن مستقیم عکس و فیلم از پست و استوری</p>
            </div>
            <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 hover:bg-opacity-30 transition-all">
              <div class="text-4xl mb-3">💰</div>
              <h3 class="text-xl font-bold text-white mb-2">تنها ۱۵۰ هزار تومان</h3>
              <p class="text-white opacity-90">ماهانه - بدون محدودیت</p>
            </div>
            <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 hover:bg-opacity-30 transition-all">
              <div class="text-4xl mb-3">🌐</div>
              <h3 class="text-xl font-bold text-white mb-2">آدرس اختصاصی</h3>
              <p class="text-white opacity-90">بدون نیاز به خرید دامنه</p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button class="bg-white text-blue-600 px-12 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-110 shadow-2xl border-4 border-white">
              🎯 همین حالا شروع کنید
            </button>
          </div>
        </div>
      </div>
      
      <!-- Floating Elements -->
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

    <!-- Features Section -->
    <section id="features" class="py-24 bg-white" dir="rtl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-5xl md:text-6xl font-black text-gray-900 mb-8">
            قابلیت‌های <span class="text-blue-600">منحصر به فرد</span>
          </h2>
          <p class="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            همه چیزی که برای راه‌اندازی فروشگاه آنلاین حرفه‌ای نیاز دارید
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <!-- Instagram Integration -->
          <div class="feature-card bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-3xl border-2 border-pink-200 hover:border-pink-400 transition-all transform hover:scale-105">
            <div class="text-5xl mb-4">📸</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">اتصال مستقیم به اینستاگرام</h3>
            <p class="text-gray-700 text-lg leading-relaxed">امکان خواندن عکس و فیلم به طور مستقیم از پست و استوری اینستاگرام شما</p>
          </div>

          <!-- Categorization -->
          <div class="feature-card bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border-2 border-blue-200 hover:border-blue-400 transition-all transform hover:scale-105">
            <div class="text-5xl mb-4">🏷️</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">دسته‌بندی متنوع</h3>
            <p class="text-gray-700 text-lg leading-relaxed">امکان تعریف دسته‌بندی متنوع و محصولات با ویژگی‌های دلخواه شما</p>
          </div>

          <!-- Video Upload -->
          <div class="feature-card bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border-2 border-green-200 hover:border-green-400 transition-all transform hover:scale-105">
            <div class="text-5xl mb-4">🎬</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">آپلود فیلم محصولات</h3>
            <p class="text-gray-700 text-lg leading-relaxed">ظاهر متنوع و قابل انتخاب توسط شما برای نمایش بهتر محصولات</p>
          </div>

          <!-- Advanced Features -->
          <div class="feature-card bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-3xl border-2 border-yellow-200 hover:border-yellow-400 transition-all transform hover:scale-105">
            <div class="text-5xl mb-4">⚡</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">امکانات پیشرفته سایت</h3>
            <p class="text-gray-700 text-lg leading-relaxed">سئو، جستجوی پیشرفته، پیشنهاددهی محصولات و بهینه‌سازی کامل</p>
          </div>

          <!-- Reviews -->
          <div class="feature-card bg-gradient-to-br from-red-50 to-rose-50 p-8 rounded-3xl border-2 border-red-200 hover:border-red-400 transition-all transform hover:scale-105">
            <div class="text-5xl mb-4">⭐</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">نظرات و امتیازات</h3>
            <p class="text-gray-700 text-lg leading-relaxed">نظرات و امتیازات به محصولات و فروشگاه‌ها برای افزایش اعتماد مشتریان</p>
          </div>

          <!-- Shopping Cart -->
          <div class="feature-card bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-3xl border-2 border-cyan-200 hover:border-cyan-400 transition-all transform hover:scale-105">
            <div class="text-5xl mb-4">🛒</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">سبد خرید و پرداخت</h3>
            <p class="text-gray-700 text-lg leading-relaxed">سبد خرید و اتصال به درگاه پرداخت و سامانه‌های ارسال کالا</p>
          </div>

          <!-- Promotions -->
          <div class="feature-card bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-3xl border-2 border-purple-200 hover:border-purple-400 transition-all transform hover:scale-105">
            <div class="text-5xl mb-4">🎯</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">سیستم پروموشن</h3>
            <p class="text-gray-700 text-lg leading-relaxed">امکان تعریف پروموشن (تخفیف، کمپین جذب مشتری، ...)</p>
          </div>

          <!-- Analytics -->
          <div class="feature-card bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-3xl border-2 border-gray-200 hover:border-gray-400 transition-all transform hover:scale-105">
            <div class="text-5xl mb-4">📊</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">گزارشات تحلیلی</h3>
            <p class="text-gray-700 text-lg leading-relaxed">مشاهده گزارشات تحلیلی کامل از عملکرد فروشگاه و رفتار مشتریان</p>
          </div>

          <!-- Product Management -->
          <div class="feature-card bg-gradient-to-br from-teal-50 to-green-50 p-8 rounded-3xl border-2 border-teal-200 hover:border-teal-400 transition-all transform hover:scale-105">
            <div class="text-5xl mb-4">📋</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">مدیریت محصولات</h3>
            <p class="text-gray-700 text-lg leading-relaxed">تعریف محصولات به صورت دستی یا با فایل اکسل</p>
          </div>

          <!-- Custom Domain -->
          <div class="feature-card bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-3xl border-2 border-indigo-200 hover:border-indigo-400 transition-all transform hover:scale-105">
            <div class="text-5xl mb-4">🌐</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">آدرس اختصاصی</h3>
            <p class="text-gray-700 text-lg leading-relaxed">آدرس سایت به دلخواه شما بدون دامنه و کلمه اضافی، بدون نیاز به تهیه دامنه</p>
          </div>

          <!-- University Development -->
          <div class="feature-card bg-gradient-to-br from-amber-50 to-yellow-50 p-8 rounded-3xl border-2 border-amber-200 hover:border-amber-400 transition-all transform hover:scale-105">
            <div class="text-5xl mb-4">🎓</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">توسعه یافته توسط فارغ‌التحصیلان شریف</h3>
            <p class="text-gray-700 text-lg leading-relaxed">کسب و کار و پلتفرم توسعه داده شده با کیفیت جهانی</p>
          </div>
        </div>

        <!-- Technology Stack -->
        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">تکنولوژی‌های پیشرفته</h3>
          <div class="flex flex-wrap justify-center gap-4">
            <span class="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">Angular</span>
            <span class="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">Django REST</span>
            <span class="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-medium">PostgreSQL</span>
            <span class="bg-red-100 text-red-800 px-4 py-2 rounded-full font-medium">Redis</span>
            <span class="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium">Tailwind CSS</span>
            <span class="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-medium">Docker</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" dir="rtl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-5xl md:text-6xl font-black text-white mb-8">
          قیمت <span class="text-yellow-400">استثنایی</span>
        </h2>
        
        <div class="max-w-4xl mx-auto">
          <div class="bg-white rounded-3xl shadow-2xl p-12 mb-12 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <div class="text-center mb-8">
              <div class="text-7xl font-black text-gray-900 mb-4">
                ۱۵۰,۰۰۰ <span class="text-3xl text-gray-600">تومان</span>
              </div>
              <div class="text-2xl text-gray-600 mb-6">ماهانه برای تمام قابلیت‌ها - بدون محدودیت</div>
              <div class="text-xl text-green-600 font-bold">🔥 به مراتب پایین‌تر از رقبا</div>
            </div>

            <!-- Comparison -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="text-center p-6 bg-red-50 rounded-2xl">
                <h4 class="text-lg font-bold text-gray-900 mb-2">رقبای ایرانی</h4>
                <div class="text-3xl font-bold text-red-600 mb-2">۳۰۰,۰۰۰+</div>
                <div class="text-gray-600">تومان ماهانه</div>
                <div class="text-sm text-red-600 mt-2">با محدودیت‌های فراوان</div>
              </div>
              
              <div class="text-center p-6 bg-blue-50 rounded-2xl border-4 border-blue-500">
                <h4 class="text-lg font-bold text-blue-600 mb-2">ما - فروشگاه‌ساز</h4>
                <div class="text-3xl font-bold text-blue-600 mb-2">۱۵۰,۰۰۰</div>
                <div class="text-gray-600">تومان ماهانه</div>
                <div class="text-sm text-green-600 font-bold mt-2">✅ بهترین انتخاب</div>
              </div>
              
              <div class="text-center p-6 bg-gray-50 rounded-2xl">
                <h4 class="text-lg font-bold text-gray-900 mb-2">شاپیفای (جهانی)</h4>
                <div class="text-3xl font-bold text-gray-600 mb-2">$29+</div>
                <div class="text-gray-600">ماهانه (۱,۲۰۰,۰۰۰+ تومان)</div>
                <div class="text-sm text-gray-600 mt-2">بدون پشتیبانی فارسی</div>
              </div>
            </div>

            <div class="text-center">
              <p class="text-xl text-gray-700 mb-6">
                <strong>کیفیت بیشتر از رقبای ایرانی و در حد رقبای جهانی نظیر شاپیفای</strong>
              </p>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-8">
                <div class="flex items-center justify-center">
                  <span class="text-green-500 ml-2">✅</span>
                  اتصال اینستاگرام
                </div>
                <div class="flex items-center justify-center">
                  <span class="text-green-500 ml-2">✅</span>
                  آپلود ویدیو
                </div>
                <div class="flex items-center justify-center">
                  <span class="text-green-500 ml-2">✅</span>
                  آدرس اختصاصی
                </div>
                <div class="flex items-center justify-center">
                  <span class="text-green-500 ml-2">✅</span>
                  سئو پیشرفته
                </div>
                <div class="flex items-center justify-center">
                  <span class="text-green-500 ml-2">✅</span>
                  گزارشات تحلیلی
                </div>
                <div class="flex items-center justify-center">
                  <span class="text-green-500 ml-2">✅</span>
                  درگاه پرداخت
                </div>
                <div class="flex items-center justify-center">
                  <span class="text-green-500 ml-2">✅</span>
                  پشتیبانی ۲۴/۷
                </div>
                <div class="flex items-center justify-center">
                  <span class="text-green-500 ml-2">✅</span>
                  بدون محدودیت
                </div>
              </div>
              
              <button class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-16 py-5 rounded-full text-2xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl">
                🚀 شروع همین حالا
              </button>
            </div>
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