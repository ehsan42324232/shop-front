import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HomepageService, ContactRequest, PlatformStats } from '../../services/homepage.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

declare let AOS: any;

@Component({
  selector: 'app-mall-homepage',
  templateUrl: './mall-homepage.component.html',
  styleUrls: ['./mall-homepage.component.css']
})
export class MallHomepageComponent implements OnInit, OnDestroy {
  
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

  // Stats for homepage (will be loaded from API)
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
    businessType: '',
    estimatedProducts: null as number | null,
    website: '',
    message: ''
  };

  // Loading states
  isLoadingContact = false;
  isLoadingRequest = false;
  isLoadingStats = false;

  // Modal states
  showContactModal = false;
  showRequestModal = false;
  showLoginModal = false;

  // Form validation
  contactFormErrors: any = {};
  requestFormErrors: any = {};

  // Component subscriptions
  private subscriptions: Subscription[] = [];

  // Business type options
  businessTypes = [
    { value: 'clothing', label: 'پوشاک' },
    { value: 'electronics', label: 'لوازم الکترونیکی' },
    { value: 'home', label: 'لوازم خانه' },
    { value: 'food', label: 'مواد غذایی' },
    { value: 'beauty', label: 'زیبایی و سلامت' },
    { value: 'books', label: 'کتاب و نشریات' },
    { value: 'sports', label: 'ورزش و تفریح' },
    { value: 'other', label: 'سایر' }
  ];

  constructor(
    private router: Router,
    private homepageService: HomepageService,
    private authService: AuthService,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    // Initialize AOS animations only in browser
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAOS();
    }

    // Load platform statistics
    this.loadPlatformStats();

    // Load homepage data
    this.loadHomepageData();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Initialize AOS animations
   */
  private initializeAOS(): void {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
      });
    }
  }

  /**
   * Load platform statistics from API
   */
  private loadPlatformStats(): void {
    this.isLoadingStats = true;
    const statsSub = this.homepageService.getPlatformStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.updateStatsDisplay(response.data);
        }
        this.isLoadingStats = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.isLoadingStats = false;
        // Keep default stats on error - no notification needed for background operation
      }
    });
    this.subscriptions.push(statsSub);
  }

  /**
   * Load complete homepage data
   */
  private loadHomepageData(): void {
    const homepageSub = this.homepageService.getHomepageData().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          if (response.data.stats) {
            this.updateStatsDisplay(response.data.stats);
          }
          if (response.data.features) {
            this.features = response.data.features.map((feature, index) => ({
              ...feature,
              image: this.features[index]?.image || '/assets/images/feature-default.jpg'
            }));
          }
        }
      },
      error: (error) => {
        console.error('Error loading homepage data:', error);
        // Keep default data on error - no notification needed for background operation
      }
    });
    this.subscriptions.push(homepageSub);
  }

  /**
   * Update stats display with API data
   */
  private updateStatsDisplay(stats: PlatformStats): void {
    this.stats = [
      { number: stats.active_stores || '۱۰,۰۰۰+', label: 'فروشگاه فعال' },
      { number: stats.daily_sales || '۵۰۰,۰۰۰+', label: 'فروش روزانه' },
      { number: stats.customer_satisfaction || '۹۹.۹%', label: 'رضایت مشتریان' },
      { number: stats.years_experience || '۵+', label: 'سال تجربه' }
    ];
  }

  // Modal handlers
  openContactModal(): void {
    this.showContactModal = true;
    this.resetContactForm();
  }

  closeContactModal(): void {
    this.showContactModal = false;
    this.resetContactForm();
  }

  openRequestModal(): void {
    this.showRequestModal = true;
    this.resetRequestForm();
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
    if (!this.validateContactForm()) {
      return;
    }

    this.isLoadingContact = true;
    const contactData = {
      name: this.contactForm.name,
      phone: this.homepageService.toEnglishNumbers(this.contactForm.phone),
      email: this.contactForm.email || undefined,
      business_type: 'general',
      message: this.contactForm.message
    };

    const contactSub = this.homepageService.submitContactRequest(contactData).subscribe({
      next: (response) => {
        this.isLoadingContact = false;
        if (response.success) {
          this.notificationService.success(
            'پیام شما با موفقیت ارسال شد. همکاران ما در اسرع وقت با شما تماس خواهند گرفت.',
            'پیام ارسال شد'
          );
          this.closeContactModal();
        } else {
          this.notificationService.error(
            response.message || 'خطایی در ارسال پیام رخ داد',
            'خطا در ارسال'
          );
        }
      },
      error: (error) => {
        this.isLoadingContact = false;
        this.notificationService.showApiError(error);
      }
    });
    this.subscriptions.push(contactSub);
  }

  submitRequestForm(): void {
    if (!this.validateRequestForm()) {
      return;
    }

    this.isLoadingRequest = true;
    const requestData: ContactRequest = {
      name: this.requestForm.ownerName,
      phone: this.homepageService.toEnglishNumbers(this.requestForm.phone),
      business_type: this.requestForm.businessType,
      company_name: this.requestForm.businessName,
      website_url: this.requestForm.website || undefined,
      estimated_products: this.requestForm.estimatedProducts || undefined,
      message: this.requestForm.message || undefined,
      source: 'homepage_request'
    };

    const requestSub = this.homepageService.submitContactRequest(requestData).subscribe({
      next: (response) => {
        this.isLoadingRequest = false;
        if (response.success) {
          this.notificationService.success(
            'درخواست شما با موفقیت ثبت شد. تیم فروش ما در کمترین زمان با شما تماس خواهد گرفت.',
            'درخواست ثبت شد'
          );
          this.closeRequestModal();
        } else {
          this.notificationService.error(
            response.message || 'خطایی در ثبت درخواست رخ داد',
            'خطا در ثبت درخواست'
          );
        }
      },
      error: (error) => {
        this.isLoadingRequest = false;
        this.notificationService.showApiError(error);
      }
    });
    this.subscriptions.push(requestSub);
  }

  // Navigation methods
  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  navigateToDemo(): void {
    // Open demo in new tab
    window.open('/demo', '_blank');
  }

  navigateToDashboard(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.navigateToLogin();
    }
  }

  scrollToSection(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // Form validation
  private validateContactForm(): boolean {
    this.contactFormErrors = {};
    let isValid = true;

    if (!this.contactForm.name.trim()) {
      this.contactFormErrors.name = 'نام الزامی است';
      isValid = false;
    }

    if (!this.contactForm.phone.trim()) {
      this.contactFormErrors.phone = 'شماره تلفن الزامی است';
      isValid = false;
    } else if (!this.homepageService.validateIranianPhone(this.contactForm.phone)) {
      this.contactFormErrors.phone = 'شماره تلفن معتبر نیست';
      isValid = false;
    }

    if (this.contactForm.email && !this.homepageService.validateEmail(this.contactForm.email)) {
      this.contactFormErrors.email = 'ایمیل معتبر نیست';
      isValid = false;
    }

    if (!this.contactForm.message.trim()) {
      this.contactFormErrors.message = 'پیام الزامی است';
      isValid = false;
    }

    return isValid;
  }

  private validateRequestForm(): boolean {
    this.requestFormErrors = {};
    let isValid = true;

    if (!this.requestForm.businessName.trim()) {
      this.requestFormErrors.businessName = 'نام کسب‌وکار الزامی است';
      isValid = false;
    }

    if (!this.requestForm.ownerName.trim()) {
      this.requestFormErrors.ownerName = 'نام مالک الزامی است';
      isValid = false;
    }

    if (!this.requestForm.phone.trim()) {
      this.requestFormErrors.phone = 'شماره تلفن الزامی است';
      isValid = false;
    } else if (!this.homepageService.validateIranianPhone(this.requestForm.phone)) {
      this.requestFormErrors.phone = 'شماره تلفن معتبر نیست';
      isValid = false;
    }

    if (!this.requestForm.businessType) {
      this.requestFormErrors.businessType = 'نوع کسب‌وکار الزامی است';
      isValid = false;
    }

    return isValid;
  }

  // Form reset methods
  private resetContactForm(): void {
    this.contactForm = {
      name: '',
      phone: '',
      email: '',
      message: ''
    };
    this.contactFormErrors = {};
  }

  private resetRequestForm(): void {
    this.requestForm = {
      businessName: '',
      ownerName: '',
      phone: '',
      businessType: '',
      estimatedProducts: null,
      website: '',
      message: ''
    };
    this.requestFormErrors = {};
  }

  // Phone number formatting
  formatPhoneNumber(event: any, formType: 'contact' | 'request'): void {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length >= 4) {
      if (value.length >= 7) {
        value = `${value.substring(0, 4)} ${value.substring(4, 7)} ${value.substring(7)}`;
      } else {
        value = `${value.substring(0, 4)} ${value.substring(4)}`;
      }
    }

    if (formType === 'contact') {
      this.contactForm.phone = value;
    } else {
      this.requestForm.phone = value;
    }
  }

  // Chat widget toggle
  toggleChat(): void {
    this.notificationService.showFeatureUnavailable('چت آنلاین');
  }

  // Check if user is authenticated
  isUserAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // Get business type label
  getBusinessTypeLabel(value: string): string {
    const type = this.businessTypes.find(t => t.value === value);
    return type ? type.label : value;
  }

  // Handle keyboard events for forms
  onFormKeyPress(event: KeyboardEvent, formType: 'contact' | 'request'): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (formType === 'contact') {
        this.submitContactForm();
      } else {
        this.submitRequestForm();
      }
    }
  }
}
