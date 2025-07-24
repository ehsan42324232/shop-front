import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mall-landing',
  templateUrl: './mall-landing.component.html',
  styleUrls: ['./mall-landing.component.css']
})
export class MallLandingComponent implements OnInit {
  contactForm: FormGroup;
  isMenuOpen = false;
  currentSlide = 0;
  showLoginModal = false;
  showContactModal = false;

  slides = [
    {
      title: 'فروشگاه‌ساز مال - پلتفرم جامع تجارت الکترونیک',
      subtitle: 'با مال، فروشگاه آنلاین خود را به راحتی راه‌اندازی کنید',
      image: 'assets/images/slide1.jpg',
      cta: 'شروع کنید'
    },
    {
      title: 'مدیریت محصولات هوشمند',
      subtitle: 'سیستم پیشرفته مدیریت محصولات با ویژگی‌های منحصر به فرد',
      image: 'assets/images/slide2.jpg',
      cta: 'بیشتر بدانید'
    },
    {
      title: 'پشتیبانی 24/7 و چت آنلاین',
      subtitle: 'همیشه در کنار شما هستیم',
      image: 'assets/images/slide3.jpg',
      cta: 'تماس بگیرید'
    }
  ];

  features = [
    {
      icon: 'fas fa-store',
      title: 'ایجاد فروشگاه آسان',
      description: 'در چند دقیقه فروشگاه آنلاین خود را راه‌اندازی کنید',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: 'fas fa-cogs',
      title: 'مدیریت پیشرفته محصولات',
      description: 'سیستم درختی محصولات با ویژگی‌های قابل تنظیم',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: 'fas fa-share-alt',
      title: 'اتصال به شبکه‌های اجتماعی',
      description: 'دریافت محتوا از تلگرام و اینستاگرام',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: 'fas fa-credit-card',
      title: 'درگاه‌های پرداخت ایرانی',
      description: 'اتصال به تمام درگاه‌های پرداخت معتبر ایران',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: 'fas fa-shipping-fast',
      title: 'ارسال هوشمند',
      description: 'اتصال به شرکت‌های پست و باربری',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'آنالیز و گزارش‌گیری',
      description: 'داشبورد جامع فروش و آمار مشتریان',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  testimonials = [
    {
      name: 'علی رضایی',
      business: 'فروشگاه پوشاک آنلاین',
      image: 'assets/images/testimonial1.jpg',
      text: 'با مال فروش ما ۳ برابر شده و مدیریت فروشگاه خیلی راحت‌تر شده'
    },
    {
      name: 'زهرا احمدی',
      business: 'فروشگاه لوازم خانگی',
      image: 'assets/images/testimonial2.jpg',
      text: 'سیستم مدیریت محصولات مال واقعاً عالی است. همه کارهایم رو راحت انجام می‌دم'
    },
    {
      name: 'محمد کریمی',
      business: 'فروشگاه کتاب',
      image: 'assets/images/testimonial3.jpg',
      text: 'پشتیبانی ۲۴ ساعته و چت آنلاین واقعاً کمک بزرگی به کسب‌وکارم کرده'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^09[0-9]{9}$')]],
      email: ['', [Validators.email]],
      message: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.startSlideshow();
  }

  startSlideshow(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  openContactModal(): void {
    this.showContactModal = true;
  }

  closeContactModal(): void {
    this.showContactModal = false;
  }

  onSubmitContact(): void {
    if (this.contactForm.valid) {
      // Handle form submission
      console.log('Contact form submitted:', this.contactForm.value);
      this.closeContactModal();
      // Show success message
      alert('پیام شما با موفقیت ارسال شد. به زودی با شما تماس می‌گیریم.');
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
