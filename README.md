# Multi-Store E-commerce Platform - Frontend

A modern, responsive Angular frontend for a comprehensive multi-tenant e-commerce platform. This application provides both platform administration and individual store management interfaces.

## 🚀 Features

### 🏪 Multi-Store Architecture
- **Domain-based routing** - Each store operates on its own domain
- **Store-specific themes** - Custom branding and styling per store
- **Independent interfaces** - Separate admin panels for platform and stores
- **Responsive design** - Mobile-first approach with Tailwind CSS

### 👑 Admin Interfaces

#### Platform Admin Panel (`/admin`)
- ✅ **Store Management** - Approve, manage, and monitor all stores
- ✅ **User Management** - Handle store owners and platform users
- ✅ **Analytics Dashboard** - Cross-store performance metrics
- ✅ **System Configuration** - Platform-wide settings and policies
- ✅ **Bulk Operations** - Mass store creation and management

#### Store Admin Panel (`/store-admin`)
- ✅ **Product Management** - Complete CRUD for products with rich editor
- ✅ **Category Management** - Hierarchical category creation and organization
- ✅ **Bulk Import/Export** - CSV/Excel upload with validation and preview
- ✅ **Inventory Tracking** - Real-time stock management and alerts
- ✅ **Order Management** - Process orders with status tracking
- ✅ **Store Customization** - Branding, themes, and configuration
- ✅ **Analytics** - Store-specific performance metrics

### 🛍️ Customer Experience
- ✅ **Product Browsing** - Advanced search, filtering, and sorting
- ✅ **Shopping Cart** - Persistent cart with real-time updates
- ✅ **Checkout Process** - Streamlined multi-step checkout
- ✅ **Address Management** - Save and manage multiple addresses
- ✅ **Order Tracking** - Real-time order status with notifications
- ✅ **Wishlist** - Save products for later purchase
- ✅ **Product Reviews** - Rate and review products
- ✅ **User Account** - Profile management and order history

### 🎨 Modern UI/UX
- ✅ **Persian (Farsi) RTL Support** - Complete right-to-left layout
- ✅ **Responsive Design** - Mobile, tablet, and desktop optimized
- ✅ **Modern Animations** - Smooth transitions and micro-interactions
- ✅ **Accessibility** - WCAG compliant with screen reader support
- ✅ **Component Library** - Reusable UI components
- ✅ **Toast Notifications** - User-friendly feedback system

## 🏗️ Architecture

### Frontend Structure
```
shop-front/
├── src/app/
│   ├── components/           # Shared components
│   │   ├── auth/            # Authentication components
│   │   ├── shared/          # Reusable UI components
│   │   ├── platform/        # Platform-specific components
│   │   └── store-home/      # Store homepage components
│   ├── modules/             # Feature modules
│   │   ├── admin/           # Platform admin module
│   │   ├── store-admin/     # Store admin module
│   │   └── account/         # User account module
│   ├── services/            # Angular services
│   │   ├── auth.service.ts
│   │   ├── store.service.ts
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   └── order.service.ts
│   ├── models/              # TypeScript interfaces
│   │   ├── store.models.ts
│   │   ├── product.models.ts
│   │   └── order.models.ts
│   ├── guards/              # Route guards
│   ├── interceptors/        # HTTP interceptors
│   └── pipes/               # Custom pipes
├── src/environments/        # Environment configurations
├── src/assets/             # Static assets
└── tailwind.config.js      # Tailwind CSS configuration
```

### Key Components

#### Store Admin Components
- **BulkImportComponent** - File upload with drag-and-drop, validation, and progress tracking
- **ProductManagementComponent** - Rich product editor with image upload and attributes
- **CategoryManagementComponent** - Hierarchical category tree with drag-and-drop reordering
- **OrderManagementComponent** - Order processing with status updates and tracking
- **AnalyticsDashboardComponent** - Charts and metrics for store performance

#### Customer Components
- **ProductCatalogComponent** - Grid/list view with advanced filtering
- **ProductDetailComponent** - Detailed product view with images, reviews, and recommendations
- **ShoppingCartComponent** - Cart management with quantity updates and calculations
- **CheckoutComponent** - Multi-step checkout with address and payment selection
- **OrderTrackingComponent** - Real-time order status and delivery tracking

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 16+
- Angular CLI 16+
- npm or yarn

### Quick Start

1. **Clone the repository**:
```bash
git clone https://github.com/ehsan42324232/shop-front.git
cd shop-front
```

2. **Install dependencies**:
```bash
npm install

# If you encounter peer dependency issues:
npm install --legacy-peer-deps
```

3. **Configure environment**:
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000',
  platformDomain: 'localhost:4200',
  supportedLanguages: ['fa', 'en'],
  defaultLanguage: 'fa'
};
```

4. **Start development server**:
```bash
# Standard development server
npm start

# Multi-store development (recommended)
npm run serve:multi

# This will start the server with:
# - Host: 0.0.0.0 (accessible from other devices)
# - Disabled host check (allows custom domains)
```

### Windows Setup with VS Code

1. **Open project in VS Code**
2. **Install recommended extensions**:
   - Angular Language Service
   - TypeScript Importer
   - Auto Rename Tag
   - Tailwind CSS IntelliSense
3. **Open integrated terminal** (`Ctrl + `\``)
4. **Run setup commands** as shown above

## 🌐 Multi-Store Development

### Local Domain Setup

Add these entries to your hosts file for local multi-store testing:

**Windows**: `C:\Windows\System32\drivers\etc\hosts`
**macOS/Linux**: `/etc/hosts`

```
127.0.0.1 localhost
127.0.0.1 shop1.localhost
127.0.0.1 shop2.localhost
127.0.0.1 admin.localhost
127.0.0.1 test.localhost
```

### Testing Multi-Store Setup

1. **Start backend server** (port 8000)
2. **Start frontend server** with multi-store support:
```bash
npm run serve:multi
```
3. **Access different interfaces**:
   - Platform: http://localhost:4200
   - Store 1: http://shop1.localhost:4200
   - Store 2: http://shop2.localhost:4200
   - Platform Admin: http://localhost:4200/admin
   - Store Admin: http://shop1.localhost:4200/store-admin

## 🎨 Styling & Theming

### Tailwind CSS Configuration

The project uses Tailwind CSS with custom configurations for Persian/RTL support:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'iranian': ['IRANSans', 'Tahoma', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### RTL (Right-to-Left) Support

All components are designed with RTL support:

```html
<!-- Automatic RTL layout -->
<div class="min-h-screen" dir="rtl">
  <h1 class="text-right">عنوان فارسی</h1>
  <p class="text-gray-600">متن فارسی با پشتیبانی کامل RTL</p>
</div>
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
.container {
  @apply px-4;          /* Mobile */
  @apply sm:px-6;       /* Small tablets */
  @apply md:px-8;       /* Tablets */
  @apply lg:px-12;      /* Laptops */
  @apply xl:px-16;      /* Desktops */
  @apply 2xl:px-20;     /* Large screens */
}
```

### Component Examples
```typescript
// Responsive product grid
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
  <app-product-card *ngFor="let product of products" [product]="product"></app-product-card>
</div>

// Responsive navigation
<nav class="hidden md:flex md:space-x-8">
  <!-- Desktop navigation -->
</nav>
<button class="md:hidden" (click)="toggleMobileMenu()">
  <!-- Mobile menu button -->
</button>
```

## 🚀 Key Features Implementation

### Bulk Import Component

```typescript
@Component({
  selector: 'app-bulk-import',
  template: `
    <!-- Drag and drop file upload -->
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6"
         [class.border-blue-400]="dragOver"
         (dragover)="onDragOver($event)"
         (drop)="onDrop($event)">
      
      <!-- File validation and preview -->
      <div *ngIf="validationResult" class="mb-4">
        <div class="p-4 rounded-lg" 
             [class]="validationResult.is_valid ? 'bg-green-50' : 'bg-red-50'">
          <p>{{ validationResult.message }}</p>
        </div>
      </div>
      
      <!-- Import progress -->
      <div *ngIf="isUploading" class="mb-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span class="mr-2">در حال آپلود...</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BulkImportComponent {
  // Implementation with file validation, progress tracking, and error handling
}
```

### Product Service

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api`;
  
  // CRUD operations
  getProducts(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/`, { params });
  }
  
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products/`, product);
  }
  
  // Bulk import with validation
  validateImportFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/import/validate/`, formData);
  }
  
  bulkImportProducts(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/import/products/`, formData);
  }
  
  // File download helper
  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
```

## 🧪 Testing

### Unit Testing
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### E2E Testing
```bash
# Run end-to-end tests
npm run e2e

# Run E2E tests for specific store
npm run e2e:store
```

## 🚀 Production Build

### Build Commands
```bash
# Development build
npm run build

# Production build
npm run build:prod

# Analyze bundle size
npm run build:analyze
```

### Deployment Configuration

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.your-domain.com',
  platformDomain: 'your-platform.com',
  storeDomains: {
    // Production store mappings
  },
  features: {
    enableAnalytics: true,
    enablePWA: true,
    enableOffline: true
  }
};
```

### Build Optimization

```json
// angular.json optimizations
{
  "configurations": {
    "production": {
      "fileReplacements": [...],
      "optimization": true,
      "outputHashing": "all",
      "sourceMap": false,
      "namedChunks": false,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true,
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "2mb",
          "maximumError": "5mb"
        }
      ]
    }
  }
}
```

## 📱 Progressive Web App (PWA)

### PWA Features
- **Offline Support** - Cache critical resources
- **App Install** - Add to home screen capability
- **Push Notifications** - Order updates and promotions
- **Background Sync** - Sync data when connection restored

```bash
# Add PWA support
ng add @angular/pwa
```

## 🌍 Internationalization (i18n)

### Multi-language Support
```bash
# Add Angular i18n
ng add @angular/localize

# Extract text for translation
ng extract-i18n

# Build for specific locale
ng build --localize
```

### Persian (Farsi) Setup
```typescript
// app.module.ts
import { registerLocaleData } from '@angular/common';
import localeFa from '@angular/common/locales/fa';

registerLocaleData(localeFa);

@NgModule({
  providers: [
    { provide: LOCALE_ID, useValue: 'fa-IR' }
  ]
})
export class AppModule { }
```

## 🔧 Development Tools

### VS Code Extensions
Install these recommended extensions:
```json
{
  "recommendations": [
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-json",
    "esbenp.prettier-vscode"
  ]
}
```

### Debug Configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow coding standards**: Use Prettier and ESLint
4. **Write tests**: Maintain test coverage above 80%
5. **Submit pull request**: Include description and screenshots

### Code Style
```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Angular team for the excellent framework
- Tailwind CSS for the utility-first CSS framework
- Angular Material for UI components
- All contributors who helped improve this platform

---

**Built with ❤️ for the Iranian e-commerce community**

### 🔗 Related Projects
- [Backend Repository](https://github.com/ehsan42324232/shop-back) - Django REST API
- [Documentation](https://your-docs-site.com) - Comprehensive documentation
- [Demo Site](https://demo.your-platform.com) - Live demonstration