# سایت‌ساز جعبه ابزار - پلتفرم چندمستاجره فروشگاه‌سازی

پلتفرم پیشرفته و انعطاف‌پذیر برای ایجاد فروشگاه‌های آنلاین با قابلیت سفارشی‌سازی کامل دسته‌بندی‌ها، ویژگی‌های محصولات، و دامنه اختصاصی.

## 🚀 ویژگی‌های کلیدی

### 🏪 **چندمستاجره (Multi-tenant)**
- هر فروشنده فروشگاه مستقل با زیردامنه اختصاصی
- **دامنه .ir اختصاصی** برای هر فروشگاه
- بررسی دسترسی دامنه در زمان واقعی
- جداسازی کامل داده‌ها بین فروشگاه‌ها

### 📂 **دسته‌بندی انعطاف‌پذیر**
- ساختار سلسله‌مراتبی تا **۱۰ سطح**
- ویژگی‌های سفارشی برای هر دسته‌بندی
- بارگذاری دسته‌ای از طریق Excel

### 🏷️ **ویژگی‌های محصول**
- **۳ ویژگی ثابت**: نام، قیمت، تعداد
- **تا ۵۰ ویژگی سفارشی** برای هر محصول
- ۱۲ نوع ویژگی مختلف (متن، عدد، لیست، رنگ، تاریخ، ...)

### 🎥 **پشتیبانی کامل از ویدیو**
- آپلود ویدیوهای متعدد برای هر محصول
- پشتیبانی از YouTube، Vimeo، Instagram، TikTok
- ویدیوهای کوتاه برای نمایش محصولات
- پردازش خودکار کیفیت‌های مختلف

### 💬 **چت آنلاین پیشرفته**
- چت مستقیم با مشتریان
- یکپارچگی با Telegram و WhatsApp
- پاسخ خودکار و ساعت کاری
- ویجت چت زیبا و کاربردی

### 🌐 **دامنه‌های .ir**
- بررسی دسترسی دامنه در فرم درخواست
- ثبت خودکار دامنه‌های .ir
- پیشنهادات دامنه‌های جایگزین
- تنظیم DNS خودکار

### 🎨 **سیستم قالب پیشرفته**
- قالب‌های آماده: مدرن، کلاسیک، مینیمال، پررنگ
- ویرایشگر بصری برای تغییر رنگ‌ها و فونت‌ها
- تغییر آنی قالب بدون نیاز به راه‌اندازی مجدد

## 🏗️ معماری سیستم

### مدل‌های اصلی

#### Store (فروشگاه)
```typescript
interface Store {
  id: string;
  name: string;
  subdomain: string; // "mystore.toolbox.com"
  customDomain?: string; // "mystore.ir"
  settings: StoreSettings;
  theme: StoreTheme;
}
```

#### CategoryTree (دسته‌بندی)
```typescript
interface CategoryTree {
  id: string;
  name: string;
  level: number; // 0-9 (حداکثر ۱۰ سطح)
  parentId?: string;
  attributes: CategoryAttribute[]; // ویژگی‌های این دسته
  children?: CategoryTree[];
}
```

#### Product (محصول)
```typescript
interface Product {
  // ویژگی‌های ثابت
  name: string;
  price: number;
  count: number;
  
  // ویژگی‌های سفارشی (تا ۵۰)
  attributes: ProductAttributeValue[];
  
  // رسانه
  images: ProductImage[];
  videos: ProductVideo[]; // پشتیبانی از ویدیوهای متعدد
  
  // سایر اطلاعات
  categories: string[];
  seo: ProductSEO;
}
```

## 🎯 فرآیند راه‌اندازی فروشگاه

### 1️⃣ **درخواست فروشگاه با دامنه .ir**
```typescript
const storeRequest = {
  storeName: "فروشگاه پوشاک آریا",
  phoneNumber: "09123456789",
  productType: "پوشاک",
  wantCustomDomain: true,
  customDomain: "aria-fashion" // می‌شود aria-fashion.ir
};

// بررسی دسترسی دامنه
const domainResult = await domainService.checkIrDomainAvailability("aria-fashion");
// { available: true, domain: "aria-fashion", suggestion: null }
```

### 2️⃣ **تنظیم دسته‌بندی‌ها (از طریق Excel)**
```excel
Level 1    | Level 2  | Level 3     | Level 4  | Attributes
پوشاک     | زنانه    | پیراهن      | مجلسی    | رنگ,سایز,جنس,برند,یقه,آستین
پوشاک     | زنانه    | شلوار       | جین      | رنگ,سایز,برند,قد,مدل
پوشاک     | مردانه   | پیراهن      | کژوال    | رنگ,سایز,جنس,برند,طرح
کفش       | زنانه    | کفش پاشنه‌دار | مجلسی    | رنگ,سایز,برند,ارتفاع_پاشنه
```

### 3️⃣ **افزودن محصولات با ویدیو**
```typescript
const product = await productService.createProduct(storeId, {
  name: "پیراهن زنانه گلدار",
  price: 150000,
  count: 25,
  
  // ویدیوهای محصول
  videos: [
    {
      type: 'upload',
      url: '/videos/product-demo.mp4',
      title: 'نمایش محصول',
      thumbnail: '/images/video-thumb.jpg',
      duration: 30
    },
    {
      type: 'instagram',
      url: 'https://instagram.com/p/abc123',
      title: 'ویدیو اینستاگرام',
      platformData: {
        originalUrl: 'https://instagram.com/p/abc123'
      }
    }
  ],
  
  // ویژگی‌های سفارشی
  attributes: [
    { attributeName: "رنگ", value: "آبی" },
    { attributeName: "سایز", value: "M" },
    { attributeName: "جنس", value: "پنبه" }
  ]
});
```

### 4️⃣ **تنظیم چت آنلاین**
```typescript
const chatSettings: ChatSettings = {
  autoReply: {
    enabled: true,
    message: "سلام! خوش آمدید. چطور می‌تونم کمکتون کنم؟",
    workingHours: {
      enabled: true,
      start: "09:00",
      end: "18:00",
      days: [1, 2, 3, 4, 5], // شنبه تا چهارشنبه
      timezone: "Asia/Tehran"
    }
  },
  telegram: {
    enabled: true,
    botToken: "YOUR_BOT_TOKEN"
  },
  whatsapp: {
    enabled: true,
    phoneNumber: "989123456789"
  },
  appearance: {
    position: 'bottom-right',
    primaryColor: '#3B82F6',
    welcomeMessage: 'سلام! چطور می‌تونم کمکتون کنم؟',
    placeholder: 'پیام خود را بنویسید...'
  }
};

await chatService.updateChatSettings(storeId, chatSettings);
```

## 📊 بارگذاری Excel

### قالب محصولات با ویدیو
```excel
Name            | Price  | Count | Category              | رنگ  | سایز | Videos
پیراهن مجلسی    | 150000 | 25    | پوشاک>زنانه>پیراهن     | آبی  | M    | /videos/demo1.mp4|https://youtu.be/abc123
شلوار جین       | 120000 | 15    | پوشاک>زنانه>شلوار      | مشکی | L    | /videos/demo2.mp4
کفش پاشنه‌دار    | 450000 | 8     | کفش>زنانه>کفش پاشنه‌دار | مشکی | 38   | https://instagram.com/p/xyz789
```

### کد بارگذاری
```typescript
const result = await productService.importProductsFromExcel(storeId, file, {
  updateExisting: true,
  processVideos: true, // پردازش خودکار ویدیوها
  validateVideoUrls: true,
  columnMapping: {
    'Videos': 'videos' // ستون Videos به فیلد videos
  }
});
```

## 💬 استفاده از چت

### افزودن ویجت چت
```html
<!-- در قالب فروشگاه -->
<app-chat-widget 
  *ngIf="store.settings.features.enableLiveChat">
</app-chat-widget>
```

### پیکربندی چت
```typescript
// تنظیم Telegram Bot
await chatService.setupTelegramBot(storeId, botToken);

// تنظیم WhatsApp
await chatService.setupWhatsApp(storeId, phoneNumber);

// ایجاد پاسخ خودکار
await chatService.createAutoReply(storeId, 
  "سلام", 
  "سلام! خوش آمدید به فروشگاه ما. چطور می‌تونم کمکتون کنم؟"
);
```

## 🌐 مدیریت دامنه

### بررسی دسترسی دامنه
```typescript
// در فرم درخواست
async checkDomainAvailability() {
  const result = await this.domainService.checkIrDomainAvailability("mystore");
  
  if (result.available) {
    // دامنه در دسترس است
    this.showAvailableMessage();
  } else {
    // پیشنهاد دامنه جایگزین
    this.showSuggestion(result.suggestion);
  }
}
```

### ثبت دامنه
```typescript
const domainData = {
  domain: "mystore.ir",
  storeId: storeId,
  ownerInfo: {
    name: "نام مالک",
    email: "owner@email.com", 
    phone: "09123456789",
    address: "آدرس کامل",
    nationalId: "کد ملی"
  }
};

await domainService.registerDomain(domainData);
```

## 🎨 کار با قالب‌ها

### انتخاب قالب
```typescript
// استفاده از قالب آماده
const vibrantTheme = storeService.getThemePresets()['vibrant'];

// سفارشی‌سازی
const customTheme = {
  ...vibrantTheme,
  colors: {
    ...vibrantTheme.colors,
    primary: '#8B5CF6', // بنفش
    secondary: '#EC4899' // صورتی
  },
  layout: {
    ...vibrantTheme.layout,
    showChatWidget: true // نمایش ویجت چت
  }
};

await storeService.updateTheme(storeId, customTheme);
```

## 📱 کامپوننت‌ها

### مدیریت دسته‌بندی‌ها
```html
<app-category-management></app-category-management>
```

### ویجت چت
```html
<app-chat-widget></app-chat-widget>
```

### آپلود Excel
```html
<app-excel-uploader 
  [uploadType]="'products'"
  [supportVideos]="true"
  (uploadComplete)="onUploadComplete($event)">
</app-excel-uploader>
```

## 🔧 API های کلیدی

### Store Management
```http
GET    /api/stores/current              # دریافت فروشگاه جاری
PUT    /api/stores/{id}/settings        # بروزرسانی تنظیمات
PUT    /api/stores/{id}/theme           # تغییر قالب
```

### Domain Management
```http
GET    /api/domains/check-ir            # بررسی دامنه .ir
POST   /api/domains/register            # ثبت دامنه
POST   /api/domains/{id}/setup-dns      # تنظیم DNS
```

### Chat Management
```http
POST   /api/stores/{id}/chat/sessions   # شروع جلسه چت
GET    /api/chat/sessions/{id}/messages # دریافت پیام‌ها
POST   /api/chat/sessions/{id}/messages # ارسال پیام
PUT    /api/stores/{id}/chat/settings   # تنظیمات چت
```

### Product & Video Management
```http
POST   /api/stores/{id}/products        # ایجاد محصول با ویدیو
POST   /api/products/{id}/videos        # افزودن ویدیو
GET    /api/videos/{id}/status          # وضعیت پردازش ویدیو
```

## 🛠️ نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 18+
- Angular 15+
- WebSocket support برای چت
- FFmpeg برای پردازش ویدیو

### نصب
```bash
git clone https://github.com/ehsan42324232/shop-front.git
cd shop-front
npm install
ng serve
```

### متغیرهای محیط
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  wsUrl: 'ws://localhost:8000/ws', // برای چت
  storageUrl: 'http://localhost:8000/media',
  
  // تنظیمات دامنه
  domainRegistrar: {
    apiKey: 'YOUR_REGISTRAR_API_KEY',
    endpoint: 'https://api.registrar.ir'
  },
  
  // تنظیمات ویدیو
  videoProcessing: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedFormats: ['mp4', 'webm', 'mov'],
    qualities: ['360p', '480p', '720p', '1080p']
  }
};
```

## 📈 ویژگی‌های پیشرفته

### پردازش ویدیو
- تبدیل خودکار به فرمت‌های مختلف
- ایجاد thumbnail های خودکار
- فشرده‌سازی برای وب
- پشتیبانی از کیفیت‌های مختلف

### چت هوشمند
- پاسخ خودکار بر اساس کلمات کلیدی
- انتقال خودکار به Telegram/WhatsApp
- آمار و تحلیل مکالمات
- ذخیره تاریخچه چت

### مدیریت دامنه
- بررسی دسترسی در زمان واقعی
- ثبت خودکار در سایت NIC ایران
- تنظیم DNS خودکار
- تمدید خودکار دامنه

## 🔐 امنیت

- SSL برای تمام دامنه‌ها
- رمزگذاری پیام‌های چت
- احراز هویت دومرحله‌ای
- جداسازی کامل داده‌های فروشگاه‌ها
- بکاپ خودکار روزانه

## 🚀 عملکرد

- CDN برای ویدیوها و تصاویر
- Cache هوشمند
- Lazy loading برای رسانه
- WebSocket برای چت real-time
- Progressive Web App (PWA)

---

**سایت‌ساز جعبه ابزار** - ساخت فروشگاه آنلاین با دامنه .ir اختصاصی و چت آنلاین! 🚀
