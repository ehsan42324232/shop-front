// Enhanced Category models for multi-level hierarchy

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number;
  level: number;
  path: string; // e.g., "Electronics > Phones > Smartphones"
  store_id: number;
  is_active: boolean;
  sort_order: number;
  seo_settings: CategorySEO;
  children?: Category[];
  parent?: Category;
  products_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategorySEO {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}

export interface CategoryTree {
  category: Category;
  children: CategoryTree[];
  depth: number;
}

export interface CategoryHierarchy {
  id: number;
  name: string;
  children: CategoryHierarchy[];
  products_count: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parent_id?: number;
  image?: File;
  is_active: boolean;
  sort_order?: number;
  seo_settings?: CategorySEO;
}
