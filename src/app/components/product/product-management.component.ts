import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SocialContentService } from '../../services/social-content.service';

interface ProductClass {
  id: number;
  name: string;
  description: string;
  parent_id?: number;
  level: number;
  children?: ProductClass[];
  attributes: ProductAttribute[];
  price?: number;
  images: string[];
  videos: string[];
  is_leaf: boolean;
  categorize_by_attribute?: number;
}

interface ProductAttribute {
  id: number;
  name: string;
  type: 'text' | 'color' | 'number' | 'select';
  is_categorizer: boolean;
  is_required: boolean;
  options?: string[];
  default_value?: string;
}

interface ProductInstance {
  id?: number;
  product_class_id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  images: string[];
  videos: string[];
  attributes: { [key: string]: any };
  sku?: string;
  is_active: boolean;
}

@Component({
  selector: 'app-product-management',
  template: `
    <div class="min-h-screen bg-gray-50" dir="rtl">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-gray-900">مدیریت محصولات</h1>
              <span class="mr-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {{totalProducts}} محصول
              </span>
            </div>
            <div class="flex space-x-3 space-x-reverse">
              <button
                (click)="showSocialImport = true"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                📱 دریافت از شبکه‌های اجتماعی
              </button>
              <button
                (click)="createNewProduct()"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                ➕ محصول جدید
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <!-- Sidebar - Product Hierarchy -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">دسته‌بندی محصولات</h2>
              
              <!-- Add Category -->
              <div class="mb-4">
                <button
                  (click)="showCategoryForm = !showCategoryForm"
                  class="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm">
                  ➕ افزودن دسته جدید
                </button>
              </div>

              <!-- Category Form -->
              <div *ngIf="showCategoryForm" class="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <form (ngSubmit)="createCategory()">
                  <div class="space-y-3">
                    <input
                      type="text"
                      [(ngModel)]="newCategory.name"
                      name="categoryName"
                      placeholder="نام دسته"
                      class="w-full p-2 border border-gray-300 rounded text-sm"
                      required>
                    <select
                      [(ngModel)]="newCategory.parent_id"
                      name="parentCategory"
                      class="w-full p-2 border border-gray-300 rounded text-sm">
                      <option value="">دسته اصلی</option>
                      <option *ngFor="let cat of productClasses" [value]="cat.id">{{cat.name}}</option>
                    </select>
                    <div class="flex space-x-2 space-x-reverse">
                      <button
                        type="submit"
                        class="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        ایجاد
                      </button>
                      <button
                        type="button"
                        (click)="showCategoryForm = false"
                        class="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        انصراف
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <!-- Category Tree -->
              <div class="space-y-2">
                <div *ngFor="let category of productClasses" class="category-item">
                  <div
                    (click)="selectCategory(category)"
                    [class.bg-blue-50]="selectedCategory?.id === category.id"
                    [class.border-blue-200]="selectedCategory?.id === category.id"
                    class="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <span class="text-gray-400 ml-2" [style.margin-right.px]="category.level * 20">
                          {{category.level === 0 ? '📁' : '📄'}}
                        </span>
                        <span class="text-sm font-medium text-gray-800">{{category.name}}</span>
                      </div>
                      <div class="flex items-center space-x-1 space-x-reverse">
                        <span class="text-xs text-gray-500" *ngIf="category.children?.length">
                          {{category.children.length}}
                        </span>
                        <button
                          (click)="editCategory(category); $event.stopPropagation()"
                          class="text-gray-400 hover:text-blue-600 transition-colors">
                          ✏️
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Child Categories -->
                  <div *ngIf="category.children && category.children.length > 0" class="mr-4 mt-2 space-y-2">
                    <div
                      *ngFor="let child of category.children"
                      (click)="selectCategory(child)"
                      [class.bg-blue-50]="selectedCategory?.id === child.id"
                      class="p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                      <span class="text-sm text-gray-700">{{child.name}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-3">
            
            <!-- Selected Category Info -->
            <div *ngIf="selectedCategory" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h2 class="text-xl font-semibold text-gray-800">{{selectedCategory.name}}</h2>
                  <p class="text-gray-600 mt-1">{{selectedCategory.description}}</p>
                  <div class="flex items-center mt-2 space-x-2 space-x-reverse">
                    <span class="text-xs px-2 py-1 bg-gray-100 rounded">
                      سطح {{selectedCategory.level}}
                    </span>
                    <span *ngIf="selectedCategory.is_leaf" class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                      قابل ایجاد محصول
                    </span>
                  </div>
                </div>
                <div class="flex space-x-2 space-x-reverse">
                  <button
                    (click)="editCategory(selectedCategory)"
                    class="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                    ویرایش دسته
                  </button>
                  <button
                    *ngIf="selectedCategory.is_leaf"
                    (click)="createProductInstance()"
                    class="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    ➕ ایجاد محصول
                  </button>
                </div>
              </div>

              <!-- Attributes -->
              <div *ngIf="selectedCategory.attributes && selectedCategory.attributes.length > 0">
                <h3 class="font-medium text-gray-800 mb-3">ویژگی‌های محصول:</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    *ngFor="let attr of selectedCategory.attributes"
                    class="p-3 border border-gray-200 rounded bg-gray-50">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-700">{{attr.name}}</span>
                      <div class="flex items-center space-x-1 space-x-reverse">
                        <span *ngIf="attr.is_categorizer" class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          دسته‌بند
                        </span>
                        <span *ngIf="attr.is_required" class="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                          اجباری
                        </span>
                      </div>
                    </div>
                    <div class="text-xs text-gray-600">
                      نوع: 
                      <span class="font-medium">
                        {{getAttributeTypeLabel(attr.type)}}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Product Instances -->
            <div *ngIf="selectedCategory && selectedCategory.is_leaf" class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-semibold text-gray-800">
                    محصولات {{selectedCategory.name}}
                  </h3>
                  <div class="flex items-center space-x-3 space-x-reverse">
                    <select
                      [(ngModel)]="sortBy"
                      (ngModelChange)="loadProductInstances()"
                      class="px-3 py-2 border border-gray-300 rounded text-sm">
                      <option value="created_at">جدیدترین</option>
                      <option value="price">قیمت</option>
                      <option value="stock_quantity">موجودی</option>
                      <option value="name">نام</option>
                    </select>
                    <button
                      (click)="createProductInstance()"
                      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      ➕ محصول جدید
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <div *ngIf="productInstances.length === 0" class="text-center py-12">
                  <div class="text-gray-400 text-6xl mb-4">📦</div>
                  <h3 class="text-lg font-medium text-gray-800 mb-2">هنوز محصولی ایجاد نشده</h3>
                  <p class="text-gray-600 mb-4">اولین محصول خود را در این دسته ایجاد کنید</p>
                  <button
                    (click)="createProductInstance()"
                    class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    ➕ ایجاد اولین محصول
                  </button>
                </div>

                <div *ngIf="productInstances.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div
                    *ngFor="let product of productInstances"
                    class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    
                    <!-- Product Image -->
                    <div class="aspect-square bg-gray-100 relative overflow-hidden">
                      <img
                        *ngIf="product.images && product.images.length > 0"
                        [src]="product.images[0]"
                        [alt]="product.name"
                        class="w-full h-full object-cover">
                      <div *ngIf="!product.images || product.images.length === 0"
                           class="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                        📷
                      </div>
                      
                      <!-- Stock Warning -->
                      <div *ngIf="product.stock_quantity === 1"
                           class="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
                        ⚠️ آخرین موجودی
                      </div>
                      
                      <!-- Status -->
                      <div class="absolute top-2 left-2">
                        <span
                          [class.bg-green-500]="product.is_active"
                          [class.bg-gray-500]="!product.is_active"
                          class="px-2 py-1 text-white text-xs rounded">
                          {{product.is_active ? 'فعال' : 'غیرفعال'}}
                        </span>
                      </div>
                    </div>

                    <!-- Product Info -->
                    <div class="p-4">
                      <h4 class="font-medium text-gray-800 mb-2 truncate">{{product.name}}</h4>
                      <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{product.description}}</p>
                      
                      <div class="flex justify-between items-center mb-3">
                        <span class="text-lg font-bold text-gray-900">
                          {{formatPrice(product.price)}} تومان
                        </span>
                        <span class="text-sm text-gray-500">
                          موجودی: {{product.stock_quantity}}
                        </span>
                      </div>

                      <!-- Attributes -->
                      <div *ngIf="product.attributes" class="mb-3">
                        <div class="flex flex-wrap gap-1">
                          <span
                            *ngFor="let attr of getProductAttributesDisplay(product.attributes)"
                            class="text-xs px-2 py-1 bg-gray-100 rounded">
                            {{attr}}
                          </span>
                        </div>
                      </div>

                      <!-- Actions -->
                      <div class="flex space-x-2 space-x-reverse">
                        <button
                          (click)="editProduct(product)"
                          class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                          ویرایش
                        </button>
                        <button
                          (click)="duplicateProduct(product)"
                          class="px-3 py-2 border border-blue-300 text-blue-600 rounded text-sm hover:bg-blue-50">
                          کپی
                        </button>
                        <button
                          (click)="toggleProductStatus(product)"
                          [class.bg-green-600]="!product.is_active"
                          [class.bg-gray-600]="product.is_active"
                          class="px-3 py-2 text-white rounded text-sm hover:opacity-90">
                          {{product.is_active ? '❌' : '✅'}}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Media Import Modal -->
      <div *ngIf="showSocialImport" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-90vh overflow-y-auto">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-800">📱 دریافت محتوا از شبکه‌های اجتماعی</h2>
              <button
                (click)="showSocialImport = false"
                class="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <p class="text-gray-600 mt-2">۵ پست آخر از اینستاگرام و تلگرام خود را دریافت کنید</p>
          </div>
          
          <div class="p-6">
            <!-- Platform Selection -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <button
                (click)="selectedPlatform = 'instagram'"
                [class.bg-pink-600]="selectedPlatform === 'instagram'"
                [class.text-white]="selectedPlatform === 'instagram'"
                [class.border-pink-600]="selectedPlatform === 'instagram'"
                class="p-4 border-2 border-gray-300 rounded-lg text-center hover:border-pink-400 transition-colors">
                <div class="text-2xl mb-2">📷</div>
                <div class="font-medium">اینستاگرام</div>
              </button>
              <button
                (click)="selectedPlatform = 'telegram'"
                [class.bg-blue-600]="selectedPlatform === 'telegram'"
                [class.text-white]="selectedPlatform === 'telegram'"
                [class.border-blue-600]="selectedPlatform === 'telegram'"
                class="p-4 border-2 border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors">
                <div class="text-2xl mb-2">💬</div>
                <div class="font-medium">تلگرام</div>
              </button>
            </div>

            <div *ngIf="selectedPlatform" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{selectedPlatform === 'instagram' ? 'نام کاربری اینستاگرام' : 'آیدی کانال تلگرام'}}
                </label>
                <input
                  type="text"
                  [(ngModel)]="socialUsername"
                  [placeholder]="selectedPlatform === 'instagram' ? '@username' : '@channel_name'"
                  class="w-full p-3 border border-gray-300 rounded-lg">
              </div>

              <button
                (click)="fetchSocialContent()"
                [disabled]="!socialUsername || isLoadingSocial"
                class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                <span *ngIf="!isLoadingSocial">📥 دریافت محتوا</span>
                <span *ngIf="isLoadingSocial">در حال دریافت...</span>
              </button>

              <!-- Social Content Results -->
              <div *ngIf="socialContent.length > 0" class="mt-6">
                <h3 class="font-medium text-gray-800 mb-4">محتوای دریافت شده:</h3>
                <div class="space-y-4 max-h-96 overflow-y-auto">
                  <div
                    *ngFor="let content of socialContent"
                    class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div class="flex items-start space-x-3 space-x-reverse">
                      <input
                        type="checkbox"
                        [(ngModel)]="content.selected"
                        class="mt-1">
                      <div class="flex-1">
                        <div *ngIf="content.images.length > 0" class="mb-2">
                          <img
                            [src]="content.images[0]"
                            class="w-16 h-16 object-cover rounded">
                        </div>
                        <p class="text-sm text-gray-700 mb-2">{{content.text}}</p>
                        <div class="text-xs text-gray-500">
                          {{content.images.length}} تصویر • {{content.videos.length}} ویدیو
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-4 flex space-x-3 space-x-reverse">
                  <button
                    (click)="importSelectedContent()"
                    class="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    ✅ وارد کردن انتخاب شده‌ها
                  </button>
                  <button
                    (click)="socialContent = []"
                    class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                    لغو
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Data
  productClasses: ProductClass[] = [];
  productInstances: ProductInstance[] = [];
  selectedCategory: ProductClass | null = null;
  totalProducts = 0;
  sortBy = 'created_at';
  
  // UI State
  showCategoryForm = false;
  showSocialImport = false;
  isLoadingSocial = false;
  
  // Forms
  newCategory = {
    name: '',
    parent_id: null,
    description: ''
  };
  
  // Social Media Import
  selectedPlatform: 'instagram' | 'telegram' | null = null;
  socialUsername = '';
  socialContent: any[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private socialContentService: SocialContentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProductClasses();
    this.loadTotalProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadProductClasses(): Promise<void> {
    try {
      this.productClasses = await this.categoryService.getHierarchy();
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async loadTotalProducts(): Promise<void> {
    try {
      const stats = await this.productService.getStats();
      this.totalProducts = stats.total_products;
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  selectCategory(category: ProductClass): void {
    this.selectedCategory = category;
    if (category.is_leaf) {
      this.loadProductInstances();
    }
  }

  async loadProductInstances(): Promise<void> {
    if (!this.selectedCategory) return;
    
    try {
      this.productInstances = await this.productService.getInstancesByCategory(
        this.selectedCategory.id,
        { sortBy: this.sortBy }
      );
    } catch (error) {
      console.error('Error loading product instances:', error);
    }
  }

  async createCategory(): Promise<void> {
    try {
      await this.categoryService.create(this.newCategory);
      this.newCategory = { name: '', parent_id: null, description: '' };
      this.showCategoryForm = false;
      await this.loadProductClasses();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  }

  editCategory(category: ProductClass): void {
    // Navigate to category edit page
    this.router.navigate(['/product-management/category', category.id]);
  }

  createNewProduct(): void {
    if (this.selectedCategory && this.selectedCategory.is_leaf) {
      this.createProductInstance();
    } else {
      // Show category selection modal
      alert('لطفاً ابتدا دسته‌ای را انتخاب کنید که قابل ایجاد محصول باشد');
    }
  }

  createProductInstance(): void {
    if (!this.selectedCategory) return;
    this.router.navigate(['/product-management/create-instance'], {
      queryParams: { categoryId: this.selectedCategory.id }
    });
  }

  editProduct(product: ProductInstance): void {
    this.router.navigate(['/product-management/edit-instance', product.id]);
  }

  async duplicateProduct(product: ProductInstance): Promise<void> {
    try {
      const duplicated = { ...product };
      delete duplicated.id;
      duplicated.name += ' (کپی)';
      duplicated.sku = undefined;
      
      await this.productService.createInstance(duplicated);
      await this.loadProductInstances();
    } catch (error) {
      console.error('Error duplicating product:', error);
    }
  }

  async toggleProductStatus(product: ProductInstance): Promise<void> {
    try {
      await this.productService.updateInstance(product.id!, {
        is_active: !product.is_active
      });
      product.is_active = !product.is_active;
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  }

  async fetchSocialContent(): Promise<void> {
    if (!this.selectedPlatform || !this.socialUsername) return;
    
    this.isLoadingSocial = true;
    try {
      this.socialContent = await this.socialContentService.fetchContent(
        this.selectedPlatform,
        this.socialUsername
      );
      
      // Mark all as selected by default
      this.socialContent.forEach(content => content.selected = true);
    } catch (error) {
      console.error('Error fetching social content:', error);
    } finally {
      this.isLoadingSocial = false;
    }
  }

  async importSelectedContent(): Promise<void> {
    const selected = this.socialContent.filter(content => content.selected);
    if (selected.length === 0) return;
    
    try {
      // Process each selected content into product format
      for (const content of selected) {
        // Here you would create products based on social content
        // This is a simplified example
        const productData = {
          product_class_id: this.selectedCategory?.id || 0,
          name: this.extractProductName(content.text),
          description: content.text,
          price: 0, // User will need to set price
          stock_quantity: 1,
          images: content.images,
          videos: content.videos,
          attributes: {},
          is_active: false // Start as inactive for review
        };
        
        await this.productService.createInstance(productData);
      }
      
      this.showSocialImport = false;
      this.socialContent = [];
      await this.loadProductInstances();
    } catch (error) {
      console.error('Error importing content:', error);
    }
  }

  private extractProductName(text: string): string {
    // Simple extraction - take first line or first 50 chars
    const firstLine = text.split('\n')[0];
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fa-IR').format(price);
  }

  getProductAttributesDisplay(attributes: { [key: string]: any }): string[] {
    return Object.entries(attributes).map(([key, value]) => `${key}: ${value}`);
  }

  getAttributeTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'text': 'متن',
      'color': 'رنگ',
      'number': 'عدد',
      'select': 'انتخابی'
    };
    return labels[type] || type;
  }
}
