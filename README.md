# Mall (مال) - Online Store Builder Platform

🏪 **Build Your Online Store with Ease**

Mall is a comprehensive e-commerce platform designed specifically for the Iranian market, enabling store owners to create and manage their online stores through an intuitive platform entirely in Farsi.

## ✨ Key Features

### 🛍️ **Complete Store Solution**
- Modern, responsive design optimized for Persian content
- Advanced product management with hierarchical attributes
- Real-time inventory tracking
- Multi-level categorization system
- Mobile-optimized shopping experience

### 📱 **Social Media Integration**
- Import content directly from Instagram and Telegram
- Automatic product description generation
- Image and video import from social posts
- Latest posts and stories integration

### 💳 **Iranian Market Ready**
- Integration with Iranian payment gateways
- Connection to major Iranian logistics providers
- SMS marketing campaigns
- OTP authentication system

### 🎨 **Store Customization**
- Multiple themes and layouts
- Real-time design changes
- Independent domain options
- Custom branding capabilities

### 📊 **Analytics & Insights**
- Comprehensive sales dashboards
- Website traffic analytics
- Customer behavior insights
- Revenue tracking

## 🏗️ Technical Stack

### Frontend
- **Angular 15+** - Modern web framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **PrimeNG** - UI component library
- **RxJS** - Reactive programming

### Backend Integration
- RESTful API architecture
- Django REST Framework backend
- Real-time data synchronization
- Secure authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Angular CLI 15+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/ehsan42324232/shop-front.git
cd shop-front

# Install dependencies
npm install

# Start development server
ng serve

# Navigate to http://localhost:4200
```

### Development Commands

```bash
# Development server
ng serve

# Build for production
ng build --prod

# Run tests
ng test

# Generate component
ng generate component component-name
```

## 🎨 Design System

### Brand Colors
- **Primary**: Red (#DC2626)
- **Secondary**: Blue (#2563EB)
- **Accent**: White (#FFFFFF)
- **Background**: Modern gradients

### Persian Typography
- **Font Family**: Vazir, Tahoma, system fonts
- **Direction**: RTL (Right-to-Left)
- **Headings**: Bold, gradient effects
- **Content**: Clean, readable Persian text

## 🔧 Configuration

### Environment Setup

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  platformName: 'Mall',
  language: 'fa',
  direction: 'rtl'
};
```

## 📦 Deployment

### Production Build

```bash
# Build for production
ng build --prod

# Deploy to hosting platform
# Files will be in dist/ folder
```

### Supported Platforms
- Vercel
- Netlify
- AWS S3 + CloudFront
- Iranian hosting providers

## 🧪 Testing

```bash
# Run unit tests
ng test

# Run e2e tests
ng e2e

# Generate coverage report
ng test --code-coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

### Code Standards
- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful commit messages
- Add tests for new features
- Maintain Persian language consistency

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/ehsan42324232/shop-front/issues)
- **Documentation**: Project Wiki
- **Email**: support@mall.ir

## 🗺️ Roadmap

### Current Phase
- [x] Core platform structure
- [x] Store management system
- [x] Product management
- [ ] Social media integration
- [ ] Payment gateway integration
- [ ] Analytics dashboard

### Future Enhancements
- [ ] Advanced analytics
- [ ] Mobile application
- [ ] AI-powered recommendations
- [ ] Multi-language support

---

**Built with ❤️ for Iranian entrepreneurs**

*Mall (مال) - Where online stores come to life*