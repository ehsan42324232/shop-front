# سایت‌ساز جعبه ابزار - پلتفرم چندمستاجره فروشگاه‌سازی

پلتفرم پیشرفته و انعطاف‌پذیر برای ایجاد فروشگاه‌های آنلاین با قابلیت سفارشی‌سازی کامل دسته‌بندی‌ها و ویژگی‌های محصولات.

## 🚀 ویژگی‌های کلیدی

### 🏪 **چندمستاجره (Multi-tenant)**
- هر فروشنده فروشگاه مستقل با زیردامنه اختصاصی
- دامنه سفارشی برای پلن‌های پریمیوم
- جداسازی کامل داده‌ها بین فروشگاه‌ها

### 📂 **دسته‌بندی انعطاف‌پذیر**
- ساختار سلسله‌مراتبی تا **۱۰ سطح**
- ویژگی‌های سفارشی برای هر دسته‌بندی
- بارگذاری دسته‌ای از طریق Excel

### 🏷️ **ویژگی‌های محصول**
- **۳ ویژگی ثابت**: نام، قیمت، تعداد
- **تا ۵۰ ویژگی سفارشی** برای هر محصول
- ۱۲ نوع ویژگی مختلف (متن، عدد، لیست، رنگ، تاریخ، ...)

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
  customDomain?: string;
  settings: StoreSettings;
  theme: StoreTheme;
  subscription: StoreSubscription;
}
```

#### CategoryTree (دسته‌بندی)
```typescript
interface CategoryTree {
  id: string;
  name: string;
  level: number; // 0-9
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
  
  // ویژگی‌های سفارشی
  attributes: ProductAttributeValue[];
  categories: string[];
  images: ProductImage[];
}
```

## 📋 راهنمای پیاده‌سازی

### ۱. راه‌اندازی فروشگاه جدید

```typescript
// ایجاد فروشگاه
const newStore = await storeService.createStore({
  name: "فروشگاه نمونه",
  subdomain: "sample-store",
  settings: {
    displayName: "فروشگاه نمونه",
    contactEmail: "info@sample.com",
    currency: "IRR",
    language: "fa"
  }
});
```

### ۲. تعریف دسته‌بندی‌ها

```typescript
// افزودن دسته‌بندی اصلی
const mainCategory = await categoryService.createCategory(storeId, {
  name: "پوشاک",
  level: 0,
  attributes: [
    {
      name: "برند",
      type: "text",
      required: true
    },
    {
      name: "رنگ",
      type: "dropdown",
      options: [
        { value: "red", label: "قرمز" },
        { value: "blue", label: "آبی" }
      ]
    }
  ]
});

// افزودن زیردسته
const subCategory = await categoryService.createCategory(storeId, {
  name: "پیراهن زنانه",
  parentId: mainCategory.id,
  level: 1,
  attributes: [
    {
      name: "سایز",
      type: "dropdown",
      options: [
        { value: "S", label: "کوچک" },
        { value: "M", label: "متوسط" },
        { value: "L", label: "بزرگ" }
      ]
    }
  ]
});
```

### ۳. افزودن محصولات

```typescript
const product = await productService.createProduct(storeId, {
  name: "پیراهن زنانه گلدار",
  price: 150000,
  count: 25,
  categories: [subCategory.id],
  primaryCategoryId: subCategory.id,
  attributes: [
    {
      attributeId: "brand-attr-id",
      attributeName: "برند",
      attributeType: "text",
      value: "زارا"
    },
    {
      attributeId: "color-attr-id",
      attributeName: "رنگ",
      attributeType: "dropdown",
      value: "blue"
    },
    {
      attributeId: "size-attr-id",
      attributeName: "سایز",
      attributeType: "dropdown",
      value: "M"
    }
  ],
  images: [
    {
      url: "/images/product1.jpg",
      alt: "پیراهن زنانه گلدار",
      isPrimary: true,
      order: 0
    }
  ]
});
```

### ۴. تغییر قالب

```typescript
// استفاده از قالب آماده
const modernTheme = storeService.getThemePresets()['modern'];
await storeService.updateTheme(storeId, modernTheme);

// سفارشی‌سازی رنگ‌ها
const customTheme = {
  ...modernTheme,
  colors: {
    ...modernTheme.colors,
    primary: '#FF6B6B',
    secondary: '#4ECDC4'
  }
};
await storeService.updateTheme(storeId, customTheme);
```

## 📊 بارگذاری Excel

### قالب دسته‌بندی‌ها
```excel
Level 1    | Level 2  | Level 3   | Attributes
پوشاک     | زنانه    | پیراهن    | رنگ,سایز,جنس,برند
پوشاک     | زنانه    | شلوار     | رنگ,سایز,جنس,برند,قد
پوشاک     | مردانه   | پیراهن    | رنگ,سایز,جنس,برند,یقه
```

### قالب محصولات
```excel
Name        | Price  | Count | Category              | رنگ  | سایز | جنس
پیراهن مجلسی | 150000 | 25    | پوشاک>زنانه>پیراهن     | آبی  | M    | پلی‌استر
شلوار جین    | 120000 | 15    | پوشاک>زنانه>شلوار      | مشکی | L    | پنبه
```

### کد بارگذاری
```typescript
// بارگذاری دسته‌بندی‌ها
const importOptions = {
  updateExisting: true,
  createMissingCategories: false,
  validateData: true,
  columnMapping: {
    'نام دسته‌بندی': 'name',
    'دسته والد': 'parentName',
    'ویژگی‌ها': 'attributes'
  }
};

const result = await categoryService.importCategoriesFromExcel(
  storeId, 
  excelFile, 
  importOptions
);

console.log(`${result.createdCategories} دسته‌بندی جدید ایجاد شد`);
```

## 🎯 استفاده از کامپوننت‌ها

### کامپوننت مدیریت دسته‌بندی‌ها
```html
<app-category-management></app-category-management>
```

### کامپوننت انتخاب قالب
```html
<app-theme-selector 
  [currentTheme]="store.theme"
  (themeSelected)="onThemeSelected($event)">
</app-theme-selector>
```

### کامپوننت آپلود Excel
```html
<app-excel-uploader 
  [uploadType]="'categories'"
  (uploadComplete)="onUploadComplete($event)">
</app-excel-uploader>
```

## 📈 پلن‌های اشتراک

| ویژگی | رایگان | پایه | حرفه‌ای | سازمانی |
|--------|---------|------|---------|----------|
| محصولات | ۱۰ | ۱۰۰ | ۱۰۰۰ | نامحدود |
| دسته‌بندی‌ها | ۵ | ۲۰ | ۵۰ | نامحدود |
| ویژگی‌ها | ۱۰ | ۲۵ | ۵۰ | ۵۰ |
| فضای ذخیره | ۱۰۰ مگ | ۱ گیگ | ۵ گیگ | ۲۰ گیگ |
| دامنه سفارشی | ❌ | ❌ | ✅ | ✅ |

## 🛠️ نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 18+
- Angular 15+
- TypeScript 4.8+

### نصب
```bash
# کلون کردن پروژه
git clone https://github.com/ehsan42324232/shop-front.git
cd shop-front

# نصب وابستگی‌ها
npm install

# راه‌اندازی سرور توسعه
ng serve
```

### متغیرهای محیط
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  storageUrl: 'http://localhost:8000/media',
  wsUrl: 'ws://localhost:8000/ws'
};
```

## 🔧 API های کلیدی

### Store Management
```http
GET    /api/stores/current              # دریافت فروشگاه جاری
PUT    /api/stores/{id}/settings        # بروزرسانی تنظیمات
PUT    /api/stores/{id}/theme           # تغییر قالب
POST   /api/stores/{id}/theme/preview   # پیش‌نمایش قالب
```

### Category Management
```http
GET    /api/stores/{id}/categories/tree           # درخت دسته‌بندی‌ها
POST   /api/stores/{id}/categories                # ایجاد دسته‌بندی
POST   /api/stores/{id}/categories/import         # بارگذاری Excel
GET    /api/stores/{id}/categories/export         # دانلود Excel
```

### Product Management
```http
GET    /api/stores/{id}/products                  # لیست محصولات
POST   /api/stores/{id}/products                  # ایجاد محصول
POST   /api/stores/{id}/products/bulk-update      # بروزرسانی دسته‌ای
POST   /api/stores/{id}/products/import           # بارگذاری Excel
```

## 🎨 ساختار قالب‌ها

### رنگ‌های قالب
```typescript
interface ThemeColors {
  primary: string;      // رنگ اصلی
  secondary: string;    // رنگ ثانویه
  accent: string;       // رنگ تاکیدی
  background: string;   // پس‌زمینه
  surface: string;      // سطح کارت‌ها
  text: string;         // متن اصلی
  textSecondary: string; // متن ثانویه
  border: string;       // حاشیه‌ها
}
```

### تایپوگرافی
```typescript
interface ThemeTypography {
  primaryFont: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
}
```

## 📱 واکنش‌گرایی

سیستم بر اساس Tailwind CSS طراحی شده و کاملاً واکنش‌گرا است:

- **موبایل**: < 768px
- **تبلت**: 768px - 1024px  
- **دسکتاپ**: > 1024px

## 🔒 امنیت

- جداسازی کامل داده‌ها بین فروشگاه‌ها
- اعتبارسنجی ورودی‌ها
- محدودیت نرخ درخواست
- رمزگذاری فایل‌های آپلود شده
- احراز هویت JWT

## 🐛 رفع مشکلات

### مشکلات رایج

**۱. مشکل در بارگذاری Excel**
```typescript
// بررسی فرمت فایل
if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
  throw new Error('فرمت فایل پشتیبانی نمی‌شود');
}

// بررسی حجم فایل
if (file.size > 10 * 1024 * 1024) { // 10MB
  throw new Error('حجم فایل بیش از حد مجاز است');
}
```

**۲. مشکل در نمایش قالب**
```css
/* اطمینان از لود شدن CSS سفارشی */
.theme-custom {
  --primary-color: var(--theme-primary, #3B82F6);
  --secondary-color: var(--theme-secondary, #8B5CF6);
}
```

**۳. مدیریت حافظه**
```typescript
// استفاده از OnDestroy برای پاکسازی
ngOnDestroy() {
  this.subscription?.unsubscribe();
  this.categoryService.clearCache();
}
```

## 🤝 مشارکت

برای مشارکت در پروژه:

1. فورک کنید
2. برنچ جدید بسازید: `git checkout -b feature/amazing-feature`
3. تغییرات را کامیت کنید: `git commit -m 'Add amazing feature'`
4. پوش کنید: `git push origin feature/amazing-feature`  
5. Pull Request ایجاد کنید

## 📝 مجوز

این پروژه تحت مجوز MIT منتشر شده است. فایل [LICENSE](LICENSE) را مطالعه کنید.

## 📞 پشتیبانی

- **ایمیل**: support@toolbox-sitebuilder.com
- **تلگرام**: @toolbox_support
- **مستندات**: [docs.toolbox-sitebuilder.com](https://docs.toolbox-sitebuilder.com)

---

**سایت‌ساز جعبه ابزار** - ساخت فروشگاه آنلاین هرگز آسان‌تر نبوده! 🚀
