// Export specific models to avoid conflicts - Fixed Version

// Bulk Import Models
export { ImportError, BulkImportLog } from './bulk-import-log.model';

// Category Models
export { Category, CategoryTree } from './category.models';

// Product Attribute Models
export { ProductAttribute, AttributeType } from './product-attribute.model';
export { ProductAttributeValue } from './product-attribute-value.model';

// Order Models - with aliased exports to avoid conflicts
export { 
  Order, 
  OrderItem, 
  OrderStatus, 
  PaymentMethod as OrderPaymentMethod, 
  ShippingMethod as OrderShippingMethod, 
  ProductVariant as OrderProductVariant 
} from './order.models';

// Product Models - with aliased exports to avoid conflicts
export { 
  Product, 
  ProductImage, 
  ProductPrice,
  ProductStock,
  ProductSEO,
  ProductVariant as ProductModelVariant,
  ProductCollection,
  ProductFilter,
  ProductListResult,
  ProductReview,
  ProductImportRow,
  ProductExportOptions,
  BulkProductOperation,
  BulkProductResult,
  ProductTemplate,
  ProductWishlist,
  ProductComparison,
  ProductRecommendation,
  RecommendationRequest,
  ProductStatus,
  ProductVisibility,
  ProductAnalytics,
  ProductSortBy,
  ReviewStatus
} from './product.models';

// Store Models - with aliased exports to avoid conflicts
export { 
  Store, 
  StoreSettings, 
  StoreTheme, 
  StoreAnalytics,
  PaymentMethod as StorePaymentMethod,
  ShippingMethod as StoreShippingMethod,
  StoreStatus,
  StoreTemplate,
  StoreAddress,
  StoreFeatures,
  ChatSettings,
  ThemeLayout,
  ThemeColors,
  ThemeTypography,
  ThemeComponents,
  CategoryAttribute,
  AttributeOption,
  AttributeValidation,
  ExcelImportRequest,
  ImportOptions,
  ExcelImportResult,
  ImportWarning,
  BulkOperation,
  ChatMessage,
  ChatAttachment,
  ChatSession,
  ChatAnalytics,
  ProductSalesData
} from './store.models';

// Enhanced User model for multi-tenant architecture
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'store_owner' | 'customer';
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  
  // Store associations
  ownedStores?: string[]; // Store IDs
  
  // Preferences
  preferences: {
    language: string;
    timezone: string;
    currency: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  
  // Authentication
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Legacy User interface for backward compatibility
export interface LegacyUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

// Authentication models
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  agreedToTerms: boolean;
}

export interface AuthResponse {
  token: string;
  user: User | LegacyUser;
}

// Legacy models for backward compatibility
export interface LegacyStore {
  id: number;
  name: string;
  description: string;
  domain: string;
  created_at: string;
  owner: LegacyUser;
  products_count: number;
}

export interface LegacyCategory {
  id: number;
  name: string;
  store: number;
  products_count: number;
}

export interface Media {
  id: number;
  media_type: 'image' | 'video';
  file: string;
}

export interface Comment {
  id: number;
  user: LegacyUser;
  text: string;
  created_at: string;
}

export interface Rating {
  id: number;
  user: LegacyUser;
  score: number;
}

export interface LegacyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
  category: LegacyCategory;
  media: Media[];
  average_rating: number;
  rating_count: number;
  comments?: Comment[];
  ratings?: Rating[];
}

// Basket models
export interface BasketItem {
  id: number;
  product: LegacyProduct;
  product_id: number;
  quantity: number;
  total_price: number;
}

// Legacy Order models
export interface LegacyOrderItem {
  id: number;
  product: LegacyProduct;
  quantity: number;
  price_at_order: number;
}

export interface LegacyOrder {
  id: number;
  user: LegacyUser;
  store: LegacyStore;
  created_at: string;
  is_paid: boolean;
  logistics_status: string;
  items: LegacyOrderItem[];
  total_amount: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: { [key: string]: string[] };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Legacy API Response for backward compatibility
export interface LegacyApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error handling
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface ApiError {
  error: string;
  details?: any;
}

// File upload
export interface FileUploadResponse {
  success: boolean;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// Search and filter
export interface SearchQuery {
  query?: string;
  filters?: { [key: string]: any };
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  page?: number;
  limit?: number;
}

// Notification models
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// System settings
export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  supportEmail: string;
  supportPhone: string;
  
  // Features
  features: {
    allowRegistration: boolean;
    allowGuestCheckout: boolean;
    requireEmailVerification: boolean;
    requirePhoneVerification: boolean;
  };
  
  // Limits
  defaultLimits: {
    maxStoresPerUser: number;
    maxProductsPerStore: number;
    maxCategoriesPerStore: number;
    maxFileUploadSize: number; // in MB
  };
  
  // Payment
  paymentGateways: {
    id: string;
    name: string;
    enabled: boolean;
    config: any;
  }[];
  
  // Email
  emailSettings: {
    provider: 'smtp' | 'sendgrid' | 'mailgun';
    config: any;
  };
  
  // Storage
  storageSettings: {
    provider: 'local' | 's3' | 'cloudinary';
    config: any;
  };
}

// Dashboard metrics
export interface DashboardMetrics {
  totalStores: number;
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  
  // Growth metrics
  growth: {
    stores: number; // percentage
    users: number;
    products: number;
    orders: number;
    revenue: number;
  };
  
  // Recent activity
  recentStores: any[];
  recentUsers: User[];
  recentOrders: any[];
  
  // Popular categories
  popularCategories: {
    categoryId: string;
    categoryName: string;
    productCount: number;
    orderCount: number;
  }[];
}
