import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  video?: string;
  benefits: string[];
  demoUrl?: string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  originalPrice?: number;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

@Component({
  selector: 'app-platform-home',
  templateUrl: './platform-home.component.html',
  styleUrls: ['./platform-home.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class PlatformHomeComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  currentVideoIndex = 0;
  autoplayInterval: any;

  features: Feature[] = [
    {
      id: 'social-integration',
      title: 'هوشمند‌ترین ادغام شبکه‌های اجتماعی',
      description: 'دیگر نیازی نیست وقت خود را صرف پر کردن فیلدهای ناآشنا کنید. ما آخرین پست‌ها و استوری‌های شما را می‌خوانیم و تمام متن‌ها، عکس‌ها و ویدیوها را جداسازی می‌کنیم. فقط همان مطالبی که دوست دارید را انتخاب کنید و به همین راحتی محصولی در وب‌سایت خود ایجاد کنید.',
      icon: 'pi pi-share-alt',
      image: '/assets/images/social-integration-demo.png',
      video: '/assets/videos/social-integration-demo.mp4',
      demoUrl: '#social-demo',
      benefits: [
        'خودکارسازی کامل وارد کردن محتوا',
        'جداسازی هوشمند تصاویر، ویدیوها و متن',
        'پشتیبانی از اینستاگرام، تلگرام و سایر پلتفرم‌ها',
        'ذخیره‌سازی خودکار در کیفیت اصلی',
        'انتخاب آسان محتوا برای ایجاد محصول'
      ]
    },
    {
      id: 'custom-domain',
      title: 'آدرس اختصاصی کاملاً شخصی',
      description: 'وب‌سایت شما آدرس انتخابی خودتان را خواهد داشت، نه یک کلمه کمتر و نه یک کلمه بیشتر. کاملاً اختصاصی، حرفه‌ای و قابل اعتماد برای مشتریان شما.',
      icon: 'pi pi-globe',
      image: '/assets/images/custom-domain-demo.png',
      video: '/assets/videos/custom-domain-demo.mp4',
      demoUrl: '#domain-demo',
      benefits: [
        'آدرس کاملاً اختصاصی (yourstore.com)',
        'گواهی SSL رایگان برای امنیت',
        'پیکربندی DNS خودکار',
        'امکان تغییر آدرس در آینده',
        'افزایش اعتماد مشتریان'
      ]
    },
    {
      id: 'themes',
      title: 'قالب‌ها و طرح‌های متنوع',
      description: 'قالب‌های مختلف وب‌سایت در دسترس شما قرار دارد. می‌توانید سبک/قالبی را انتخاب کنید که بیشترین ارتباط را با آن احساس می‌کنید. نگران نباشید، می‌توانید هر زمان با کمترین تلاش آن را تغییر دهید.',
      icon: 'pi pi-palette',
      image: '/assets/images/themes-demo.png',
      video: '/assets/videos/themes-demo.mp4',
      demoUrl: '#themes-demo',
      benefits: [
        '۱۵+ قالب آماده و مدرن',
        'تغییر قالب با یک کلیک',
        'سفارشی‌سازی رنگ‌ها و فونت‌ها',
        'طراحی ریسپانسیو برای همه دستگاه‌ها',
        'بهینه‌سازی برای سرعت'
      ]
    },
    {
      id: 'categories-attributes',
      title: 'دسته‌بندی و ویژگی‌های هوشمند',
      description: 'می‌توانید دسته‌بندی‌ها و زیردسته‌ها و ویژگی‌های محصول خودتان را تعریف کنید. ما همه آن‌ها را به شکل زیبایی در صفحه داده محصول به کاربران شما نشان می‌دهیم و محصولات شما را بر اساس آن‌ها متمایز می‌کنیم.',
      icon: 'pi pi-sitemap',
      image: '/assets/images/categories-demo.png',
      video: '/assets/videos/categories-demo.mp4',
      demoUrl: '#categories-demo',
      benefits: [
        'دسته‌بندی نامحدود با ساختار درختی',
        'ویژگی‌های سفارشی برای هر دسته',
        'فیلترهای پیشرفته برای مشتریان',
        'نمایش بهینه در صفحه محصول',
        'قابلیت جستجوی پیشرفته'
      ]
    },
    {
      id: 'seo-optimization',
      title: 'بهینه‌سازی هوشمند SEO',
      description: 'متن‌های شما از سیستم هوشمند ما عبور می‌کند تا بدون تغییر چیزی در متن شما، برای موتورهای جستجو بهینه شود. بنابراین علاوه بر شبکه‌های اجتماعی، در جستجوهای عمومی یا تخصصی گوگل نیز پیدا می‌شوید.',
      icon: 'pi pi-search',
      image: '/assets/images/seo-demo.png',
      video: '/assets/videos/seo-demo.mp4',
      demoUrl: '#seo-demo',
      benefits: [
        'بهینه‌سازی خودکار کلمات کلیدی',
        'تولید متا تگ‌های بهینه',
        'ساختار URL دوستدار SEO',
        'نقشه سایت XML خودکار',
        'افزایش رتبه در گوگل'
      ]
    },
    {
      id: 'customer-management',
      title: 'مدیریت مشتریان و پیامک',
      description: 'مشتریان شما می‌توانند با شماره‌های خود در وب‌سایت شما حساب کاربری ایجاد کنند و شما سپس پیامک‌های تبلیغاتی شخصی‌سازی شده برای آن‌ها ارسال کنید.',
      icon: 'pi pi-users',
      image: '/assets/images/customer-management-demo.png',
      video: '/assets/videos/customer-management-demo.mp4',
      demoUrl: '#customer-demo',
      benefits: [
        'ثبت‌نام ساده با شماره موبایل',
        'پنل مدیریت مشتریان کامل',
        'ارسال پیامک تبلیغاتی هدفمند',
        'پروفایل مشتری با تاریخچه خرید',
        'دسته‌بندی مشتریان'
      ]
    },
    {
      id: 'promotions',
      title: 'تخفیف‌ها و پیشنهادات ویژه',
      description: 'می‌توانید دسته‌های مختلف محصولات خود را بر اساس ویژگی‌های متنوع‌شان انتخاب کرده و تخفیف‌های سفارشی روی آن‌ها تعریف کنید.',
      icon: 'pi pi-percentage',
      image: '/assets/images/promotions-demo.png',
      video: '/assets/videos/promotions-demo.mp4',
      demoUrl: '#promotions-demo',
      benefits: [
        'تخفیف‌های درصدی و مقداری',
        'کوپن‌های تخفیف شخصی',
        'تخفیف‌های زمان‌دار',
        'تخفیف بر اساس مقدار خرید',
        'ترکیب تخفیف‌های مختلف'
      ]
    },
    {
      id: 'excel-import',
      title: 'وارد کردن انبوه با اکسل',
      description: 'می‌توانید دسته‌بندی‌ها و محصولات خود را یکی یکی از طریق پنل کاربرپسند تعریف کنید، یا فقط یک اکسل منطبق با قالب‌های ما آپلود کنید و ما خودمان همه دسته‌بندی‌ها و محصولات و ویژگی‌ها را می‌سازیم.',
      icon: 'pi pi-file-excel',
      image: '/assets/images/excel-import-demo.png',
      video: '/assets/videos/excel-import-demo.mp4',
      demoUrl: '#excel-demo',
      benefits: [
        'قالب اکسل استاندارد آماده',
        'وارد کردن هزاران محصول با یک فایل',
        'تشخیص خودکار دسته‌بندی‌ها',
        'گزارش کامل از عملیات import',
        'صرفه‌جویی چشمگیر در زمان'
      ]
    },
    {
      id: 'analytics',
      title: 'گزارش‌های تحلیلی پیشرفته',
      description: 'می‌توانید گزارش‌های آموزنده‌ای درباره فروش خود مشاهده کنید. از آمار فروش تا تحلیل رفتار مشتریان، همه چیز در دسترس شماست.',
      icon: 'pi pi-chart-line',
      image: '/assets/images/analytics-demo.png',
      video: '/assets/videos/analytics-demo.mp4',
      demoUrl: '#analytics-demo',
      benefits: [
        'گزارش‌های فروش در بازه‌های زمانی',
        'تحلیل محبوب‌ترین محصولات',
        'آمار بازدید و تبدیل مشتری',
        'گزارش‌گیری PDF و Excel',
        'داشبورد تحلیلی پیشرفته'
      ]
    },
    {
      id: 'payment-logistics',
      title: 'پرداخت و ارسال یکپارچه',
      description: 'وب‌سایت شما دارای سبد خرید است و با درگاه‌های پرداخت معتبر مختلف و ارائه‌دهندگان خدمات حمل‌ونقل یکپارچه شده است. بنابراین شما هیچ نگرانی از پردازش سفارش‌هایتان نداشته باشید و زمان بیشتری برای تمرکز بر برنامه‌های آتی‌تان داشته باشید.',
      icon: 'pi pi-credit-card',
      image: '/assets/images/payment-logistics-demo.png',
      video: '/assets/videos/payment-logistics-demo.mp4',
      demoUrl: '#payment-demo',
      benefits: [
        'درگاه‌های پرداخت معتبر (زرین‌پال، ملت، پارسیان)',
        'ارسال با پست، اسنپ‌باکس، تیپاکس',
        'محاسبه خودکار هزینه ارسال',
        'پیگیری کامل مرحله‌ای سفارش',
        'مدیریت موجودی خودکار'
      ]
    }
  ];

  pricingPlans: PricingPlan[] = [
    {
      id: 'monthly',
      name: 'ماهانه',
      price: 200000,
      duration: 'ماه',
      features: [
        'تمام امکانات پلتفرم',
        'آدرس اختصاصی',
        'پشتیبانی ۲۴/۷',
        'بک‌آپ روزانه',
        'گواهی SSL رایگان',
        'چت آنلاین'
      ]
    },
    {
      id: 'quarterly',
      name: 'سه‌ماهه',
      price: 500000,
      duration: '۳ ماه',
      originalPrice: 600000,
      highlighted: true,
      badge: 'محبوب‌ترین',
      features: [
        'تمام امکانات پلتفرم',
        'آدرس اختصاصی',
        'پشتیبانی ۲۴/۷',
        'بک‌آپ روزانه',
        'گواهی SSL رایگان',
        'چت آنلاین',
        '۱۷% تخفیف'
      ]
    },
    {
      id: 'biannual',
      name: 'شش‌ماهه',
      price: 1000000,
      duration: '۶ ماه',
      originalPrice: 1200000,
      badge: 'بیشترین صرفه‌جویی',
      features: [
        'تمام امکانات پلتفرم',
        'آدرس اختصاصی',
        'پشتیبانی ۲۴/۷',
        'بک‌آپ روزانه',
        'گواهی SSL رایگان',
        'چت آنلاین',
        '۱۷% تخفیف',
        'مشاوره رایگان طراحی'
      ]
    }
  ];

  testimonials = [
    {
      name: 'سارا احمدی',
      business: 'فروشگاه لباس آنلاین سارا',
      image: '/assets/images/testimonial-1.jpg',
      text: 'با این پلتفرم، فروش آنلاین‌ام را به راحتی راه‌اندازی کردم. ادغام با اینستاگرام فوق‌العاده است! واقعاً کار من را آسان کرده.',
      rating: 5,
      sales: '۲۰۰+ فروش در ماه'
    },
    {
      name: 'محمد رضایی',
      business: 'فروشگاه لوازم خانگی',
      image: '/assets/images/testimonial-2.jpg',
      text: 'پشتیبانی عالی و امکانات کامل. واقعاً متفاوت از سایر پلتفرم‌هاست. تیم پشتیبانی همیشه پاسخگو هستند.',
      rating: 5,
      sales: '۱۵۰+ فروش در ماه'
    },
    {
      name: 'مریم کریمی',
      business: 'فروشگاه زیورآلات مریم',
      image: '/assets/images/testimonial-3.jpg',
      text: 'قیمت‌ها بسیار مناسب و کیفیت عالی. حتماً پیشنهاد می‌کنم! فروشم ۳ برابر شده.',
      rating: 5,
      sales: '۳۰۰+ فروش در ماه'
    }
  ];

  stats = [
    { value: '۱۲۰۰+', label: 'فروشگاه فعال', icon: 'pi pi-shop' },
    { value: '۸۵,۰۰۰+', label: 'سفارش پردازش شده', icon: 'pi pi-shopping-cart' },
    { value: '۲۴/۷', label: 'پشتیبانی', icon: 'pi pi-headphones' },
    { value: '۹۹.۹%', label: 'آپتایم سرور', icon: 'pi pi-server' }
  ];

  faqs = [
    {
      question: 'آیا واقعاً ۱۴ روز رایگان است؟',
      answer: 'بله، کاملاً رایگان و بدون نیاز به کارت اعتباری. می‌توانید تمام امکانات را امتحان کنید.'
    },
    {
      question: 'چند سفارش می‌توانم پردازش کنم؟',
      answer: 'هیچ محدودیتی در تعداد سفارشات، محصولات یا مشتریان وجود ندارد.'
    },
    {
      question: 'پشتیبانی چگونه است؟',
      answer: 'پشتیبانی ۲۴ ساعته از طریق تلفن، پیامک، ایمیل و چت آنلاین در دسترس شما است.'
    },
    {
      question: 'آیا می‌توانم پلن خود را تغییر دهم؟',
      answer: 'بله، می‌توانید هر زمان پلن خود را ارتقا یا تنزل دهید.'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.startVideoAutoplay();
  }

  ngOnDestroy() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  startVideoAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.nextVideo();
    }, 8000); // Change video every 8 seconds
  }

  nextVideo() {
    this.currentVideoIndex = (this.currentVideoIndex + 1) % this.features.length;
  }

  previousVideo() {
    this.currentVideoIndex = this.currentVideoIndex === 0 
      ? this.features.length - 1 
      : this.currentVideoIndex - 1;
  }

  selectPlan(plan: PricingPlan) {
    // Navigate to registration with selected plan
    this.router.navigate(['/register'], { 
      queryParams: { plan: plan.id } 
    });
  }

  startFreeTrial() {
    this.router.navigate(['/register'], { 
      queryParams: { trial: true } 
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fa-IR').format(price);
  }

  openDemo(feature: Feature) {
    // Open demo modal or navigate to demo page
    window.open(feature.demoUrl || '#', '_blank');
  }

  openLiveChat() {
    // Open live chat widget
    console.log('Opening live chat');
    // You can integrate with your chat service here
  }

  callSupport() {
    window.open('tel:+989123456789');
  }

  sendSMS() {
    window.open('sms:+989123456789');
  }

  sendEmail() {
    window.open('mailto:support@yourplatform.com');
  }

  navigateToDemo() {
    this.router.navigate(['/demo']);
  }

  navigateToFeatures() {
    this.scrollToSection('features');
  }

  generateStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
