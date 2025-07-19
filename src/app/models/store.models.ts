// Store models for multi-tenant architecture

export interface Store {
  id: string;
  name: string;
  subdomain: string; // e.g., "store1.toolbox.com"
  customDomain?: string; // e.g., "mystore.com"
  ownerId: string;
  
  // Store Configuration
  settings: StoreSettings;
  theme: StoreTheme;
  
  // Status
  status: StoreStatus;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Subscription & Billing
  subscription: StoreSubscription;
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

export interface StoreSubscription {
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  trialEndsAt?: Date;
  subscriptionEndsAt?: Date;
  features: {
    maxProducts: number;
    maxCategories: number;
    maxAttributes: number;
    maxStorage: number; // in MB
    customDomain: boolean;
    removeWatermark: boolean;
    prioritySupport: boolean;
  };
}

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
  order: number;
}

export interface AttributeValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string; // regex pattern
  required?: boolean;
}

// Excel Import/Export Models
export interface ExcelImportResult {
  success: boolean;
  totalRows: number;
  successfulRows: number;
  failedRows: ExcelImportError[];
  warnings: ExcelImportWarning[];
  importedData: {
    categories?: CategoryTree[];
    products?: Product[];
    attributes?: CategoryAttribute[];
  };
}

export interface ExcelImportError {
  row: number;
  column?: string;
  message: string;
  data: any;
}

export interface ExcelImportWarning {
  row: number;
  column?: string;
  message: string;
  data: any;
}

export interface ExcelTemplate {
  type: 'categories' | 'products' | 'attributes';
  headers: ExcelHeader[];
  sampleData: any[];
  validationRules: ExcelValidationRule[];
}

export interface ExcelHeader {
  key: string;
  label: string;
  required: boolean;
  type: 'text' | 'number' | 'boolean' | 'date' | 'dropdown';
  description?: string;
  example?: string;
}

export interface ExcelValidationRule {
  column: string;
  rule: 'required' | 'unique' | 'max_length' | 'min_length' | 'numeric' | 'positive' | 'url' | 'email';
  value?: any;
  message: string;
}
