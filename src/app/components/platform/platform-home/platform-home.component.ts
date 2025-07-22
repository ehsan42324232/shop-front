import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';

interface EnhancedFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  demo?: string;
  benefits?: string[];
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  savings?: string;
  features: string[];
  featured?: boolean;
}

interface SupportOption {
  title: string;
  description: string;
  icon: string;
}

interface Particle {
  x: number;
  y: number;
  speed: number;
  delay: number;
}

interface SignupData {
  name: string;
  phone: string;
  email: string;
  business: string;
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
export class PlatformHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroCanvas') heroCanvas!: ElementRef<HTMLCanvasElement>;

  // Component State
  showSignupModal = false;
  showLiveChat = false;
  isSubmitting = false;
  
  // Form Data
  signupData: SignupData = {
    name: '',
    phone: '',
    email: '',
    business: ''
  };

  // Particle System
  particles: Particle[] = [];

  // 3D Animation Variables
  private animationId?: number;
  private scene?: any;
  private camera?: any;
  private renderer?: any;
  private shapes: any[] = [];

  // Enhanced Features Data
  enhancedFeatures: EnhancedFeature[] = [
    {
      id: 'themes',
      title: 'طراحی‌های متنوع و زیبا',
      description: 'انواع مختلف تم و قالب برای فروشگاه شما. می‌تونید هر استایل/تمی که بیشتر دوست دارید رو انتخاب کنید. نگران نباشید، هر وقت خواستید می‌تونید با کمترین زحمت تغییرش بدید.',
      icon: '🎨',
      demo: '<div class="grid grid-cols-3 gap-2"><div class="h-8 bg-blue-200 rounded"></div><div class="h-8 bg-green-200 rounded"></div><div class="h-8 bg-purple-200 rounded"></div></div>',
      benefits: ['15+ قالب آماده', 'تغییر با یک کلیک', 'سفارشی‌سازی رنگ‌ها', 'طراحی ریسپانسیو']
    },
    {
      id: 'custom-domain',
      title: 'آدرس اختصاصی',
      description: 'وب‌سایت شما آدرس انتخابی خودتون رو خواهد داشت، نه یک کلمه کم و نه یک کلمه زیاد. کاملاً حرفه‌ای و معتبر.',
      icon: '🌐',
      demo: '<div class="text-center"><code class="bg-blue-100 px-3 py-1 rounded text-blue-800">yourshop.com</code></div>',
      benefits: ['آدرس کاملاً اختصاصی', 'گواهی SSL رایگان', 'پیکربندی DNS خودکار', 'قابل تغییر در آینده']
    },
    {
      id: 'social-integration',
      title: 'ادغام با شبکه‌های اجتماعی',
      description: 'چه اتلاف وقتی پر کردن تمام اون فیلدهای ناآشنا و تکرار اطلاعات و متنی که قبلاً تو تلگرام و اینستاگرام نوشتید، درسته؟ ما حالتون رو درک می‌کنیم.',
      icon: '📱',
      demo: '<div class="flex justify-center gap-3"><div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">T</div><div class="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">I</div></div>',
      benefits: ['خواندن آخرین پست‌ها', 'جداسازی متن و تصاویر', 'انتخاب آسان محتوا', 'تبدیل فوری به محصول']
    },
    {
      id: 'product-management',
      title: 'مدیریت کامل محصولات',
      description: 'می‌تونید دسته‌بندی‌ها و زیردسته‌بندی‌ها و ویژگی‌های محصولاتتون رو خودتون تعریف کنید. ما همه‌شون رو به شکل زیبایی نشون می‌دیم.',
      icon: '📊',
      demo: '<div class="flex gap-2 justify-center flex-wrap"><span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">رنگ</span><span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">سایز</span><span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">برند</span></div>',
      benefits: ['دسته‌بندی نامحدود', 'ویژگی‌های سفارشی', 'فیلترهای پیشرفته', 'نمایش بهینه محصول']
    },
    {
      id: 'reviews-ratings',
      title: 'نظرات و امتیازدهی مشتریان',
      description: 'مشتریانتون می‌تونن (در صورت تأیید شما) نظر بدن و امتیاز بدن. همچنین به محصولات مرتبط دیگه شما پیشنهاد داده می‌شن.',
      icon: '💬',
      demo: '<div class="text-center"><div class="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div><p class="text-xs text-gray-600 mt-1">"کیفیت عالی و ارسال سریع"</p></div>',
      benefits: ['سیستم امتیازدهی', 'مدیریت نظرات', 'پیشنهاد محصولات', 'افزایش اعتماد مشتری']
    },
    {
      id: 'seo-optimization',
      title: 'بهینه‌سازی SEO هوشمند',
      description: 'متن‌هاتون از سیستم هوشمند ما رد می‌شه تا برای SEO بهینه بشه، بدون اینکه چیزی تو متنتون تغییر کنه. تو جستجوهای گوگل هم پیدا می‌شید.',
      icon: '🔍',
      demo: '<div class="text-center"><div class="text-blue-600 font-semibold text-sm">رتبه بالاتر در گوگل 📈</div></div>',
      benefits: ['بهینه‌سازی خودکار', 'متا تگ‌های بهینه', 'URL دوستدار SEO', 'نقشه سایت XML']
    },
    {
      id: 'excel-import',
      title: 'آپلود Excel و مدیریت انبوه',
      description: 'می‌تونید محصولاتتون رو یکی یکی تعریف کنید، یا فقط یک اکسل منطبق با قالب‌های ما آپلود کنید و ما خودمون همه چیز رو می‌سازیم.',
      icon: '📤',
      demo: '<div class="text-center"><div class="text-green-600 font-semibold text-sm">📊 Excel → 🛍️ فروشگاه</div></div>',
      benefits: ['قالب اکسل آماده', 'وارد کردن انبوه', 'تشخیص خودکار', 'گزارش کامل']
    },
    {
      id: 'analytics',
      title: 'گزارش‌های جامع فروش',
      description: 'می‌تونید گزارش‌های اطلاعاتی درباره فروش‌هاتون ببینید. آمار کامل و تحلیل‌های مفید برای رشد کسب‌وکارتون.',
      icon: '📈',
      demo: '<div class="flex justify-between text-xs"><span>فروش امروز:</span><span class="text-green-600 font-semibold">2,450,000 تومان</span></div>',
      benefits: ['گزارش‌های فروش', 'تحلیل محصولات', 'آمار بازدید', 'داشبورد پیشرفته']
    },
    {
      id: 'cart-payment',
      title: 'سبد خرید و پرداخت آنلاین',
      description: 'وب‌سایت شما سبد خرید داره و با درگاه‌های پرداخت آنلاین معتبر مختلف و ارائه‌دهندگان خدمات لجستیک ادغام شده. هیچ نگرانی نداشته باشید.',
      icon: '🛒',
      demo: '<div class="flex gap-2 items-center justify-center text-xs"><span>💳</span><span>درگاه‌های پرداخت آنلاین</span></div>',
      benefits: ['درگاه‌های معتبر', 'سبد خرید پیشرفته', 'محاسبه خودکار', 'پیگیری سفارش']
    },
    {
      id: 'customer-accounts',
      title: 'حساب کاربری و پیامک تبلیغاتی',
      description: 'مشتریانتون می‌تونن با شماره‌هاشون حساب کاربری بسازن و شما بتونید پیامک تبلیغاتی شخصی‌سازی‌شده براشون ارسال کنید.',
      icon: '📱',
      demo: '<div class="text-center text-xs text-yellow-700">📱 "تخفیف ویژه 20% برای شما!"</div>',
      benefits: ['ثبت‌نام ساده', 'مدیریت مشتریان', 'پیامک هدفمند', 'تخفیف‌های شخصی']
    },
    {
      id: 'affordable-pricing',
      title: 'قیمت دوستانه',
      description: 'ما تازه شروع کردیم و تمام تلاشمون رو با اشتیاق روی بهبود این پلتفرم می‌گذاریم. تیم کوچکی هستیم پس کار رو با هزینه کمتری انجام می‌دیم.',
      icon: '🎯',
      demo: '<div class="text-center"><div class="text-green-600 font-bold">کیفیت بالا = قیمت مناسب</div></div>',
      benefits: ['قیمت رقابتی', 'هزینه کمتر', 'کیفیت بالا', 'تیم متعهد']
    },
    {
      id: 'custom-features',
      title: 'ویژگی‌های اختصاصی شما',
      description: 'علاوه بر تمام این‌ها، اگه چیزی نیاز دارید که فکر می‌کنید برای بقیه هم مفید باشه، فقط بهمون زنگ بزنید.',
      icon: '🎉',
      demo: '<div class="text-center"><div class="text-pink-600 font-semibold text-sm">💡 ایده شما = ویژگی جدید</div></div>',
      benefits: ['توسعه اختصاصی', 'پیاده‌سازی ایده‌ها', 'مشاوره رایگان', 'تیم توسعه متخصص']
    }
  ];

  // Pricing Plans
  pricingPlans: PricingPlan[] = [
    {
      id: 'monthly',
      name: 'ماهانه',
      price: 200000,
      duration: 'ماه',
      features: [
        'تمام ویژگی‌های پلتفرم',
        'آدرس اختصاصی',
        'پشتیبانی 24/7',
        'آپدیت‌های رایگان',
        'امکان تغییر طراحی'
      ]
    },
    {
      id: 'quarterly',
      name: 'سه ماهه',
      price: 500000,
      duration: '3ماه',
      savings: '17% صرفه‌جویی',
      featured: true,
      features: [
        'تمام ویژگی‌های پلتفرم',
        'آدرس اختصاصی',
        'پشتیبانی اولویت‌دار',
        'آپدیت‌های رایگان',
        'امکان تغییر طراحی',
        'گزارش‌های پیشرفته'
      ]
    },
    {
      id: 'biannual',
      name: 'شش ماهه',
      price: 1000000,
      duration: '6ماه',
      savings: '17% صرفه‌جویی',
      features: [
        'تمام ویژگی‌های پلتفرم',
        'آدرس اختصاصی',
        'پشتیبانی VIP',
        'آپدیت‌های رایگان',
        'امکان تغییر طراحی',
        'گزارش‌های تحلیلی',
        'مشاوره رایگان'
      ]
    }
  ];

  // Support Options
  supportOptions: SupportOption[] = [
    {
      title: 'تماس تلفنی',
      description: '7 روز هفته، 24 ساعت شبانه‌روز',
      icon: '📞'
    },
    {
      title: 'چت آنلاین',
      description: 'پاسخ فوری به سوالاتتون',
      icon: '💬'
    },
    {
      title: 'ایمیل',
      description: 'پاسخ تضمینی در کمترین زمان',
      icon: '📧'
    },
    {
      title: 'پیامک',
      description: 'اطلاع‌رسانی سریع و مؤثر',
      icon: '📱'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.generateParticles();
  }

  ngAfterViewInit() {
    this.init3DBackground();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  // Particle System
  generateParticles() {
    this.particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: Math.random() * 2,
      delay: Math.random() * 4
    }));
  }

  // 3D Background Animation
  init3DBackground() {
    if (typeof window !== 'undefined' && (window as any).THREE) {
      const THREE = (window as any).THREE;
      const canvas = this.heroCanvas.nativeElement;
      
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
      
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Create floating geometric shapes
      const geometry = new THREE.IcosahedronGeometry(1, 0);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        wireframe: true,
        transparent: true,
        opacity: 0.1
      });
      
      for (let i = 0; i < 15; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );
        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        this.scene.add(mesh);
        this.shapes.push(mesh);
      }
      
      this.camera.position.z = 10;
      this.animate3D();
    }
  }

  animate3D() {
    this.animationId = requestAnimationFrame(() => this.animate3D());
    
    this.shapes.forEach((shape, index) => {
      shape.rotation.x += 0.01 + index * 0.001;
      shape.rotation.y += 0.01 + index * 0.001;
      shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
    });
    
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Navigation Methods
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Modal Methods
  startFreeTrial() {
    // Navigate to registration page
    this.router.navigate(['/register'], { 
      queryParams: { trial: 'free', duration: '14days' }
    });
  }

  closeSignupModal() {
    this.showSignupModal = false;
    document.body.style.overflow = 'auto';
  }

  // Live Chat Methods
  openLiveChat() {
    this.showLiveChat = true;
  }

  closeLiveChat() {
    this.showLiveChat = false;
  }

  // Form Submission
  submitSignupForm() {
    if (!this.signupData.name || !this.signupData.phone || !this.signupData.email) {
      alert('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    this.isSubmitting = true;

    // Simulate form submission
    setTimeout(() => {
      alert(`${this.signupData.name} عزیز!\n\nثبت‌نام شما با موفقیت انجام شد.\n\nطی 24 ساعت آینده با شما تماس خواهیم گرفت.\n\nشماره تماس: ${this.signupData.phone}\nایمیل: ${this.signupData.email}\nنوع کسب‌وکار: ${this.signupData.business}`);
      
      this.closeSignupModal();
      this.isSubmitting = false;
      this.resetSignupForm();
    }, 2000);
  }

  resetSignupForm() {
    this.signupData = {
      name: '',
      phone: '',
      email: '',
      business: ''
    };
  }

  // Pricing Methods
  selectPlan(plan: PricingPlan) {
    this.router.navigate(['/register'], { 
      queryParams: { plan: plan.id } 
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fa-IR').format(price);
  }

  // Demo Methods
  playDemo() {
    alert('ویدیو نمایشی در حال بارگذاری...\n\nدر ویدیو خواهید دید:\n• نحوه ثبت‌نام و راه‌اندازی فروشگاه\n• اضافه کردن محصولات\n• تنظیمات طراحی\n• مدیریت سفارش‌ها\n• ادغام با شبکه‌های اجتماعی');
  }

  // Support Methods
  callSupport() {
    window.open('tel:+989123456789');
  }

  sendSMS() {
    window.open('sms:+989123456789');
  }

  sendEmail() {
    window.open('mailto:support@yourplatform.com');
  }
}