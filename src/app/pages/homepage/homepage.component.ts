import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomepageService, ContactRequest, PlatformStats } from '../../services/homepage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Loading states
  isLoading = false;
  isSubmitting = false;
  
  // Data from API
  stats: PlatformStats = {
    active_stores: '1000+',
    daily_sales: '50 میلیون تومان',
    customer_satisfaction: '99%',
    years_experience: '5+'
  };
  
  features = [
    {
      title: 'فروشگاه آنلاین حرفه‌ای',
      description: 'با چند کلیک فروشگاه آنلاین خود را راه‌اندازی کنید',
      icon: 'store',
      image: '/assets/images/feature1.jpg'
    },
    {
      title: 'مدیریت محصولات پیشرفته',
      description: 'سیستم مدیریت محصولات با ویژگی‌های کامل',
      icon: 'inventory',
      image: '/assets/images/feature2.jpg'
    },
    {
      title: 'پرداخت‌های امن',
      description: 'اتصال به درگاه‌های پرداخت معتبر ایرانی',
      icon: 'payment',
      image: '/assets/images/feature3.jpg'
    },
    {
      title: 'ارسال و لجستیک',
      description: 'اتصال به شرکت‌های حمل و نقل معتبر',
      icon: 'local_shipping',
      image: '/assets/images/feature4.jpg'
    }
  ];

  testimonials = [
    {
      name: 'احمد محمدی',
      business: 'فروشگاه پوشاک آنلاین',
      content: 'با پلتفرم مال تونستم فروشگاهم رو به راحتی راه‌اندازی کنم و درآمدم دو برابر شده.',
      avatar: '/assets/images/testimonial1.jpg'
    },
    {
      name: 'فاطمه کریمی',
      business: 'فروشگاه لوازم خانه',
      content: 'رابط کاربری ساده و قابلیت‌های عالی. پشتیبانی فوق‌العاده و همیشه در دسترس.',
      avatar: '/assets/images/testimonial2.jpg'
    }
  ];

  // Form data
  contactForm = {
    name: '',
    phone: '',
    email: '',
    business_type: '',
    company_name: '',
    website_url: '',
    estimated_products: null,
    message: ''
  };

  // Form validation
  formErrors: any = {};
  showSuccessMessage = false;
  successMessage = '';
  errorMessage = '';

  constructor(private homepageService: HomepageService) { }

  ngOnInit(): void {
    this.loadHomepageData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load homepage data from API
   */
  loadHomepageData(): void {
    this.isLoading = true;
    
    this.homepageService.getHomepageData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.stats = response.data.stats;
            this.features = response.data.features;
            // Can also load settings, FAQs etc.
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading homepage data:', error);
          this.isLoading = false;
          // Keep default data on error
        }
      });
  }

  /**
   * Animate counter statistics
   */
  animateCounters(): void {
    const counters = document.querySelectorAll('.counter-value');
    counters.forEach((counter: any) => {
      const target = parseInt(counter.textContent?.replace(/[^\d]/g, '') || '0');
      let current = 0;
      const increment = target / 50;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          const displayValue = Math.ceil(current);
          
          // Preserve the original format (+ sign, % sign, etc.)
          const originalText = counter.getAttribute('data-original') || counter.textContent;
          if (originalText?.includes('%')) {
            counter.textContent = displayValue + '%';
          } else if (originalText?.includes('+')) {
            counter.textContent = this.homepageService.formatNumber(displayValue) + '+';
          } else {
            counter.textContent = this.homepageService.formatNumber(displayValue);
          }
          
          requestAnimationFrame(updateCounter);
        }
      };
      
      // Store original text
      counter.setAttribute('data-original', counter.textContent);
      updateCounter();
    });
  }

  /**
   * Scroll to features section
   */
  scrollToFeatures(): void {
    const element = document.getElementById('features');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Open contact request modal
   */
  openRequestForm(): void {
    const modal = document.getElementById('requestModal');
    if (modal) {
      modal.style.display = 'flex';
      // Reset form
      this.resetForm();
    }
  }

  /**
   * Close contact request modal
   */
  closeRequestForm(): void {
    const modal = document.getElementById('requestModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  /**
   * Submit contact request form
   */
  submitRequest(): void {
    if (this.validateForm()) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const contactData: ContactRequest = {
        name: this.contactForm.name,
        phone: this.homepageService.toEnglishNumbers(this.contactForm.phone),
        email: this.contactForm.email,
        business_type: this.contactForm.business_type,
        company_name: this.contactForm.company_name,
        website_url: this.contactForm.website_url,
        estimated_products: this.contactForm.estimated_products,
        message: this.contactForm.message,
        source: 'homepage_modal'
      };

      this.homepageService.submitContactRequest(contactData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            if (response.success) {
              this.showSuccessMessage = true;
              this.successMessage = response.message || 'درخواست شما با موفقیت ثبت شد.';
              this.closeRequestForm();
              this.resetForm();
              
              // Hide success message after 5 seconds
              setTimeout(() => {
                this.showSuccessMessage = false;
              }, 5000);
            } else {
              this.errorMessage = response.message || 'خطایی رخ داد.';
              this.formErrors = response.errors || {};
            }
          },
          error: (error) => {
            this.isSubmitting = false;
            this.errorMessage = error.message;
          }
        });
    }
  }

  /**
   * Validate contact form
   */
  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    // Required fields
    if (!this.contactForm.name.trim()) {
      this.formErrors.name = 'نام و نام خانوادگی الزامی است.';
      isValid = false;
    }

    if (!this.contactForm.phone.trim()) {
      this.formErrors.phone = 'شماره تماس الزامی است.';
      isValid = false;
    } else if (!this.homepageService.validateIranianPhone(this.contactForm.phone)) {
      this.formErrors.phone = 'شماره تماس صحیح نیست.';
      isValid = false;
    }

    if (!this.contactForm.business_type) {
      this.formErrors.business_type = 'نوع کسب‌وکار الزامی است.';
      isValid = false;
    }

    // Optional email validation
    if (this.contactForm.email && !this.homepageService.validateEmail(this.contactForm.email)) {
      this.formErrors.email = 'فرمت ایمیل صحیح نیست.';
      isValid = false;
    }

    return isValid;
  }

  /**
   * Reset contact form
   */
  resetForm(): void {
    this.contactForm = {
      name: '',
      phone: '',
      email: '',
      business_type: '',
      company_name: '',
      website_url: '',
      estimated_products: null,
      message: ''
    };
    this.formErrors = {};
    this.errorMessage = '';
  }

  /**
   * Format phone number as user types
   */
  onPhoneInput(event: any): void {
    const value = this.homepageService.toEnglishNumbers(event.target.value);
    this.contactForm.phone = value;
    // Format display value
    event.target.value = this.homepageService.formatIranianPhone(value);
  }

  /**
   * Get business type display name
   */
  getBusinessTypeDisplay(type: string): string {
    return this.homepageService.getBusinessTypeDisplay(type);
  }

  /**
   * Handle modal click outside to close
   */
  onModalClick(event: MouseEvent): void {
    const modal = event.target as HTMLElement;
    if (modal.id === 'requestModal') {
      this.closeRequestForm();
    }
  }

  /**
   * Quick contact for chat/phone support
   */
  initiateQuickContact(type: 'call' | 'chat'): void {
    if (type === 'call') {
      // Open phone dialer
      window.open('tel:+982112345678', '_self');
    } else {
      // Open chat widget or redirect to support
      console.log('Opening chat support...');
      // Implement chat widget here
    }
  }

  /**
   * Subscribe to newsletter
   */
  subscribeNewsletter(email: string): void {
    if (this.homepageService.validateEmail(email)) {
      this.homepageService.subscribeNewsletter(email, 'homepage_footer')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              alert('با موفقیت در خبرنامه ثبت نام شدید.');
            }
          },
          error: (error) => {
            alert(error.message);
          }
        });
    } else {
      alert('لطفاً ایمیل معتبر وارد کنید.');
    }
  }
}
