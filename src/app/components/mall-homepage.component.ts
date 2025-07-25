// src/app/components/mall-homepage.component.ts
/**
 * Mall Platform - Complete Professional Homepage Component
 * Implements ALL requirements from product description
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-mall-homepage',
  templateUrl: './mall-homepage.component.html',
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
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('0.6s {{delay}}s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('pulse', [
      state('in', style({ transform: 'scale(1)' })),
      transition('* => *', [
        animate('2s ease-in-out', style({ transform: 'scale(1.05)' })),
        animate('2s ease-in-out', style({ transform: 'scale(1)' }))
      ])
    ]),
    trigger('float', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('1s {{delay}}s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MallHomepageComponent implements OnInit, OnDestroy {
  
  // Component State
  animatedStats = { stores: 0, users: 0, sales: 0 };
  showDemoPopup = false;
  showLoginPopup = false;
  showChatWidget = false;
  hasNewMessage = false;
  isSubmitting = false;
  isSubmittingDemo = false;
  isMobile = false;
  chatMessage = '';
  currentTestimonial = 0;

  // Forms
  contactForm: FormGroup;
  demoForm: FormGroup;

  // Data
  features = [
    {
      icon: 'fas fa-shopping-cart',
      title: 'فروشگاه کامل',
      description: 'سیستم فروشگاه با تمام امکانات مورد نیاز',
      color: '#DC2626'
    },
    {
      icon: 'fas fa-credit-card',
      title: 'پرداخت آنلاین',
      description: 'اتصال به درگاه‌های پرداخت ایرانی',
      color: '#2563EB'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'موبایل فرندلی',
      description: 'طراحی ریسپانسیو برای همه دستگاه‌ها',
      color: '#059669'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'آمار پیشرفته',
      description: 'گزارش‌های تفصیلی از فروش و مشتریان',
      color: '#7C3AED'
    },
    {
      icon: 'fas fa-sms',
      title: 'پیامک هوشمند',
      description: 'ارسال پیامک تبلیغاتی و اطلاع‌رسانی',
      color: '#EA580C'
    },
    {
      icon: 'fas fa-comments',
      title: 'پشتیبانی آنلاین',
      description: 'سیستم چت آنلاین با مشتریان',
      color: '#0891B2'
    }
  ];

  workSteps = [
    {
      icon: 'fas fa-user-plus',
      title: 'ثبت نام',
      description: 'با شماره موبایل خود ثبت نام کنید',
      time: '۳۰ ثانیه'
    },
    {
      icon: 'fas fa-palette',
      title: 'انتخاب قالب',
      description: 'از بین قالب‌های زیبا یکی را انتخاب کنید',
      time: '۲ دقیقه'
    },
    {
      icon: 'fas fa-box',
      title: 'افزودن محصولات',
      description: 'محصولات خود را اضافه کنید',
      time: '۵ دقیقه'
    }
  ];

  testimonials = [
    {
      text: 'با مال توانستم فروشگاه آنلاین خودم را خیلی راحت راه‌اندازی کنم. خیلی راضی هستم.',
      name: 'سارا احمدی',
      position: 'صاحب فروشگاه پوشاک',
      avatar: '/assets/images/testimonials/sara.jpg'
    },
    {
      text: 'پشتیبانی عالی و امکانات کامل. واقعاً پیشنهاد می‌کنم.',
      name: 'علی رضایی',
      position: 'فروشنده الکترونیک',
      avatar: '/assets/images/testimonials/ali.jpg'
    },
    {
      text: 'فروش من بعد از استفاده از مال ۳ برابر شده. فوق‌العاده است!',
      name: 'مریم کریمی',
      position: 'صاحب کافه',
      avatar: '/assets/images/testimonials/maryam.jpg'
    }
  ];

  contactInfo = {
    phone: '۰۲۱-۱۲۳۴۵۶۷۸',
    email: 'info@mall.ir',
    address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
    workingHours: 'شنبه تا پنج‌شنبه ۹ تا ۱۸'
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.isMobile = window.innerWidth < 768;
    this.initializeForms();
  }

  ngOnInit() {
    this.animateStats();
    this.setupChatWidget();
    this.startTestimonialSlider();
  }

  ngOnDestroy() {
    // Cleanup
  }

  // Form Initialization
  private initializeForms() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: [''],
      message: ['', Validators.required]
    });

    this.demoForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      businessType: ['']
    });
  }

  // Statistics Animation
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

  // Testimonial Slider
  private startTestimonialSlider() {
    setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  nextTestimonial() {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
  }

  previousTestimonial() {
    this.currentTestimonial = this.currentTestimonial === 0 
      ? this.testimonials.length - 1 
      : this.currentTestimonial - 1;
  }

  // Popup Management
  openDemoPopup() {
    this.showDemoPopup = true;
    document.body.style.overflow = 'hidden';
  }

  closeDemoPopup() {
    this.showDemoPopup = false;
    document.body.style.overflow = 'auto';
  }

  openLoginPopup() {
    this.showLoginPopup = true;
    document.body.style.overflow = 'hidden';
  }

  closeLoginPopup() {
    this.showLoginPopup = false;
    document.body.style.overflow = 'auto';
  }

  // Video Demo
  playDemoVideo() {
    // Open video demo in modal or redirect to video page
    window.open('/assets/videos/mall-demo.mp4', '_blank');
  }

  // Chat Widget
  private setupChatWidget() {
    setTimeout(() => {
      this.hasNewMessage = true;
    }, 5000);
  }

  toggleChatWidget() {
    this.showChatWidget = !this.showChatWidget;
    if (this.showChatWidget) {
      this.hasNewMessage = false;
    }
  }

  closeChatWidget() {
    this.showChatWidget = false;
  }

  sendChatMessage() {
    if (this.chatMessage?.trim()) {
      // Here you would typically send the message to your chat service
      console.log('Sending message:', this.chatMessage);
      this.chatMessage = '';
    }
  }

  // Form Submissions
  submitContactForm() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const contactData = this.contactForm.value;
      
      this.http.post(`${environment.apiUrl}/api/v1/homepage/contact-form/`, contactData)
        .subscribe({
          next: (response) => {
            alert('پیام شما با موفقیت ارسال شد!');
            this.contactForm.reset();
            this.isSubmitting = false;
          },
          error: (error) => {
            alert('خطا در ارسال پیام. لطفاً دوباره تلاش کنید.');
            this.isSubmitting = false;
          }
        });
    }
  }

  submitDemoRequest() {
    if (this.demoForm.valid && !this.isSubmittingDemo) {
      this.isSubmittingDemo = true;
      
      const demoData = this.demoForm.value;
      
      this.http.post(`${environment.apiUrl}/api/v1/homepage/request-demo/`, demoData)
        .subscribe({
          next: (response) => {
            alert('درخواست شما ثبت شد! به زودی با شما تماس خواهیم گرفت.');
            this.demoForm.reset();
            this.closeDemoPopup();
            this.isSubmittingDemo = false;
          },
          error: (error) => {
            alert('خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.');
            this.isSubmittingDemo = false;
          }
        });
    }
  }

  // Login Success Handler
  onLoginSuccess(userData: any) {
    this.closeLoginPopup();
    // Redirect to dashboard or handle login success
    console.log('Login successful:', userData);
  }
}
