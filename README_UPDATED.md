# Mall (مال) - E-commerce Platform Frontend

## 🏪 پلتفرم فروشگاه‌ساز مال

Mall is a comprehensive e-commerce platform designed specifically for the Iranian market, operating entirely in Farsi. This is the Angular frontend for the platform.

## 🎯 Platform Overview

Mall enables store owners to build and manage their own online stores through a user-friendly platform. Products become saleable on individual websites with comprehensive management tools.

## ✨ Core Features

### 🔐 Authentication & Management
- OTP-based authentication for all platform logins
- Store owner admin panel access
- Django admin panel for platform management
- User account creation and management

### 🛍️ Product System
- **Object-Oriented Product Structure**: Hierarchical tree levels with inheritance
- **Product Classes**: Root class with price, images, and videos
- **Flexible Attributes**: Color, size, material with categorization options
- **Product Instances**: Created only from leaf nodes
- **Stock Management**: Low stock warnings for customers
- **Bulk Creation**: Checkbox to create similar instances quickly

### 📱 Social Media Integration
- "Get from social media" button for content extraction
- Retrieves latest 5 posts/stories from Telegram and Instagram
- Separates pictures, videos, and text content
- Users select materials for product definitions

### 🎨 Customization & Themes
- Multiple layout and theme options
- Real-time theme changes
- Independent domain support (subdomain or custom)
- Red, blue, and white color scheme

### 🛒 E-commerce Features
- Shopping cart and checkout
- Customer account management
- Order tracking and management
- Payment gateway integration
- Iranian logistics provider integration
- SMS promotion campaigns

### 📊 Analytics & Insights
- Comprehensive dashboards for store owners
- Sales charts and analytics
- Website view statistics
- Customer interaction metrics

## 🏗️ Technical Stack

### Frontend (This Repository)
- **Framework**: Angular 16+
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Build Tool**: Angular CLI
- **UI Components**: Custom components with RTL support

### Backend Integration
- **API**: RESTful APIs with Django REST Framework
- **Authentication**: JWT tokens with OTP verification
- **Real-time**: WebSocket integration for chat
- **File Upload**: Image and video upload support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Angular CLI (`npm install -g @angular/cli`)

### Installation
```bash
# Clone the repository
git clone https://github.com/ehsan42324232/shop-front.git
cd shop-front

# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build --prod
```

### Environment Setup
```bash
# Development
cp src/environments/environment.ts.example src/environments/environment.ts

# Production
cp src/environments/environment.prod.ts.example src/environments/environment.prod.ts
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   │   ├── homepage/       # Platform homepage
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Store owner dashboard
│   │   ├── products/      # Product management
│   │   ├── orders/        # Order management
│   │   └── storefront/    # Customer-facing store
│   ├── services/          # API services
│   ├── guards/            # Route guards
│   ├── interceptors/      # HTTP interceptors
│   ├── models/            # TypeScript interfaces
│   └── modules/           # Feature modules
├── assets/                # Static assets
└── environments/          # Environment configurations
```

## 🎨 Design Requirements

### Homepage Features
- Unique logo in red, blue, and white colors
- Long, fancy, and modern design
- Feature presentations with images and videos
- Two bold call-to-action buttons (top and middle/bottom)
- Pop-up request forms
- Sliders and online chat functionality
- Login section for store owner access
- Contact us and about us sections

### RTL Support
- Full Persian/Farsi language support
- Right-to-left text direction
- Proper date and number formatting
- Persian fonts integration

## 🔧 Development

### Available Scripts
```bash
# Development server
ng serve                    # http://localhost:4200

# Build for production
ng build --prod

# Run tests
ng test

# Run e2e tests
ng e2e

# Linting
ng lint

# Code formatting
npm run format
```

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement responsive design
- Ensure accessibility compliance

## 🌐 API Integration

### Base API Endpoints
```typescript
// Authentication
POST /api/v1/mall/auth/request-otp/
POST /api/v1/mall/auth/verify-otp/

// Products
GET /api/v1/mall/product-instances/
POST /api/v1/mall/product-instances/

// Social Integration
POST /api/v1/mall/social/extract/
GET /api/v1/mall/social/latest-posts/

// Analytics
GET /api/v1/store/analytics/dashboard/
```

## 📱 Features Implementation Status

### ✅ Completed
- Basic Angular project structure
- Component architecture
- Service layer setup
- Routing configuration
- Tailwind CSS integration

### 🔄 In Progress
- Homepage implementation
- Authentication pages
- Product management interface
- Dashboard components

### 📋 Planned
- Theme switching system
- Social media integration UI
- Advanced search interface
- Real-time chat widget
- Mobile-responsive design

## 🐛 Known Issues

**Note**: This repository has been cleaned up. The following files were irrelevant and should be removed:
- `french_farsi_translator.py` - Python script not needed in Angular app
- `word_document_generator.py` - Python script not needed in Angular app
- Multiple redundant documentation files

See `DELETE_IRRELEVANT_FILES.md` for complete cleanup tracking.

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t mall-frontend .

# Run container
docker run -p 80:80 mall-frontend
```

### Docker Compose
```bash
# Start all services
docker-compose up -d

# Frontend will be available at http://localhost:4200
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is proprietary software for the Mall e-commerce platform.

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the backend repository: [shop-back](https://github.com/ehsan42324232/shop-back)

---

**Platform**: Mall (مال) - Iranian E-commerce Solution  
**Frontend**: Angular + Tailwind CSS  
**Backend**: Django + PostgreSQL  
**Language**: Persian (Farsi) + RTL Support