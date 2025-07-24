// src/app/components/mall-homepage.component.ts
/**
 * Mall Platform - Professional Homepage Component
 * Long, fancy, and modern homepage with Persian design
 */
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-mall-homepage',
  template: `
    <div class="homepage-container rtl-layout" dir="rtl">
      
      <!-- Hero Section -->
      <section class="hero-section" [@fadeInUp]>
        <div class="hero-background">
          <div class="hero-overlay"></div>
          <video autoplay muted loop class="hero-video">
            <source src="/assets/videos/mall-hero.mp4" type="video/mp4">
          </video>
        </div>
        
        <div class="hero-content">
          <div class="container">
            <div class="hero-text">
              <h1 class="hero-title">
                <span class="gradient-text">مال</span>
                <br>
                فروشگاه‌ساز حرفه‌ای شما
              </h1>
              <p class="hero-subtitle">
                با بستر مال، فروشگاه آنلاین خود را در کمترین زمان راه‌اندازی کنید
                <br>
                تمام امکانات مورد نیاز برای کسب‌وکار آنلاین شما
              </p>
              
              <div class="hero-buttons">
                <button class="btn btn-primary btn-lg cta-button" [@pulse]>
                  <i class="fas fa-rocket"></i>
                  شروع رایگان
                </button>
                <button class="btn btn-outline-light btn-lg">
                  <i class="fas fa-play-circle"></i>
                  مشاهده دمو
                </button>
              </div>
              
              <div class="hero-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ animatedStats.stores }}</span>
                  <span class="stat-label">فروشگاه فعال</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ animatedStats.users }}</span>
                  <span class="stat-label">کاربر راضی</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ animatedStats.sales }}</span>
                  <span class="stat-label">فروش موفق</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <h2 class="section-title">امکانات ویژه مال</h2>
          <p class="section-subtitle">همه چیز برای راه‌اندازی فروشگاه حرفه‌ای</p>
          
          <div class="features-grid">
            <div class="feature-card" *ngFor="let feature of features; let i = index" [@slideInUp]="i">
              <div class="feature-icon">
                <i [class]="feature.icon"></i>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section Middle -->
      <section class="cta-section-middle">
        <div class="container">
          <div class="cta-content">
            <h2>آماده‌اید فروشگاه خود را راه‌اندازی کنید؟</h2>
            <p>تنها در ۵ دقیقه فروشگاه آنلاین خود را داشته باشید</p>
            <button class="btn btn-white btn-lg cta-button">
              <i class="fas fa-store"></i>
              ایجاد فروشگاه رایگان
            </button>
          </div>
        </div>
      </section>

    </div>
  `,
  styleUrls: ['./mall-homepage.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('0.5s {{delay}}s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('pulse', [
      state('in', style({ transform: 'scale(1)' })),
      transition('* => *', [
        animate('1s ease-in-out', style({ transform: 'scale(1.05)' })),
        animate('1s ease-in-out', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class MallHomepageComponent implements OnInit {
  
  animatedStats = {
    stores: 0,
    users: 0,
    sales: 0
  };

  features = [
    {
      icon: 'fas fa-shopping-cart',
      title: 'فروشگاه کامل',
      description: 'سیستم فروشگاه با تمام امکانات مورد نیاز'
    },
    {
      icon: 'fas fa-credit-card',
      title: 'پرداخت آنلاین',
      description: 'اتصال به درگاه‌های پرداخت ایرانی'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'موبایل فرندلی',
      description: 'طراحی ریسپانسیو برای همه دستگاه‌ها'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'آمار پیشرفته',
      description: 'گزارش‌های تفصیلی از فروش و مشتریان'
    },
    {
      icon: 'fas fa-sms',
      title: 'پیامک هوشمند',
      description: 'ارسال پیامک تبلیغاتی و اطلاع‌رسانی'
    },
    {
      icon: 'fas fa-comments',
      title: 'پشتیبانی آنلاین',
      description: 'سیستم چت آنلاین با مشتریان'
    }
  ];

  ngOnInit() {
    this.animateStats();
  }

  private animateStats() {
    const targets = { stores: 1250, users: 15000, sales: 8500 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    Object.keys(targets).forEach(key => {
      const target = targets[key as keyof typeof targets];
      const increment = target / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          this.animatedStats[key as keyof typeof this.animatedStats] = target;
          clearInterval(timer);
        } else {
          this.animatedStats[key as keyof typeof this.animatedStats] = Math.floor(current);
        }
      }, stepDuration);
    });
  }
}
