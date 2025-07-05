# Shop Platform Frontend

Angular-based frontend for a multi-store e-commerce platform.

## Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication**: User registration, login, and secure token management
- **Product Catalog**: Browse products with search, filtering, and pagination
- **Shopping Cart**: Add to cart, quantity management, and checkout
- **Product Reviews**: Rating and commenting system
- **Multi-store Support**: Browse products from different stores
- **Order Management**: Order history and tracking
- **Responsive Design**: Mobile-first approach

## Tech Stack

- **Framework**: Angular 16
- **Styling**: Tailwind CSS
- **State Management**: Services with RxJS
- **HTTP Client**: Angular HttpClient with interceptors
- **Authentication**: Token-based with guards
- **Build Tool**: Angular CLI

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Angular CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ehsan42324232/shop-front.git
cd shop-front
```

2. Install dependencies:
```bash
npm install
```

3. Update environment configuration:
```bash
# Edit src/environments/environment.ts
# Set apiUrl to your backend URL (default: http://localhost:8000/api/)
```

4. Start development server:
```bash
ng serve
```

5. Open browser to `http://localhost:4200`

## Environment Configuration

### Development
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/'
};
```

### Production
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api/'
};
```

## Available Scripts

- `ng serve` - Start development server
- `ng build` - Build for production
- `ng test` - Run unit tests
- `ng lint` - Run linting
- `ng e2e` - Run end-to-end tests

## Project Structure

```
src/
├── app/
│   ├── components/          # UI Components
│   │   ├── auth/           # Authentication components
│   │   ├── product/        # Product-related components
│   │   ├── basket/         # Shopping cart component
│   │   └── shared/         # Shared components
│   ├── services/           # Application services
│   ├── guards/             # Route guards
│   ├── interceptors/       # HTTP interceptors
│   ├── models/             # TypeScript interfaces
│   └── modules/            # Feature modules
├── environments/           # Environment configurations
└── assets/                # Static assets
```

## Key Features

### Authentication
- User registration and login
- Token-based authentication
- Route protection with guards
- Automatic token refresh

### Product Management
- Product listing with pagination
- Advanced search and filtering
- Product detail views
- Image galleries
- Reviews and ratings

### Shopping Experience
- Add to cart functionality
- Quantity management
- Cart persistence
- Checkout process
- Order tracking

### Responsive Design
- Mobile-first approach
- Tailwind CSS utility classes
- Responsive grid layouts
- Touch-friendly interfaces

## API Integration

The frontend integrates with the Django REST API backend:

### Authentication Endpoints
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/logout/` - User logout

### Product Endpoints
- `GET /api/products/` - List products
- `GET /api/products/{id}/` - Get product details
- `POST /api/products/{id}/add_comment/` - Add comment
- `POST /api/products/{id}/add_rating/` - Add rating

### Cart Endpoints
- `GET /api/basket/` - Get cart items
- `POST /api/basket/` - Add to cart
- `PUT /api/basket/{id}/` - Update cart item
- `DELETE /api/basket/{id}/` - Remove from cart

### Order Endpoints
- `GET /api/orders/` - List orders
- `POST /api/orders/` - Create order
- `GET /api/orders/{id}/` - Get order details

## Deployment

### Build for Production
```bash
ng build --configuration production
```

### Docker Deployment
```dockerfile
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=builder /app/dist/shop-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables
- `API_URL` - Backend API URL
- `PRODUCTION` - Production flag

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

### Code Style

This project follows Angular style guidelines:
- Use TypeScript strict mode
- Follow Angular naming conventions
- Use reactive forms
- Implement proper error handling
- Write unit tests for components and services

### Testing

```bash
# Unit tests
ng test

# E2E tests
ng e2e

# Test coverage
ng test --code-coverage
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lazy loading for feature modules
- OnPush change detection strategy
- Image optimization
- Bundle splitting
- Service worker for caching

## Security

- XSS protection
- CSRF protection
- Secure token storage
- Input validation
- Route guards

## License

MIT License

## Support

For support, please open an issue in the GitHub repository.
