import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: string;
  title: string;
  description: string;
  short_description: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  sku: string;
  barcode: string;
  stock: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  weight?: number;
  dimensions?: string;
  is_active: boolean;
  is_featured: boolean;
  is_digital: boolean;
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  images: ProductImage[];
  attribute_values: ProductAttributeValue[];
  store: Store;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id?: number;
  level: number;
  path: string;
  children?: Category[];
  image?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductAttribute {
  id: number;
  name: string;
  slug: string;
  attribute_type: string;
  is_required: boolean;
  is_filterable: boolean;
  is_searchable: boolean;
  choices: string[];
  unit?: string;
  sort_order: number;
}

export interface ProductAttributeValue {
  id: number;
  attribute: ProductAttribute;
  value: string;
}

export interface Store {
  id: string;
  name: string;
  domain: string;
  currency: string;
  is_active: boolean;
  is_approved: boolean;
}

export interface BulkImportResult {
  status: string;
  message: string;
  details: {
    total_rows: number;
    successful_rows: number;
    failed_rows: number;
    categories_created: number;
    products_created: number;
    products_updated: number;
    errors: any[];
  };
}

export interface ImportLog {
  id: number;
  filename: string;
  status: string;
  total_rows: number;
  successful_rows: number;
  failed_rows: number;
  categories_created: number;
  products_created: number;
  products_updated: number;
  created_at: string;
  error_details: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api`;
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Token ${token}` : ''
    });
  }

  private getUploadHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Token ${token}` : ''
    });
  }

  // ==================== Product Management ====================

  getProducts(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get(`${this.apiUrl}/products/`, { 
      headers: this.getHeaders(),
      params: httpParams 
    });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}/`, {
      headers: this.getHeaders()
    });
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products/`, product, {
      headers: this.getHeaders()
    });
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}/`, product, {
      headers: this.getHeaders()
    });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}/`, {
      headers: this.getHeaders()
    });
  }

  updateProductStock(id: string, stock: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}/update-stock/`, 
      { stock }, 
      { headers: this.getHeaders() }
    );
  }

  // ==================== Product Images ====================

  uploadProductImage(productId: string, image: File, isPrimary: boolean = false): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('is_primary', isPrimary.toString());

    return this.http.post(`${this.apiUrl}/products/${productId}/images/`, formData, {
      headers: this.getUploadHeaders()
    });
  }

  deleteProductImage(productId: string, imageId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${productId}/images/${imageId}/`, {
      headers: this.getHeaders()
    });
  }

  // ==================== Categories ====================

  getCategories(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get(`${this.apiUrl}/categories/`, { 
      headers: this.getHeaders(),
      params: httpParams 
    });
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}/`, {
      headers: this.getHeaders()
    });
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories/`, category, {
      headers: this.getHeaders()
    });
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}/`, category, {
      headers: this.getHeaders()
    });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}/`, {
      headers: this.getHeaders()
    });
  }

  getCategoryProducts(categoryId: number, params?: any): Observable<any> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get(`${this.apiUrl}/categories/${categoryId}/products/`, { 
      headers: this.getHeaders(),
      params: httpParams 
    });
  }

  // ==================== Product Attributes ====================

  getAttributes(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get(`${this.apiUrl}/attributes/`, { 
      headers: this.getHeaders(),
      params: httpParams 
    });
  }

  getAttribute(id: number): Observable<ProductAttribute> {
    return this.http.get<ProductAttribute>(`${this.apiUrl}/attributes/${id}/`, {
      headers: this.getHeaders()
    });
  }

  createAttribute(attribute: Partial<ProductAttribute>): Observable<ProductAttribute> {
    return this.http.post<ProductAttribute>(`${this.apiUrl}/attributes/`, attribute, {
      headers: this.getHeaders()
    });
  }

  updateAttribute(id: number, attribute: Partial<ProductAttribute>): Observable<ProductAttribute> {
    return this.http.put<ProductAttribute>(`${this.apiUrl}/attributes/${id}/`, attribute, {
      headers: this.getHeaders()
    });
  }

  deleteAttribute(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/attributes/${id}/`, {
      headers: this.getHeaders()
    });
  }

  getProductAttributes(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${productId}/attributes/`, {
      headers: this.getHeaders()
    });
  }

  // ==================== Bulk Import/Export ====================

  validateImportFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/import/validate/`, formData, {
      headers: this.getUploadHeaders()
    });
  }

  bulkImportProducts(formData: FormData): Observable<BulkImportResult> {
    return this.http.post<BulkImportResult>(`${this.apiUrl}/import/products/`, formData, {
      headers: this.getUploadHeaders()
    });
  }

  getImportLogs(): Observable<{ import_logs: ImportLog[] }> {
    return this.http.get<{ import_logs: ImportLog[] }>(`${this.apiUrl}/import/logs/`, {
      headers: this.getHeaders()
    });
  }

  getImportLogDetail(logId: number): Observable<{ log: ImportLog }> {
    return this.http.get<{ log: ImportLog }>(`${this.apiUrl}/import/logs/${logId}/`, {
      headers: this.getHeaders()
    });
  }

  deleteImportLog(logId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/import/logs/${logId}/delete/`, {
      headers: this.getHeaders()
    });
  }

  getImportStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/import/statistics/`, {
      headers: this.getHeaders()
    });
  }

  exportProducts(filters?: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export/products/`, filters || {}, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  downloadSampleTemplate(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/import/template/`, {
      responseType: 'blob'
    });
  }

  // ==================== Search & Filtering ====================

  searchProducts(query: string, filters?: any): Observable<any> {
    let httpParams = new HttpParams().set('search', query);
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          httpParams = httpParams.set(key, filters[key]);
        }
      });
    }

    return this.http.get(`${this.apiUrl}/search/`, { 
      headers: this.getHeaders(),
      params: httpParams 
    });
  }

  // ==================== Comments & Ratings ====================

  getProductComments(productId: string, params?: any): Observable<any> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get(`${this.apiUrl}/products/${productId}/comments/`, { 
      headers: this.getHeaders(),
      params: httpParams 
    });
  }

  addProductComment(productId: string, comment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/${productId}/comments/`, comment, {
      headers: this.getHeaders()
    });
  }

  addProductRating(productId: string, rating: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/${productId}/ratings/`, rating, {
      headers: this.getHeaders()
    });
  }

  // ==================== Utility Methods ====================

  updateProductsCache(products: Product[]) {
    this.productsSubject.next(products);
  }

  getCurrentProducts(): Product[] {
    return this.productsSubject.value;
  }

  // Method to handle file downloads
  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Helper method to format price
  formatPrice(price: number, currency: string = 'IRR'): string {
    const formatter = new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(price);
  }

  // Helper method to calculate discount percentage
  calculateDiscountPercentage(price: number, comparePrice: number): number {
    if (!comparePrice || comparePrice <= price) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  }

  // Helper method to check if product is on sale
  isProductOnSale(product: Product): boolean {
    return product.compare_price ? product.price < product.compare_price : false;
  }

  // Helper method to check if product is low stock
  isProductLowStock(product: Product): boolean {
    return product.track_inventory && product.stock <= product.low_stock_threshold;
  }

  // Helper method to check if product is out of stock
  isProductOutOfStock(product: Product): boolean {
    return product.track_inventory && product.stock <= 0;
  }

  // Helper method to get product availability status
  getProductAvailabilityStatus(product: Product): string {
    if (!product.track_inventory) return 'موجود';
    if (product.stock <= 0) return 'ناموجود';
    if (product.stock <= product.low_stock_threshold) return 'موجودی کم';
    return 'موجود';
  }

  // Helper method to validate product data
  validateProductData(product: Partial<Product>): string[] {
    const errors: string[] = [];

    if (!product.title || product.title.trim().length === 0) {
      errors.push('عنوان محصول الزامی است');
    }

    if (!product.price || product.price <= 0) {
      errors.push('قیمت محصول باید بیشتر از صفر باشد');
    }

    if (product.compare_price && product.compare_price <= product.price!) {
      errors.push('قیمت مقایسه باید بیشتر از قیمت فروش باشد');
    }

    if (product.stock !== undefined && product.stock < 0) {
      errors.push('موجودی نمی‌تواند منفی باشد');
    }

    if (product.low_stock_threshold !== undefined && product.low_stock_threshold < 0) {
      errors.push('حد کمبود موجودی نمی‌تواند منفی باشد');
    }

    return errors;
  }

  // Helper method to prepare product for submission
  prepareProductForSubmission(product: Partial<Product>): Partial<Product> {
    const prepared = { ...product };

    // Remove empty strings and set to null
    Object.keys(prepared).forEach(key => {
      if (prepared[key as keyof Product] === '') {
        (prepared as any)[key] = null;
      }
    });

    // Ensure numeric fields are numbers
    if (prepared.price !== undefined) {
      prepared.price = Number(prepared.price);
    }
    if (prepared.compare_price !== undefined) {
      prepared.compare_price = Number(prepared.compare_price);
    }
    if (prepared.cost_price !== undefined) {
      prepared.cost_price = Number(prepared.cost_price);
    }
    if (prepared.stock !== undefined) {
      prepared.stock = Number(prepared.stock);
    }
    if (prepared.low_stock_threshold !== undefined) {
      prepared.low_stock_threshold = Number(prepared.low_stock_threshold);
    }
    if (prepared.weight !== undefined) {
      prepared.weight = Number(prepared.weight);
    }

    return prepared;
  }
}
