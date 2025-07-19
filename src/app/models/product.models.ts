// Enhanced Product models for flexible attribute system

export interface Product {
  id: string;
  storeId: string;
  
  // Fixed default attributes (always present)
  name: string;
  price: number;
  count: number; // inventory count
  
  // Basic product info
  description?: string;
  shortDescription?: string;
  sku?: string;
  barcode?: string;
  
  // Categories (can belong to multiple categories in the tree)
  categories: string[]; // Array of category IDs
  primaryCategoryId: string; // Main category for navigation
  
  // Dynamic Attributes (up to 50 per product)
  attributes: ProductAttributeValue[];
  
  // Media
  images: ProductImage[];
  videos: ProductVideo[]; // Support for multiple videos
  documents?: ProductDocument[];
  
  // Pricing & Inventory
  comparePrice?: number; // Original price for discount display
  costPrice?: number; // Cost price (for profit calculations)
  weight?: number; // in grams
  dimensions?: ProductDimensions;
  
  // Variants (for products with multiple options like size, color)
  variants?: ProductVariant[];
  hasVariants: boolean;
  
  // SEO & Marketing
  seo: ProductSEO;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  
  // Status & Visibility
  status: ProductStatus;
  visibility: ProductVisibility;
  
  // Analytics
  analytics: ProductAnalytics;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  
  // Relations
  relatedProducts?: string[]; // Product IDs
  crossSellProducts?: string[]; // Product IDs
  upSellProducts?: string[]; // Product IDs
}

export interface ProductAttributeValue {
  attributeId: string;
  attributeName: string;
  attributeType: AttributeType;
  value: any; // The actual value based on attribute type
  displayValue?: string; // Formatted value for display
  
  // For file/image attributes
  files?: ProductFile[];
  
  // For multi-select attributes
  values?: any[];
}

export interface ProductFile {
  id: string;
  url: string;
  filename: string;
  size: number; // in bytes
  mimeType: string;
  alt?: string; // For images
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  isPrimary: boolean;
  
  // Image metadata
  width?: number;
  height?: number;
  size?: number; // in bytes
  
  // Thumbnails
  thumbnails?: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface ProductVideo {
  id: string;
  url: string;
  title: string;
  type: 'youtube' | 'vimeo' | 'upload' | 'instagram' | 'tiktok';
  thumbnail?: string;
  duration?: number; // in seconds
  order: number;
  
  // Video metadata
  width?: number;
  height?: number;
  size?: number; // in bytes for uploaded videos
  
  // Platform specific data
  platformData?: {
    videoId?: string; // for YouTube, Vimeo
    embedCode?: string; // for custom embeds
    originalUrl?: string; // original social media link
  };
  
  // Video settings
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  
  // Video quality options for uploaded videos
  qualities?: {
    '360p'?: string;
    '480p'?: string;
    '720p'?: string;
    '1080p'?: string;
  };
}

export interface ProductDocument {
  id: string;
  url: string;
  filename: string;
  title: string;
  type: 'pdf' | 'doc' | 'excel' | 'image' | 'other';
  size: number; // in bytes
  order: number;
}

export interface ProductDimensions {
  length: number; // in cm
  width: number; // in cm
  height: number; // in cm
  unit: 'cm' | 'mm' | 'inch';
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price?: number; // If different from base price
  comparePrice?: number;
  count: number; // Inventory for this variant
  
  // Variant-specific attributes
  attributes: ProductAttributeValue[];
  
  // Media specific to this variant
  images?: ProductImage[];
  videos?: ProductVideo[];
  
  // Status
  isActive: boolean;
  order: number;
}

export interface ProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  slug: string;
  ogImage?: string;
  
  // Schema.org structured data
  schema?: {
    brand?: string;
    model?: string;
    gtin?: string; // Global Trade Item Number
    mpn?: string; // Manufacturer Part Number
  };
}

export type ProductStatus = 'draft' | 'active' | 'inactive' | 'archived' | 'out_of_stock';
export type ProductVisibility = 'public' | 'private' | 'hidden' | 'password_protected';

export interface ProductAnalytics {
  views: number;
  sales: number;
  revenue: number;
  averageRating?: number;
  reviewCount: number;
  wishlistCount: number;
  
  // Performance metrics
  conversionRate?: number;
  bounceRate?: number;
  timeOnPage?: number; // in seconds
  
  // Video engagement metrics
  videoViews?: number;
  videoCompletionRate?: number;
  averageWatchTime?: number;
  
  // Last updated
  lastViewedAt?: Date;
  lastSoldAt?: Date;
  lastUpdatedAt?: Date;
}

// Product Filters for search and listing
export interface ProductFilter {
  storeId: string;
  categoryIds?: string[];
  
  // Price range
  minPrice?: number;
  maxPrice?: number;
  
  // Status filters
  status?: ProductStatus[];
  visibility?: ProductVisibility[];
  
  // Boolean filters
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  hasStock?: boolean;
  hasVideos?: boolean; // Filter products with videos
  
  // Attribute filters (dynamic based on category)
  attributes?: AttributeFilter[];
  
  // Search
  searchQuery?: string;
  tags?: string[];
  
  // Sorting
  sortBy?: ProductSortBy;
  sortOrder?: 'asc' | 'desc';
  
  // Pagination
  page?: number;
  limit?: number;
}

export interface AttributeFilter {
  attributeId: string;
  attributeName: string;
  attributeType: AttributeType;
  
  // For different attribute types
  value?: any;
  values?: any[]; // For multi-select
  minValue?: number; // For numeric ranges
  maxValue?: number; // For numeric ranges
  contains?: string; // For text search
}

export type ProductSortBy = 
  | 'name' 
  | 'price' 
  | 'created_at' 
  | 'updated_at' 
  | 'sales' 
  | 'views' 
  | 'rating' 
  | 'popularity' 
  | 'stock'
  | 'random';

// Product listing result
export interface ProductListResult {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  
  // Facets for filtering
  facets: ProductFacet[];
}

export interface ProductFacet {
  attributeId: string;
  attributeName: string;
  attributeType: AttributeType;
  options: FacetOption[];
}

export interface FacetOption {
  value: any;
  label: string;
  count: number; // Number of products with this value
  selected: boolean;
}

// Product Review & Rating
export interface ProductReview {
  id: string;
  productId: string;
  storeId: string;
  
  // Customer info
  customerName: string;
  customerEmail?: string;
  customerId?: string;
  
  // Review content
  rating: number; // 1-5
  title?: string;
  comment?: string;
  
  // Media
  images?: ProductImage[];
  videos?: ProductVideo[];
  
  // Verification
  isVerifiedPurchase: boolean;
  orderItemId?: string;
  
  // Status
  status: ReviewStatus;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Moderation
  moderatedBy?: string;
  moderationNote?: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'spam';

// Product Import/Export for Excel
export interface ProductImportRow {
  // Fixed fields
  name: string;
  price: number;
  count: number;
  
  // Optional basic fields
  description?: string;
  sku?: string;
  barcode?: string;
  
  // Categories (can be multiple, separated by |)
  categories: string; // "Category1|Category2|Category3"
  primaryCategory: string;
  
  // Dynamic attributes (column names will be attribute names)
  [attributeName: string]: any;
  
  // Media URLs (separated by |)
  images?: string; // "url1|url2|url3"
  videos?: string; // "url1|url2|url3"
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  slug?: string;
  
  // Status
  status?: string;
  visibility?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  
  // Tags (separated by |)
  tags?: string; // "tag1|tag2|tag3"
}

export interface ProductExportOptions {
  storeId: string;
  includeCategories?: string[]; // Category IDs to filter
  includeStatus?: ProductStatus[];
  includeVariants?: boolean;
  includeImages?: boolean;
  includeVideos?: boolean; // Include video URLs in export
  includeCustomAttributes?: boolean;
  
  // Format options
  format: 'xlsx' | 'csv';
  encoding?: 'utf8' | 'utf16';
  
  // Date range
  dateFrom?: Date;
  dateTo?: Date;
}

// Bulk Product Operations
export interface BulkProductOperation {
  operation: 'update' | 'delete' | 'activate' | 'deactivate' | 'feature' | 'unfeature';
  productIds: string[];
  
  // For update operations
  updateData?: Partial<Product>;
  
  // For attribute updates
  attributeUpdates?: {
    attributeId: string;
    value: any;
  }[];
}

export interface BulkProductResult {
  success: boolean;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: {
    productId: string;
    error: string;
  }[];
}

// Product Templates (for quick product creation)
export interface ProductTemplate {
  id: string;
  name: string;
  description: string;
  storeId: string;
  categoryId: string;
  
  // Template data
  template: Partial<Product>;
  
  // Default attributes for this template
  defaultAttributes: {
    attributeId: string;
    defaultValue: any;
  }[];
  
  // Usage stats
  usageCount: number;
  lastUsedAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Product Wishlist
export interface ProductWishlist {
  id: string;
  storeId: string;
  customerId?: string;
  sessionId?: string; // For guest users
  
  items: WishlistItem[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistItem {
  id: string;
  productId: string;
  variantId?: string;
  addedAt: Date;
  
  // Notification preferences
  notifyOnPriceChange?: boolean;
  notifyOnBackInStock?: boolean;
}

// Product Comparison
export interface ProductComparison {
  id: string;
  storeId: string;
  customerId?: string;
  sessionId?: string; // For guest users
  
  productIds: string[];
  
  // Comparison settings
  compareAttributes: string[]; // Attribute IDs to compare
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Product Recommendation Engine
export interface ProductRecommendation {
  type: 'related' | 'cross_sell' | 'up_sell' | 'recently_viewed' | 'trending' | 'personalized';
  products: Product[];
  score: number; // Recommendation confidence score
  reason?: string; // Why this product is recommended
}

export interface RecommendationRequest {
  storeId: string;
  customerId?: string;
  productId?: string; // For related/cross-sell/up-sell
  categoryId?: string;
  limit?: number;
  excludeProductIds?: string[];
}

// Video Processing Status
export interface VideoProcessingStatus {
  id: string;
  productId: string;
  videoId: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  error?: string;
  
  // Processing details
  processingSteps: {
    step: 'upload' | 'thumbnail' | 'compression' | 'quality_variants';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
  }[];
  
  // Output files
  outputFiles?: {
    thumbnail: string;
    preview: string;
    qualities: { [quality: string]: string };
  };
}

// Export all necessary types from store models
export type { AttributeType, CategoryTree, CategoryAttribute, AttributeOption, AttributeValidation } from './store.models';
