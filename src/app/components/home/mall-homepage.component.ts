import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-mall-homepage',
  template: `
    <div class="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50" dir="rtl">
      
      <!-- Header Navigation -->
      <header class="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <div class="flex items-center space-x-3 space-x-reverse">
              <div class="w-10 h-10 bg-gradient-to-br from-red-500 via-blue-500 to-white rounded-xl flex items-center justify-center">
                <span class="text-white font-bold text-lg">🛍️</span>
              </div>
              <div>
                <h1 class="text-xl font-bold bg-gradient-to-r from-red-600 via-blue-600 to-white bg-clip-text text-transparent">
                  مال | Mall
                </h1>
                <p class="text-xs text-gray-500">فروشگاه‌ساز ایرانی</p>
              </div>
            </div>
            
            <!-- Navigation Menu -->
            <nav class="hidden md:flex items-center space-x-6 space-x-reverse">
              <a href="#features" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">ویژگی‌ها</a>
              <a href="#pricing" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">قیمت‌گذاری</a>
              <a href="#contact" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">تماس با ما</a>
              <a href="#about" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">درباره ما</a>
            </nav>
            
            <!-- CTA Buttons -->
            <div class="flex items-center space-x-3 space-x-reverse">
              <button 
                (click)="openLoginModal()"
                class="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors font-medium">
                ورود مدیران فروشگاه
              </button>
              <button 
                (click)="showRequestForm = true"
                class="px-6 py-2 bg-gradient-to-r from-red-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-medium">
                شروع رایگان
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="relative pt-24 pb-16 overflow-hidden">
        <div class="container mx-auto px-4 relative">
          <div class="max-w-6xl mx-auto">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              
              <!-- Content -->
              <div class="text-center lg:text-right space-y-8">
                <div>
                  <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    <span class="block text-gray-800 mb-2">فروشگاه آنلاین</span>
                    <span class="bg-gradient-to-r from-red-600 via-blue-600 to-red-600 bg-clip-text text-transparent">
                      خودت رو بساز!
                    </span>
                  </h1>
                  <p class="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed mt-6">
                    با پلتفرم <strong>مال</strong>، فروشگاه آنلاین حرفه‌ای خودت رو بدون نیاز به دانش فنی و در کمترین زمان راه‌اندازی کن.
                    <br>
                    <span class="text-lg text-blue-600 font-medium">۱۰۰% فارسی • پشتیبانی ۲۴ ساعته • پرداخت امن</span>
                  </p>
                </div>
                
                <!-- Primary CTAs -->
                <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button 
                    (click)="showRequestForm = true"
                    class="group px-8 py-4 bg-gradient-to-r from-red-500 to-blue-500 text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-lg">
                    <span class="flex items-center justify-center">
                      🚀 همین الان شروع کن
                    </span>
                  </button>
                  
                  <button 
                    (click)="playDemoVideo()"
                    class="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:border-blue-400 hover:text-blue-600 transition-all duration-300 bg-white/80 backdrop-blur-sm text-lg">
                    <span class="flex items-center justify-center">
                      ▶️ نمایش ویدیو معرفی
                    </span>
                  </button>
                </div>
              </div>
              
              <!-- Hero Image/Animation -->
              <div class="relative">
                <div class="relative bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-2xl">
                  <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl relative overflow-hidden">
                    <!-- Mock Store Interface -->
                    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-red-500/10">
                      <div class="p-4 h-full flex flex-col">
                        <div class="bg-white rounded-lg p-3 mb-4 shadow-sm">
                          <div class="h-3 bg-gradient-to-r from-red-400 to-blue-400 rounded mb-2"></div>
                          <div class="h-2 bg-gray-300 rounded w-3/4"></div>
                        </div>
                        <div class="grid grid-cols-3 gap-2 flex-1">
                          <div class="bg-white rounded-lg p-2 shadow-sm" *ngFor="let item of [1,2,3,4,5,6]">
                            <div class="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-1"></div>
                            <div class="h-1 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-20">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              چرا <span class="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">مال</span>؟
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              با ویژگی‌های قدرتمند و منحصر به فرد مال، فروشگاه آنلاین خودت رو به بهترین شکل ممکن راه‌اندازی کن
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="group p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2" 
                 *ngFor="let feature of features">
              <div class="w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                   [ngClass]="feature.gradient">
                <span class="text-2xl">{{feature.icon}}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">{{feature.title}}</h3>
              <p class="text-gray-600 leading-relaxed">{{feature.description}}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Request Form Modal -->
      <div *ngIf="showRequestForm" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="showRequestForm = false">
        <div class="bg-white rounded-2xl p-8 max-w-md w-full" (click)="$event.stopPropagation()">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">🚀 درخواست راه‌اندازی</h3>
            <p class="text-gray-600">اطلاعات تماس خودت رو وارد کن تا باهات تماس بگیریم</p>
          </div>
          <form (ngSubmit)="submitRequest()">
            <div class="space-y-4">
              <input type="text" placeholder="نام و نام خانوادگی" 
                     class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" dir="rtl">
              <input type="tel" placeholder="شماره موبایل" 
                     class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" dir="rtl">
              <input type="email" placeholder="ایمیل (اختیاری)" 
                     class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" dir="rtl">
              <textarea placeholder="نوع کسبوکار و توضیحات (اختیاری)" rows="3"
                        class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" dir="rtl"></textarea>
            </div>
            <div class="flex gap-3 mt-6">
              <button type="submit" 
                      class="flex-1 py-3 bg-gradient-to-r from-red-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                ارسال درخواست
              </button>
              <button type="button" (click)="showRequestForm = false"
                      class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Login Modal -->
      <div *ngIf="showLoginModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="showLoginModal = false">
        <div class="bg-white rounded-2xl p-8 max-w-md w-full" (click)="$event.stopPropagation()">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">🔐 ورود مدیران فروشگاه</h3>
            <p class="text-gray-600">شماره موبایل خودت رو وارد کن</p>
          </div>
          <form (ngSubmit)="submitLogin()">
            <div class="space-y-4">
              <input type="tel" placeholder="شماره موبایل" 
                     [(ngModel)]="phoneNumber" name="phone"
                     class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" dir="rtl">
              <div *ngIf="otpSent" class="space-y-4">
                <input type="text" placeholder="کد یکبار مصرف" 
                       [(ngModel)]="otpCode" name="otp"
                       class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center" maxlength="6">
                <p class="text-sm text-gray-500 text-center">کد ۶ رقمی ارسال شده به {{phoneNumber}} را وارد کنید</p>
              </div>
            </div>
            <div class="flex gap-3 mt-6">
              <button type="submit" 
                      class="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                {{otpSent ? 'تایید کد' : 'ارسال کد'}}
              </button>
              <button type="button" (click)="showLoginModal = false"
                      class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(-100px)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class MallHomepageComponent implements OnInit {
  showRequestForm = false;
  showLoginModal = false;
  phoneNumber = '';
  otpCode = '';
  otpSent = false;

  features = [
    {
      icon: '🏪',
      title: 'ساخت فروشگاه آسان',
      description: 'فروشگاه آنلاین خودت رو در کمتر از ۱۰ دقیقه بساز و راه‌اندازی کن',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: '📱',
      title: 'یکپارچگی شبکه‌های اجتماعی',
      description: 'محتوای اینستاگرام و تلگرام رو مستقیماً به فروشگاهت اضافه کن',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: '💳',
      title: 'پرداخت امن ایرانی',
      description: 'درگاه‌های پرداخت معتبر ایرانی رو یکپارچه کن',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: '📊',
      title: 'مدیریت پیشرفته',
      description: 'محصولات، سفارشات و مشتریان رو به راحتی مدیریت کن',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      icon: '🚚',
      title: 'پیک و ارسال',
      description: 'با شرکت‌های حمل و نقل معتبر ایرانی یکپارچه شو',
      gradient: 'from-red-500 to-red-600'
    },
    {
      icon: '📞',
      title: 'پشتیبانی ۲۴/۷',
      description: 'پشتیبانی فارسی ۲۴ ساعته برای راهنمایی و حل مشکلات',
      gradient: 'from-indigo-500 to-indigo-600'
    }
  ];

  constructor(public router: Router) {}

  ngOnInit(): void {}

  openLoginModal(): void {
    this.showLoginModal = true;
    this.otpSent = false;
    this.phoneNumber = '';
    this.otpCode = '';
  }

  submitLogin(): void {
    if (!this.otpSent) {
      // Send OTP
      this.otpSent = true;
      console.log('OTP sent to:', this.phoneNumber);
    } else {
      // Verify OTP and login
      console.log('Verifying OTP:', this.otpCode);
      this.showLoginModal = false;
      // Redirect to store management dashboard
      this.router.navigate(['/store-management']);
    }
  }

  submitRequest(): void {
    console.log('Request submitted');
    this.showRequestForm = false;
    // Here you would typically send the form data to your backend
  }

  playDemoVideo(): void {
    console.log('Playing demo video');
    // Implement video modal or redirect to video page
  }

  toggleChat(): void {
    console.log('Toggle chat');
    // Implement chat functionality
  }
}
