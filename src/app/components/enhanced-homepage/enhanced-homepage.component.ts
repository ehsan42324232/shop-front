import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface Testimonial {
  name: string;
  business: string;
  image: string;
  review: string;
  rating: number;
}

interface Statistic {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-enhanced-homepage',
  templateUrl: './enhanced-homepage.component.html',
  styleUrls: ['./enhanced-homepage.component.css']
})
export class EnhancedHomepageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroVideo', { static: false }) heroVideo!: ElementRef<HTMLVideoElement>;
  
  private destroy$ = new Subject<void>();
  
  // Forms
  storeRequestForm!: FormGroup;
  contactForm!: FormGroup;
  
  // UI State
  currentSlide = 0;
  isContactModalOpen = false;
  isStoreRequestModalOpen = false;
  isMenuOpen = false;
  isLoading = false;
  
  // Content Data
  features: FeatureCard[] = [
    {
      icon: 'fas fa-store',
      title: 'فروشگاه آنلاین حرفه‌ای',
      description: 'بدون نیاز به دانش فنی، فروشگاه خود را در کمتر از ۱۰ دقیقه راه‌اندازی کنید',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'طراحی ریسپانسیو',
      description: 'فروشگاه شما در تمام دستگاه‌ها به صورت بهینه نمایش داده می‌شود',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'آنالیز و گزارش‌گیری',
      description: 'با داشبورد پیشرفته، عملکرد فروشگاه خود را به صورت زنده پیگیری کنید',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: 'fas fa-credit-card',
      title: 'درگاه پرداخت ایرانی',
      description: 'اتصال به تمام درگاه‌های پرداخت معتبر ایران با امنیت بالا',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: 'fas fa-truck',
      title: 'مدیریت حمل و نقل',
      description: 'اتصال به شرکت‌های پست و باربری برای ارسال سریع محصولات',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: 'fas fa-headset',
      title: 'پشتیبانی ۲۴/۷',
      description: 'تیم پشتیبانی ما همیشه آماده کمک به شما هستند',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  testimonials: Testimonial[] = [
    {
      name: 'احمد محمدی',
      business: 'فروشگاه پوشاک آنلاین',
      image: '/assets/images/testimonial1.jpg',
      review: 'با استفاده از مال، فروش ماهانه‌ام ۳ برابر شده است. واقعاً پلتفرم فوق‌العاده‌ای است.',
      rating: 5
    },
    {
      name: 'زهرا احمدی',
      business: 'فروشگاه لوازم خانگی',
      image: '/assets/images/testimonial2.jpg',
      review: 'راه‌اندازی فروشگاه خیلی ساده بود و پشتیبانی عالی دارند. به همه توصیه می‌کنم.',
      rating: 5
    },
    {
      name: 'علی رضایی',
      business: 'فروشگاه کتاب آنلاین',
      image: '/assets/images/testimonial3.jpg',
      review: 'امکانات مدیریتی و گزارش‌گیری مال بی‌نظیر است. کسب‌وکارم را متحول کرده.',
      rating: 4
    }
  ];

  statistics: Statistic[] = [
    { value: '۱۲,۰۰۰+', label: 'فروشگاه فعال', icon: 'fas fa-store' },
    { value: '۵۰۰,۰۰۰+', label: 'تراکنش موفق', icon: 'fas fa-credit-card' },
    { value: '۹۸%', label: 'رضایت مشتریان', icon: 'fas fa-heart' },
    { value: '۲۴/۷', label: 'پشتیبانی', icon: 'fas fa-headset' }
  ];

  heroSlides = [
    {
      title: 'فروشگاه‌ساز مال',
      subtitle: 'قدرتمندترین پلتفرم ایجاد فروشگاه آنلاین در ایران',
      description: 'بدون نیاز به دانش فنی، فروشگاه حرفه‌ای خود را در کمتر از ۱۰ دقیقه راه‌اندازی کنید',
      buttonText: 'شروع رایگان',
      image: '/assets/images/hero-slide1.jpg'
    },
    {
      title: 'فروش بیشتر، سود بیشتر',
      subtitle: 'با ابزارهای پیشرفته مارکتینگ',
      description: 'کمپین‌های تبلیغاتی هوشمند، کوپن تخفیف، و سیستم وفاداری مشتریان',
      buttonText: 'مشاهده امکانات',
      image: '/assets/images/hero-slide2.jpg'
    },
    {
      title: 'مدیریت آسان، نتایج عالی',
      subtitle: 'داشبورد پیشرفته و گزارش‌گیری زنده',
      description: 'تمام آمار فروش، رفتار مشتریان و عملکرد محصولات را در یک نگاه ببینید',
      buttonText: 'نمایش دموی زنده',
      image: '/assets/images/hero-slide3.jpg'
    }
  ];

  pricingPlans = [
    {
      name: 'پایه',
      price: 'رایگان',
      period: '',
      features: [
        'تا ۱۰ محصول',
        'پشتیبانی ایمیل',
        'قالب‌های پایه',
        'فضای ۱ گیگابایت'
      ],
      popular: false,
      buttonText: 'شروع رایگان'
    },
    {
      name: 'حرفه‌ای',
      price: '۲۹۹,۰۰۰',
      period: 'ماهانه',
      features: [
        'محصولات نامحدود',
        'پشتیبانی تلفنی',
        'تمام قالب‌ها',
        'فضای ۱۰ گیگابایت',
        'گزارش‌گیری پیشرفته',
        'کوپن تخفیف'
      ],
      popular: true,
      buttonText: 'انتخاب پلن'
    },
    {
      name: 'سازمانی',
      price: '۷۹۹,۰۰۰',
      period: 'ماهانه',
      features: [
        'تمام امکانات حرفه‌ای',
        'پشتیبانی اختصاصی',
        'طراحی سفارشی',
        'فضای نامحدود',
        'API اختصاصی',
        'ادغام سیستم‌ها'
      ],
      popular: false,
      buttonText: 'تماس با فروش'
    }
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.startHeroSlider();
    this.animateStatistics();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    this.setupSmoothScrolling();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    this.storeRequestForm = this.formBuilder.group({
      businessName: ['', [Validators.required, Validators.minLength(2)]],
      ownerName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
      email: ['', [Validators.email]],
      businessType: ['', Validators.required],
      description: ['']
    });

    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  private startHeroSlider(): void {
    interval(5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.nextSlide();
      });
  }

  private animateStatistics(): void {
    // Animation logic for counting up statistics
    setTimeout(() => {
      this.statistics.forEach((stat, index) => {
        this.animateNumber(stat, index);
      });
    }, 1000);
  }

  private animateNumber(stat: Statistic, index: number): void {
    const numericValue = parseInt(stat.value.replace(/[^\d]/g, ''));
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        current = numericValue;
        clearInterval(timer);
      }
      
      // Update the display value while preserving original format
      const formatted = stat.value.includes('٪') ? 
        Math.round(current) + '٪' : 
        Math.round(current).toLocaleString('fa-IR') + (stat.value.includes('+') ? '+' : '');
      
      document.querySelector(`[data-stat="${index}"]`)!.textContent = formatted;
    }, duration / steps);
  }

  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  private setupSmoothScrolling(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href')!);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // Navigation methods
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? 
      this.heroSlides.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  // Modal methods
  openStoreRequestModal(): void {
    this.isStoreRequestModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeStoreRequestModal(): void {
    this.isStoreRequestModalOpen = false;
    document.body.style.overflow = 'auto';
    this.storeRequestForm.reset();
  }

  openContactModal(): void {
    this.isContactModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeContactModal(): void {
    this.isContactModalOpen = false;
    document.body.style.overflow = 'auto';
    this.contactForm.reset();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Form submission methods
  onStoreRequestSubmit(): void {
    if (this.storeRequestForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.closeStoreRequestModal();
        this.showSuccessMessage('درخواست شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.');
      }, 2000);
    } else {
      this.markFormGroupTouched(this.storeRequestForm);
    }
  }

  onContactSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.closeContactModal();
        this.showSuccessMessage('پیام شما با موفقیت ارسال شد. به زودی پاسخ خواهیم داد.');
      }, 2000);
    } else {
      this.markFormGroupTouched(this.contactForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccessMessage(message: string): void {
    // Implementation for showing success toast/notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(400px)';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 4000);
  }

  // Navigation methods
  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  // Utility methods
  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  getFormFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'این فیلد الزامی است';
      if (field.errors['email']) return 'ایمیل معتبر وارد کنید';
      if (field.errors['pattern']) return 'فرمت وارد شده صحیح نیست';
      if (field.errors['minlength']) return `حداقل ${field.errors['minlength'].requiredLength} کاراکتر وارد کنید`;
    }
    return '';
  }

  onVideoError(): void {
    // Fallback for video loading error
    console.warn('Hero video failed to load');
  }

  playHeroVideo(): void {
    if (this.heroVideo?.nativeElement) {
      this.heroVideo.nativeElement.play().catch(() => {
        console.warn('Auto-play blocked by browser');
      });
    }
  }
}