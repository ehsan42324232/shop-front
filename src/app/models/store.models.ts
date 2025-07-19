// Store models for multi-tenant architecture

export interface Store {
  id: string;
  name: string;
  subdomain: string; // e.g., "store1.toolbox.com"
  customDomain?: string; // e.g., "mystore.ir"
  ownerId: string;
  
  // Store Configuration
  settings: StoreSettings;
  theme: StoreTheme;
  
  // Status
  status: StoreStatus;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreSettings {
  // Basic Info
  displayName: string;
  description?: string;
  contactEmail: string;
  contactPhone: string;
  address?: StoreAddress;
  
  // SEO Settings
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  
  // Business Settings
  currency: string; // 'IRR', 'USD', etc.
  timezone: string;
  language: string; // 'fa', 'en', etc.
  
  // Store Features
  features: StoreFeatures;
  
  // Social Media
  socialMedia?: {
    instagram?: string;
    telegram?: string;
    whatsapp?: string;
    website?: string;
  };
}

export interface StoreAddress {
  country: string;
  state: string;
  city: string;
  street: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface StoreFeatures {
  // Order Management
  enableOrders: boolean;
  enableGuestCheckout: boolean;
  requirePhoneVerification: boolean;
  
  // Payment Options
  paymentMethods: PaymentMethod[];
  
  // Shipping
  enableShipping: boolean;
  shippingMethods: ShippingMethod[];
  
  // Inventory
  trackInventory: boolean;
  allowBackorders: boolean;
  
  // Customer Features
  enableReviews: boolean;
  enableWishlist: boolean;
  enableCompare: boolean;
  
  // Analytics
  enableAnalytics: boolean;
  googleAnalyticsId?: string;
  
  // Chat Support
  enableLiveChat: boolean;
  chatProvider?: 'internal' | 'telegram' | 'whatsapp' | 'custom';
  chatSettings?: ChatSettings;
}

export interface ChatSettings {
  // Internal chat settings
  autoReply?: {
    enabled: boolean;
    message: string;
    workingHours?: {
      enabled: boolean;
      start: string; // HH:mm format
      end: string;
      days: number[]; // 0-6, Sunday=0
      timezone: string;
    };
  };
  
  // Telegram integration
  telegram?: {
    botToken?: string;
    chatId?: string;
    enabled: boolean;
  };
  
  // WhatsApp integration
  whatsapp?: {
    phoneNumber: string;
    enabled: boolean;
    autoMessage?: string;
  };
  
  // Custom chat widget
  customWidget?: {
    embedCode: string;
    enabled: boolean;
  };
  
  // Chat appearance
  appearance: {
    position: 'bottom-right' | 'bottom-left' | 'bottom-center';
    primaryColor: string;
    textColor: string;
    welcomeMessage: string;
    placeholder: string;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank_transfer' | 'cash_on_delivery' | 'online_gateway' | 'crypto';
  enabled: boolean;
  config: any; // Payment-specific configuration
}

export interface ShippingMethod {
  id: string;
  name: string;
  type: 'fixed' | 'weight_based' | 'location_based' | 'free';
  cost: number;
  freeThreshold?: number; // Free shipping above this amount
  estimatedDays: number;
  enabled: boolean;
}

export interface StoreTheme {
  id: string;
  name: string;
  type: 'preset' | 'custom';
  
  // Layout Configuration
  layout: ThemeLayout;
  
  // Color Scheme
  colors: ThemeColors;
  
  // Typography
  typography: ThemeTypography;
  
  // Components
  components: ThemeComponents;
  
  // Custom CSS
  customCss?: string;
}

export interface ThemeLayout {
  headerStyle: 'simple' | 'modern' | 'classic' | 'minimal';
  footerStyle: 'simple' | 'detailed' | 'minimal';
  productGridCols: 2 | 3 | 4 | 6;
  showBreadcrumbs: boolean;
  showSearchBar: boolean;
  showCartIcon: boolean;
  showWishlistIcon: boolean;
  showChatWidget: boolean;
  
  // Homepage Layout
  homepage: {
    showHeroBanner: boolean;
    showFeaturedProducts: boolean;
    showCategories: boolean;
    showTestimonials: boolean;
    showAbout: boolean;
  };
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeTypography {
  primaryFont: string;
  secondaryFont?: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

export interface ThemeComponents {
  buttons: {
    style: 'rounded' | 'square' | 'pill';
    size: 'sm' | 'md' | 'lg';
  };
  cards: {
    style: 'flat' | 'shadow' | 'border' | 'elevated';
    rounded: boolean;
  };
  navigation: {
    style: 'horizontal' | 'sidebar' | 'mega';
    position: 'top' | 'sticky' | 'fixed';
  };
}

export type StoreStatus = 'active' | 'inactive' | 'suspended' | 'pending_setup';

// Store Template (for quick setup)
export interface StoreTemplate {
  id: string;
  name: string;
  description: string;
  preview: string; // URL to preview image
  category: string; // 'fashion', 'electronics', 'food', etc.
  theme: StoreTheme;
  sampleCategories: CategoryTree[];
  sampleProducts: any[];
}

// Analytics & Statistics
export interface StoreAnalytics {
  storeId: string;
  period: 'day' | 'week' | 'month' | 'year';
  
  // Traffic
  visitors: number;
  pageViews: number;
  uniqueVisitors: number;
  
  // Sales
  orders: number;
  revenue: number;
  averageOrderValue: number;
  conversionRate: number;
  
  // Products
  topProducts: ProductSalesData[];
  lowStockProducts: string[]; // Product IDs
  
  // Geographic data
  visitorsByCountry: { [country: string]: number };
  
  // Time-based data
  hourlyTraffic: { [hour: string]: number };
  
  // Chat metrics
  chatSessions: number;
  averageResponseTime: number; // in minutes
  customerSatisfaction: number; // 1-5 rating
  
  // Timestamps
  calculatedAt: Date;
}

export interface ProductSalesData {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
}

// Category Tree Structure (up to 10 levels)
export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  level: number; // 0-9 (max 10 levels)
  order: number;
  isActive: boolean;
  
  // Dynamic Attributes for this category
  attributes: CategoryAttribute[];
  
  // Child categories
  children?: CategoryTree[];
  
  // Store association
  storeId: string;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryAttribute {
  id: string;
  name: string;
  type: AttributeType;
  required: boolean;
  order: number;
  
  // For dropdown/radio/checkbox types
  options?: AttributeOption[];
  
  // Validation rules
  validation?: AttributeValidation;
  
  // Display settings
  showInFilter: boolean;
  showInProductList: boolean;
  showInProductDetail: boolean;
}

export type AttributeType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'decimal' 
  | 'boolean' 
  | 'date' 
  | 'dropdown' 
  | 'radio' 
  | 'checkbox' 
  | 'color' 
  | 'image' 
  | 'file';

export interface AttributeOption {
  id: string;
  value: string;
  label: string;
  color?: string; // For color attributes
  image?: string; // For image-based options
  order: number;
}

export interface AttributeValidation {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string; // Regex pattern
  required?: boolean;
  allowedFileTypes?: string[]; // For file attributes
  maxFileSize?: number; // In bytes
}

// Excel Import/Export Models
export interface ExcelImportRequest {
  storeId: string;
  type: 'categories' | 'products' | 'both';
  file: File;
  options: ImportOptions;
}

export interface ImportOptions {
  updateExisting: boolean;
  createMissingCategories: boolean;
  validateData: boolean;
  skipErrors: boolean;
  
  // Column mapping (Excel column -> system field)
  columnMapping: { [excelColumn: string]: string };
}

export interface ExcelImportResult {
  success: boolean;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  
  // Created entities
  createdCategories: number;
  createdProducts: number;
  updatedCategories: number;
  updatedProducts: number;
}

export interface ImportError {
  row: number;
  column?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ImportWarning {
  row: number;
  column?: string;
  message: string;
  suggestion?: string;
}

// Bulk Operations
export interface BulkOperation {
  id: string;
  storeId: string;
  type: 'import' | 'export' | 'update' | 'delete';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  
  // Progress tracking
  totalItems: number;
  processedItems: number;
  
  // Results
  result?: ExcelImportResult;
  
  // File references
  inputFile?: string; // File path or URL
  outputFile?: string; // Generated file path or URL
  
  // Timestamps
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  
  // Error handling
  error?: string;
}

// Theme Presets (simplified - no subscription restrictions)
export const THEME_PRESETS: { [key: string]: Partial<StoreTheme> } = {
  modern: {
    name: 'مدرن',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    },
    typography: {
      primaryFont: 'Inter',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    }
  },
  classic: {
    name: 'کلاسیک',
    colors: {
      primary: '#1F2937',
      secondary: '#6B7280',
      accent: '#D97706',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#4B5563',
      border: '#D1D5DB',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#2563EB'
    }
  },
  minimal: {
    name: 'مینیمال',
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#FF6B6B',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      text: '#000000',
      textSecondary: '#666666',
      border: '#E0E0E0',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#2196F3'
    }
  },
  vibrant: {
    name: 'پررنگ',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    }
  }
};

// Chat Message Models
export interface ChatMessage {
  id: string;
  storeId: string;
  sessionId: string;
  
  // Message content
  type: 'text' | 'image' | 'file' | 'system';
  content: string;
  attachments?: ChatAttachment[];
  
  // Sender info
  senderId: string;
  senderType: 'customer' | 'admin' | 'system';
  senderName: string;
  
  // Status
  status: 'sent' | 'delivered' | 'read';
  
  // Timestamps
  sentAt: Date;
  readAt?: Date;
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface ChatSession {
  id: string;
  storeId: string;
  
  // Customer info
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  
  // Session details
  status: 'active' | 'closed' | 'waiting';
  lastMessage?: string;
  lastMessageAt?: Date;
  
  // Assigned agent
  assignedTo?: string;
  assignedAt?: Date;
  
  // Metadata
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  
  // Timestamps
  startedAt: Date;
  endedAt?: Date;
  
  // Rating
  rating?: number; // 1-5
  feedback?: string;
}

// Chat Statistics
export interface ChatAnalytics {
  storeId: string;
  period: 'day' | 'week' | 'month';
  
  // Volume metrics
  totalSessions: number;
  activeSessions: number;
  messagesCount: number;
  
  // Performance metrics
  averageResponseTime: number; // in minutes
  averageSessionDuration: number; // in minutes
  firstResponseTime: number; // in minutes
  
  // Satisfaction metrics
  customerSatisfaction: number; // average rating 1-5
  ratingsCount: number;
  
  // Conversion metrics
  sessionsWithPurchase: number;
  conversionRate: number;
  
  // Agent performance
  agentStats: {
    agentId: string;
    agentName: string;
    sessionsHandled: number;
    averageResponseTime: number;
    customerRating: number;
  }[];
}
