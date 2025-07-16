// Enhanced Product models with dynamic attributes

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  sku: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  stock: number;
  track_inventory: boolean;
  weight?: number;
  dimensions?: ProductDimensions;
  category_id: number;
  category: Category;
  category_path: Category[]; // Full category hierarchy
  store_id: number;
  media: ProductMedia[];
  attributes: ProductAttribute[];
  variants?: ProductVariant[];
  seo_settings: ProductSEO;
  status: 'draft' | 'active' | 'archived';
  is_featured: boolean;
  tags: string[];
  average_rating: number;
  rating_count: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface ProductMedia {
  id: number;
  media_type: 'image' | 'video';
  file: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductAttribute {
  id: number;
  attribute_definition_id: number;
  attribute_name: string;
  attribute_type: AttributeType;
  value: any;
  display_value: string;
}

export interface AttributeDefinition {
  id: number;
  name: string;
  type: AttributeType;
  is_required: boolean;
  is_filterable: boolean;
  is_searchable: boolean;
  options?: AttributeOption[];
  validation_rules?: any;
  store_id: number;
  created_at: string;
}

export interface AttributeOption {
  id: number;
  value: string;
  display_value: string;
  sort_order: number;
}

export type AttributeType = 
  | 'text' 
  | 'number' 
  | 'boolean' 
  | 'select' 
  | 'multiselect' 
  | 'date' 
  | 'color' 
  | 'file';

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  stock: number;
  attributes: { [key: string]: any };
  image?: string;
  is_active: boolean;
}

export interface ProductSEO {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  short_description?: string;
  sku: string;
  price: number;
  compare_price?: number;
  stock: number;
  category_id: number;
  attributes: { [key: number]: any };
  media?: File[];
  tags?: string[];
  seo_settings?: ProductSEO;
  status: 'draft' | 'active';
}

export interface BulkImportProduct {
  title: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  category_path: string; // e.g., "Electronics > Phones > Smartphones"
  attributes: { [key: string]: any };
  tags?: string;
  image_urls?: string[];
}
