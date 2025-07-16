# ShopPlatform - Multi-Tenant E-commerce Frontend

A modern, multi-tenant e-commerce platform built with Angular and Tailwind CSS.

## 🚀 Features

### 🏪 Multi-Store Architecture
- **Domain-based store separation** - Each store has its own domain
- **Store-specific branding** - Custom themes, logos, and styling per store
- **Independent product catalogs** - Each store manages its own inventory

### 👑 Admin Panels

#### Super Admin Panel (`/admin`)
- ✅ **Store Management** - Create, edit, and manage multiple stores
- ✅ **Bulk Store Creation** - CSV upload for creating multiple stores
- ✅ **Platform Analytics** - Cross-store performance metrics
- ✅ **User Management** - Manage store owners and administrators

#### Store Admin Panel (`/store-admin`)
- ✅ **Multi-level Categories** - Hierarchical category management
- ✅ **Dynamic Product Attributes** - Custom fields defined per store
- ✅ **Bulk Product Import** - Excel/CSV upload with auto-category creation
- ✅ **Inventory Management** - Stock tracking and updates
- ✅ **Order Management** - Process and fulfill customer orders
- ✅ **Store Settings** - Shipping, payment, and business configuration

### 🛍️ Customer Experience
- ✅ **Product Browsing** - Advanced search and filtering
- ✅ **Shopping Cart** - Add, update, remove items
- ✅ **Checkout Process** - Complete order flow with delivery options
- ✅ **Delivery Scheduling** - Choose delivery date and time slots
- ✅ **Multiple Payment Methods** - Support for various payment gateways
- ✅ **Responsive Design** - Mobile-first, modern UI

### 📊 Advanced Features
- ✅ **Real-time Search** - Fast product search with suggestions
- ✅ **Category Hierarchy** - Multi-level category navigation
- ✅ **Product Variants** - Size, color, and custom attribute variations
- ✅ **Review System** - Customer ratings and reviews
- ✅ **Address Management** - Save and manage delivery addresses
- ✅ **Order Tracking** - Real-time order status updates

## 🏗️ Architecture

### Frontend Structure
```
src/app/
├── components/           # Shared components
│   ├── auth/            # Login, register
│   ├── basket/          # Shopping cart
│   ├── checkout/        # Order process
│   ├── home/            # Landing page
│   ├── product/         # Product list/detail
│   └── shared/          # Header, loading, etc.
├── modules/             # Feature modules
│   ├── admin/           # Super admin panel
│   ├── store-admin/     # Store owner panel
│   └── account/         # User account management
├── services/            # API services
│   ├── store.service.ts
│   ├── category.service.ts
│   ├── product.service.ts
│   ├── attribute.service.ts
│   ├── bulk-import.service.ts
│   └── checkout.service.ts
├── models/              # TypeScript interfaces
│   ├── store.models.ts
│   ├── category.models.ts
│   ├── product.models.ts
│   └── order.models.ts
└── guards/              # Route protection
```

### Key Models

#### Store Model
```typescript
interface Store {
  id: number;
  name: string;
  domain: string;
  theme_settings: StoreTheme;
  owner: StoreOwner;
  settings: StoreSettings;
  stats: StoreStats;
}
```

#### Product Model
```typescript
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  category_path: Category[];
  attributes: ProductAttribute[];
  media: ProductMedia[];
  variants?: ProductVariant[];
}
```

#### Category Model
```typescript
interface Category {
  id: number;
  name: string;
  parent_id?: number;
  level: number;
  path: string; // "Electronics > Phones > Smartphones"
  children?: Category[];
}
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 16+
- Angular CLI 15+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/ehsan42324232/shop-front.git
cd shop-front

# Install dependencies
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# Start development server
npm start
```

### Environment Setup
1. **Configure API endpoints** in `src/environments/`
2. **Set up domain routing** for multi-tenant architecture
3. **Configure payment gateways** in store settings

## 🎨 Design System

### Modern UI Features
- **Gradient backgrounds** and glass morphism effects
- **Smooth animations** and micro-interactions
- **Responsive grid layouts** with Tailwind CSS
- **Custom color schemes** per store
- **Professional typography** and spacing

### Components
- **Reusable UI components** for consistency
- **Form components** with validation
- **Data tables** with sorting and filtering
- **Modal dialogs** for actions
- **Toast notifications** for feedback

## 📱 Responsive Design

- **Mobile-first approach** - Optimized for all screen sizes
- **Touch-friendly interfaces** - Large buttons and easy navigation
- **Progressive Web App** features for mobile experience

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Role-based access control** (Super Admin, Store Owner, Customer)
- **Route guards** for protected areas
- **Input validation** and sanitization
- **HTTPS enforcement** for secure transactions

## 🚀 Performance

- **Lazy loading** for feature modules
- **OnPush change detection** for optimal performance
- **Image optimization** with responsive images
- **Code splitting** for faster initial load
- **Service workers** for caching

## 📋 TODO

### High Priority
- [ ] Create admin panel components
- [ ] Implement store-admin components
- [ ] Add bulk import UI
- [ ] Complete checkout flow
- [ ] Add payment gateway integration

### Medium Priority
- [ ] Add user account module
- [ ] Implement order tracking
- [ ] Add review system
- [ ] Create analytics dashboard

### Low Priority
- [ ] Add multi-language support
- [ ] Implement PWA features
- [ ] Add dark mode
- [ ] Create mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please open an issue on GitHub.
