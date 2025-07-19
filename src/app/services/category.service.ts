import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { 
  CategoryTree, 
  CategoryAttribute, 
  AttributeType,
  AttributeOption,
  ExcelImportResult,
  ImportOptions
} from '../models/store.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrl;
  private categoriesSubject = new BehaviorSubject<CategoryTree[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Category CRUD Operations
  getCategories(storeId: string, includeAttributes = true): Observable<CategoryTree[]> {
    return this.http.get<CategoryTree[]>(`${this.apiUrl}/stores/${storeId}/categories`, {
      params: { includeAttributes: includeAttributes.toString() }
    }).pipe(
      tap(categories => this.categoriesSubject.next(categories))
    );
  }

  getCategoryTree(storeId: string): Observable<CategoryTree[]> {
    return this.http.get<CategoryTree[]>(`${this.apiUrl}/stores/${storeId}/categories/tree`).pipe(
      map(categories => this.buildCategoryTree(categories)),
      tap(categories => this.categoriesSubject.next(categories))
    );
  }

  getCategory(storeId: string, categoryId: string): Observable<CategoryTree> {
    return this.http.get<CategoryTree>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}`);
  }

  createCategory(storeId: string, category: Partial<CategoryTree>): Observable<CategoryTree> {
    return this.http.post<CategoryTree>(`${this.apiUrl}/stores/${storeId}/categories`, category).pipe(
      tap(() => this.refreshCategories(storeId))
    );
  }

  updateCategory(storeId: string, categoryId: string, updates: Partial<CategoryTree>): Observable<CategoryTree> {
    return this.http.put<CategoryTree>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}`, updates).pipe(
      tap(() => this.refreshCategories(storeId))
    );
  }

  deleteCategory(storeId: string, categoryId: string, moveProductsTo?: string): Observable<void> {
    const params: any = {};
    if (moveProductsTo) {
      params.moveProductsTo = moveProductsTo;
    }
    
    return this.http.delete<void>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}`, { params }).pipe(
      tap(() => this.refreshCategories(storeId))
    );
  }

  // Category Hierarchy Management
  reorderCategories(storeId: string, categoryUpdates: { id: string; order: number; parentId?: string }[]): Observable<CategoryTree[]> {
    return this.http.put<CategoryTree[]>(`${this.apiUrl}/stores/${storeId}/categories/reorder`, { categoryUpdates }).pipe(
      tap(categories => this.categoriesSubject.next(categories))
    );
  }

  moveCategory(storeId: string, categoryId: string, newParentId?: string, newOrder?: number): Observable<CategoryTree> {
    return this.http.put<CategoryTree>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}/move`, {
      newParentId,
      newOrder
    }).pipe(
      tap(() => this.refreshCategories(storeId))
    );
  }

  getCategoryPath(storeId: string, categoryId: string): Observable<CategoryTree[]> {
    return this.http.get<CategoryTree[]>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}/path`);
  }

  getCategoryChildren(storeId: string, categoryId: string, maxLevel?: number): Observable<CategoryTree[]> {
    const params: any = {};
    if (maxLevel !== undefined) {
      params.maxLevel = maxLevel.toString();
    }
    return this.http.get<CategoryTree[]>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}/children`, { params });
  }

  // Attribute Management
  getCategoryAttributes(storeId: string, categoryId: string): Observable<CategoryAttribute[]> {
    return this.http.get<CategoryAttribute[]>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}/attributes`);
  }

  addCategoryAttribute(storeId: string, categoryId: string, attribute: Partial<CategoryAttribute>): Observable<CategoryAttribute> {
    return this.http.post<CategoryAttribute>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}/attributes`, attribute);
  }

  updateCategoryAttribute(storeId: string, categoryId: string, attributeId: string, updates: Partial<CategoryAttribute>): Observable<CategoryAttribute> {
    return this.http.put<CategoryAttribute>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}/attributes/${attributeId}`, updates);
  }

  deleteCategoryAttribute(storeId: string, categoryId: string, attributeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}/attributes/${attributeId}`);
  }

  reorderCategoryAttributes(storeId: string, categoryId: string, attributeOrders: { attributeId: string; order: number }[]): Observable<CategoryAttribute[]> {
    return this.http.put<CategoryAttribute[]>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}/attributes/reorder`, { attributeOrders });
  }

  // Attribute Options Management
  addAttributeOption(storeId: string, categoryId: string, attributeId: string, option: Partial<AttributeOption>): Observable<AttributeOption> {
    return this.http.post<AttributeOption>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}/attributes/${attributeId}/options`, option);
  }

  updateAttributeOption(storeId: string, categoryId: string, attributeId: string, optionId: string, updates: Partial<AttributeOption>): Observable<AttributeOption> {
    return this.http.put<AttributeOption>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}/attributes/${attributeId}/options/${optionId}`, updates);
  }

  deleteAttributeOption(storeId: string, categoryId: string, attributeId: string, optionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}/attributes/${attributeId}/options/${optionId}`);
  }

  // Excel Import/Export
  exportCategoriesToExcel(storeId: string, includeAttributes = true): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/stores/${storeId}/categories/export`, {
      params: { includeAttributes: includeAttributes.toString() },
      responseType: 'blob'
    });
  }

  importCategoriesFromExcel(storeId: string, file: File, options: ImportOptions): Observable<ExcelImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));
    
    return this.http.post<ExcelImportResult>(`${this.apiUrl}/stores/${storeId}/categories/import`, formData);
  }

  downloadCategoryTemplate(includeAttributes = true): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/templates/categories`, {
      params: { includeAttributes: includeAttributes.toString() },
      responseType: 'blob'
    });
  }

  validateCategoryExcel(storeId: string, file: File): Observable<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    previewData: any[];
  }> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<any>(`${this.apiUrl}/stores/${storeId}/categories/validate`, formData);
  }

  // Bulk Operations
  bulkUpdateCategories(storeId: string, updates: { categoryId: string; updates: Partial<CategoryTree> }[]): Observable<{
    success: number;
    failed: number;
    errors: any[];
  }> {
    return this.http.put<any>(`${this.apiUrl}/stores/${storeId}/categories/bulk-update`, { updates }).pipe(
      tap(() => this.refreshCategories(storeId))
    );
  }

  bulkDeleteCategories(storeId: string, categoryIds: string[], moveProductsTo?: string): Observable<{
    success: number;
    failed: number;
    errors: any[];
  }> {
    const payload: any = { categoryIds };
    if (moveProductsTo) {
      payload.moveProductsTo = moveProductsTo;
    }
    
    return this.http.post<any>(`${this.apiUrl}/stores/${storeId}/categories/bulk-delete`, payload).pipe(
      tap(() => this.refreshCategories(storeId))
    );
  }

  // Category Analytics
  getCategoryAnalytics(storeId: string, categoryId: string, period: 'week' | 'month' | 'quarter' | 'year'): Observable<{
    productCount: number;
    totalViews: number;
    totalSales: number;
    totalRevenue: number;
    topProducts: any[];
    trafficSources: any[];
  }> {
    return this.http.get<any>(`${this.apiUrl}/stores/${storeId}/categories/${categoryId}/analytics`, {
      params: { period }
    });
  }

  // Search and Filter
  searchCategories(storeId: string, query: string, level?: number): Observable<CategoryTree[]> {
    const params: any = { query };
    if (level !== undefined) {
      params.level = level.toString();
    }
    return this.http.get<CategoryTree[]>(`${this.apiUrl}/stores/${storeId}/categories/search`, { params });
  }

  getCategoriesByLevel(storeId: string, level: number): Observable<CategoryTree[]> {
    return this.http.get<CategoryTree[]>(`${this.apiUrl}/stores/${storeId}/categories/by-level/${level}`);
  }

  // Validation Methods
  validateCategoryName(storeId: string, name: string, parentId?: string, excludeId?: string): Observable<{
    valid: boolean;
    exists: boolean;
    suggestion?: string;
  }> {
    const params: any = { name };
    if (parentId) params.parentId = parentId;
    if (excludeId) params.excludeId = excludeId;
    
    return this.http.get<any>(`${this.apiUrl}/stores/${storeId}/categories/validate-name`, { params });
  }

  validateCategorySlug(storeId: string, slug: string, excludeId?: string): Observable<{
    valid: boolean;
    exists: boolean;
    suggestion?: string;
  }> {
    const params: any = { slug };
    if (excludeId) params.excludeId = excludeId;
    
    return this.http.get<any>(`${this.apiUrl}/stores/${storeId}/categories/validate-slug`, { params });
  }

  // Helper Methods
  private refreshCategories(storeId: string): void {
    this.getCategoryTree(storeId).subscribe();
  }

  private buildCategoryTree(categories: CategoryTree[]): CategoryTree[] {
    const categoryMap = new Map<string, CategoryTree>();
    const rootCategories: CategoryTree[] = [];

    // First pass: create map of all categories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build tree structure
    categories.forEach(category => {
      const categoryNode = categoryMap.get(category.id)!;
      
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parentNode = categoryMap.get(category.parentId)!;
        if (!parentNode.children) {
          parentNode.children = [];
        }
        parentNode.children.push(categoryNode);
      } else {
        rootCategories.push(categoryNode);
      }
    });

    // Sort categories by order
    const sortByOrder = (a: CategoryTree, b: CategoryTree) => a.order - b.order;
    rootCategories.sort(sortByOrder);
    
    categoryMap.forEach(category => {
      if (category.children) {
        category.children.sort(sortByOrder);
      }
    });

    return rootCategories;
  }

  // Category Tree Utilities
  flattenCategoryTree(categories: CategoryTree[]): CategoryTree[] {
    const flattened: CategoryTree[] = [];
    
    const flatten = (cats: CategoryTree[], level = 0) => {
      cats.forEach(category => {
        flattened.push({ ...category, level });
        if (category.children && category.children.length > 0) {
          flatten(category.children, level + 1);
        }
      });
    };
    
    flatten(categories);
    return flattened;
  }

  findCategoryById(categories: CategoryTree[], categoryId: string): CategoryTree | null {
    for (const category of categories) {
      if (category.id === categoryId) {
        return category;
      }
      if (category.children) {
        const found = this.findCategoryById(category.children, categoryId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  getCategoryBreadcrumbs(categories: CategoryTree[], categoryId: string): CategoryTree[] {
    const breadcrumbs: CategoryTree[] = [];
    
    const findPath = (cats: CategoryTree[], targetId: string, path: CategoryTree[]): boolean => {
      for (const category of cats) {
        const currentPath = [...path, category];
        
        if (category.id === targetId) {
          breadcrumbs.push(...currentPath);
          return true;
        }
        
        if (category.children && this.findPath(category.children, targetId, currentPath)) {
          return true;
        }
      }
      return false;
    };
    
    this.findPath = findPath;
    findPath(categories, categoryId, []);
    return breadcrumbs;
  }

  // Attribute Type Utilities
  getAttributeTypes(): { value: AttributeType; label: string; description: string }[] {
    return [
      { value: 'text', label: 'متن', description: 'فیلد متنی ساده' },
      { value: 'textarea', label: 'متن چندخطی', description: 'فیلد متنی با چند خط' },
      { value: 'number', label: 'عدد', description: 'فیلد عددی صحیح' },
      { value: 'decimal', label: 'عدد اعشاری', description: 'فیلد عددی با اعشار' },
      { value: 'boolean', label: 'بله/خیر', description: 'فیلد صحیح یا غلط' },
      { value: 'date', label: 'تاریخ', description: 'فیلد انتخاب تاریخ' },
      { value: 'dropdown', label: 'لیست کشویی', description: 'انتخاب از لیست گزینه‌ها' },
      { value: 'radio', label: 'دکمه رادیویی', description: 'انتخاب یکی از گزینه‌ها' },
      { value: 'checkbox', label: 'چک‌باکس', description: 'انتخاب چندین گزینه' },
      { value: 'color', label: 'رنگ', description: 'انتخاب رنگ' },
      { value: 'image', label: 'تصویر', description: 'آپلود تصویر' },
      { value: 'file', label: 'فایل', description: 'آپلود فایل' }
    ];
  }

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\-آ-ی]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  // Category limit validation
  validateCategoryLimits(storeId: string, parentId?: string): Observable<{
    canAddCategory: boolean;
    maxLevelReached: boolean;
    maxCategoriesReached: boolean;
    currentLevel: number;
    maxLevel: number;
    currentCount: number;
    maxCount: number;
  }> {
    const params: any = {};
    if (parentId) params.parentId = parentId;
    
    return this.http.get<any>(`${this.apiUrl}/stores/${storeId}/categories/validate-limits`, { params });
  }
}
