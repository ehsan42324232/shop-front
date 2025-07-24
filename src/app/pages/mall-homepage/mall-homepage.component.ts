import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mall-homepage',
  templateUrl: './mall-homepage.component.html',
  styleUrls: ['./mall-homepage.component.css']
})
export class MallHomepageComponent implements OnInit {
  
  // Feature data for homepage sections
  features = [
    {
      title: 'ساخت فروشگاه آنلاین',
      description: 'با چند کلیک فروشگاه آنلاین خود را راه‌اندازی کنید',
      icon: 'fa-store',
      image: '/assets/images/feature-store.jpg'
    },
    {
      title: 'مدیریت محصولات',
      description: 'سیستم پیشرفته مدیریت محصولات با دسته‌بندی هوشمند',
      icon: 'fa-boxes',
      image: '/assets/images/feature-products.jpg'
    },
    {
      title: 'اتصال به شبکه‌های اجتماعی',
      description: 'واردات خودکار محتوا از تلگرام و اینستاگرام',
      icon: 'fa-share-alt',
      image: '/assets/images/feature-social.jpg'
    },
    {
      title: 'درگاه پرداخت امن',
      description: 'اتصال به معتبرترین درگاه‌های پرداخت ایرانی',
      icon: 'fa-credit-card',
      image: '/assets/images/feature-payment.jpg'
    },
    {
      title: 'ارسال و لجستیک',
      description: 'اتصال به شرکت‌های پست و باربری سراسر کشور',
      icon: 'fa-shipping-fast',
      image: '/assets/images/feature-shipping.jpg'
    },
    {
      title: 'پشتیبانی ۲۴ ساعته',
      description: 'تیم پشتیبانی حرفه‌ای در کنار شما',
      icon: 'fa-headset',
      image: '/assets/images/feature-support.jpg'
    }
  ];

  // Stats for homepage
  stats = [
    { number: '۱۰,۰۰۰+', label: 'فروشگاه فعال' },
    { number: '۵۰۰,۰۰۰+', label: 'محصول ثبت شده' },
    { number: '۹۹.۹%', label: 'آپتایم سرور' },
    { number: '۲۴/۷', label: 'پشتیبانی' }
  ];

  // Form data
  contactForm = {
    name: '',
    phone: '',
    email: '',
    message: ''
  };

  requestForm = {
    businessName: '',
    ownerName: '',
    phone: '',
    businessType: ''
  };

  // Modal states
  showContactModal = false;
  showRequestModal = false;
  showLoginModal = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialize AOS animations if available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true
      });
    }
  }

  // Modal handlers
  openContactModal(): void {
    this.showContactModal = true;
  }

  closeContactModal(): void {
    this.showContactModal = false;
    this.resetContactForm();
  }

  openRequestModal(): void {
    this.showRequestModal = true;
  }

  closeRequestModal(): void {
    this.showRequestModal = false;
    this.resetRequestForm();
  }

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  // Form handlers
  submitContactForm(): void {
    if (this.isContactFormValid()) {
      // Send contact form data
      console.log('Contact form submitted:', this.contactForm);
      // TODO: Implement API call
      this.closeContactModal();
      this.showSuccessMessage('پیام شما با موفقیت ارسال شد');
    }
  }

  submitRequestForm(): void {
    if (this.isRequestFormValid()) {
      // Send request form data
      console.log('Request form submitted:', this.requestForm);
      // TODO: Implement API call
      this.closeRequestModal();
      this.showSuccessMessage('درخواست شما ثبت شد. همکاران ما با شما تماس می‌گیرند');
    }
  }

  // Navigation methods
  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  navigateToDemo(): void {
    this.router.navigate(['/demo']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Form validation
  private isContactFormValid(): boolean {
    return !!(this.contactForm.name && 
              this.contactForm.phone && 
              this.contactForm.message);
  }

  private isRequestFormValid(): boolean {
    return !!(this.requestForm.businessName && 
              this.requestForm.ownerName && 
              this.requestForm.phone);
  }

  // Form reset methods
  private resetContactForm(): void {
    this.contactForm = {
      name: '',
      phone: '',
      email: '',
      message: ''
    };
  }

  private resetRequestForm(): void {
    this.requestForm = {
      businessName: '',
      ownerName: '',
      phone: '',
      businessType: ''
    };
  }

  // Utility methods
  private showSuccessMessage(message: string): void {
    // TODO: Implement toast notification
    alert(message);
  }

  // Chat widget toggle
  toggleChat(): void {
    // TODO: Implement chat widget
    console.log('Toggle chat widget');
  }
}
