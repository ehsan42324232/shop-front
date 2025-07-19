import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { StoreService } from '../../../services/store.service';
import { CategoryTree, CategoryAttribute, AttributeType } from '../../../models/store.models';

@Component({
  selector: 'app-category-management',
  template: `
    <div class="container mx-auto px-4 py-6" dir="rtl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">مدیریت دسته‌بندی‌ها</h1>
        <p class="text-gray-600">ساختار دسته‌بندی‌های خود را به صورت سلسله‌مراتبی تا ۱۰ سطح تنظیم کنید</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-4 mb-6">
        <button (click)="showAddCategoryModal = true" 
                class="btn-primary px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <svg class="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          افزودن دسته‌بندی
        </button>
        
        <button (click)="downloadTemplate()" 
                class="btn-secondary px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <svg class="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          دانلود قالب Excel
        </button>
        
        <input type="file" (change)="onFileSelect($event)" accept=".xlsx,.xls" #fileInput class="hidden">
        <button (click)="fileInput.click()" 
                class="btn-secondary px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <svg class="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          بارگذاری Excel
        </button>
      </div>

      <!-- Categories Tree -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">ساختار دسته‌بندی‌ها</h2>
          
          <div class="space-y-2" *ngIf="categories.length > 0; else emptyState">
            <div *ngFor="let category of categories" class="category-item">
              <app-category-tree-item 
                [category]="category" 
                [level]="0"
                (editCategory)="editCategory($event)"
                (deleteCategory)="deleteCategory($event)"
                (addSubCategory)="addSubCategory($event)">
              </app-category-tree-item>
            </div>
          </div>

          <ng-template #emptyState>
            <div class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H5m14 14H5"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">هیچ دسته‌بندی وجود ندارد</h3>
              <p class="mt-1 text-sm text-gray-500">شروع کنید با افزودن اولین دسته‌بندی یا بارگذاری Excel</p>
              <div class="mt-6">
                <button (click)="showAddCategoryModal = true" 
                        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  افزودن دسته‌بندی
                </button>
              </div>
            </div>
          </ng-template>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H5m14 14H5"></path>
              </svg>
            </div>
            <div class="mr-4">
              <p class="text-sm font-medium text-gray-500">کل دسته‌بندی‌ها</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalCategories }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <div class="mr-4">
              <p class="text-sm font-medium text-gray-500">کل ویژگی‌ها</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalAttributes }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="mr-4">
              <p class="text-sm font-medium text-gray-500">بیشترین عمق</p>
              <p class="text-2xl font-semibold text-gray-900">{{ maxLevel }} سطح</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="mr-4">
              <p class="text-sm font-medium text-gray-500">ظرفیت باقی‌مانده</p>
              <p class="text-2xl font-semibold text-gray-900">{{ remainingCategories }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Category Modal -->
      <div *ngIf="showAddCategoryModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">افزودن دسته‌بندی جدید</h3>
            
            <form (ngSubmit)="addCategory()" #categoryForm="ngForm">
              <div class="space-y-4">
                <!-- Category Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">نام دسته‌بندی</label>
                  <input type="text" [(ngModel)]="newCategory.name" name="name" required
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="مثال: پوشاک">
                </div>

                <!-- Parent Category -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی والد</label>
                  <select [(ngModel)]="newCategory.parentId" name="parentId"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">دسته‌بندی اصلی (سطح 1)</option>
                    <option *ngFor="let cat of flatCategories" [value]="cat.id" [disabled]="cat.level >= 9">
                      {{ '—'.repeat(cat.level) }} {{ cat.name }}
                    </option>
                  </select>
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                  <textarea [(ngModel)]="newCategory.description" name="description" rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="توضیح کوتاهی درباره این دسته‌بندی..."></textarea>
                </div>

                <!-- Attributes -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ویژگی‌های این دسته</label>
                  <div class="space-y-2">
                    <div *ngFor="let attr of newCategory.attributes; let i = index" 
                         class="flex items-center space-x-2 space-x-reverse p-3 border border-gray-200 rounded-lg">
                      <input type="text" [(ngModel)]="attr.name" [name]="'attr_name_' + i" placeholder="نام ویژگی"
                             class="flex-1 px-2 py-1 border border-gray-300 rounded">
                      <select [(ngModel)]="attr.type" [name]="'attr_type_' + i"
                              class="px-2 py-1 border border-gray-300 rounded">
                        <option *ngFor="let type of attributeTypes" [value]="type.value">{{ type.label }}</option>
                      </select>
                      <button type="button" (click)="removeAttribute(i)"
                              class="text-red-600 hover:text-red-800">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    <button type="button" (click)="addAttribute()"
                            class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      + افزودن ویژگی
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex justify-end space-x-3 space-x-reverse mt-6">
                <button type="button" (click)="showAddCategoryModal = false"
                        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                  انصراف
                </button>
                <button type="submit" [disabled]="!categoryForm.form.valid"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                  افزودن دسته‌بندی
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Import Progress Modal -->
      <div *ngIf="importProgress" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-1/3 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mt-4">در حال بارگذاری...</h3>
            <p class="text-sm text-gray-500 mt-2">لطفاً منتظر بمانید</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .category-item {
      border-right: 2px solid #e5e7eb;
      transition: all 0.2s ease;
    }
    .category-item:hover {
      border-right-color: #3b82f6;
      background-color: #f8fafc;
    }
  `]
})
export class CategoryManagementComponent implements OnInit {
  categories: CategoryTree[] = [];
  flatCategories: CategoryTree[] = [];
  showAddCategoryModal = false;
  importProgress = false;
  
  // Statistics
  totalCategories = 0;
  totalAttributes = 0;
  maxLevel = 0;
  remainingCategories = 0;
  
  // New category form
  newCategory: Partial<CategoryTree> = {
    name: '',
    description: '',
    parentId: '',
    attributes: []
  };
  
  // Attribute types for dropdown
  attributeTypes = [
    { value: 'text', label: 'متن' },
    { value: 'textarea', label: 'متن چندخطی' },
    { value: 'number', label: 'عدد' },
    { value: 'dropdown', label: 'لیست کشویی' },
    { value: 'boolean', label: 'بله/خیر' },
    { value: 'color', label: 'رنگ' },
    { value: 'date', label: 'تاریخ' }
  ];

  constructor(
    private categoryService: CategoryService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadStatistics();
  }

  loadCategories(): void {
    this.storeService.currentStore$.subscribe(store => {
      if (store) {
        this.categoryService.getCategoryTree(store.id).subscribe(categories => {
          this.categories = categories;
          this.flatCategories = this.categoryService.flattenCategoryTree(categories);
          this.updateStatistics();
        });
      }
    });
  }

  loadStatistics(): void {
    // Load category limits and statistics
    this.storeService.currentStore$.subscribe(store => {
      if (store) {
        const limits = this.storeService.getPlanLimits()[store.subscription.plan];
        this.remainingCategories = limits.maxCategories - this.totalCategories;
      }
    });
  }

  updateStatistics(): void {
    this.totalCategories = this.flatCategories.length;
    this.totalAttributes = this.flatCategories.reduce((sum, cat) => sum + cat.attributes.length, 0);
    this.maxLevel = Math.max(...this.flatCategories.map(cat => cat.level), 0) + 1;
  }

  addCategory(): void {
    this.storeService.currentStore$.subscribe(store => {
      if (store && this.newCategory.name) {
        const categoryData: Partial<CategoryTree> = {
          ...this.newCategory,
          storeId: store.id,
          slug: this.categoryService.generateSlug(this.newCategory.name!),
          order: 0,
          isActive: true,
          level: this.newCategory.parentId ? 
            this.flatCategories.find(c => c.id === this.newCategory.parentId)!.level + 1 : 0
        };

        this.categoryService.createCategory(store.id, categoryData).subscribe({
          next: () => {
            this.showAddCategoryModal = false;
            this.resetNewCategoryForm();
            this.loadCategories();
            alert('دسته‌بندی با موفقیت اضافه شد');
          },
          error: (error) => {
            alert('خطا در افزودن دسته‌بندی: ' + error.message);
          }
        });
      }
    });
  }

  editCategory(category: CategoryTree): void {
    // Navigate to category edit page or open edit modal
    console.log('Edit category:', category);
  }

  deleteCategory(category: CategoryTree): void {
    if (confirm(`آیا از حذف دسته‌بندی "${category.name}" اطمینان دارید؟`)) {
      this.storeService.currentStore$.subscribe(store => {
        if (store) {
          this.categoryService.deleteCategory(store.id, category.id).subscribe({
            next: () => {
              this.loadCategories();
              alert('دسته‌بندی با موفقیت حذف شد');
            },
            error: (error) => {
              alert('خطا در حذف دسته‌بندی: ' + error.message);
            }
          });
        }
      });
    }
  }

  addSubCategory(parentCategory: CategoryTree): void {
    this.newCategory.parentId = parentCategory.id;
    this.showAddCategoryModal = true;
  }

  addAttribute(): void {
    if (!this.newCategory.attributes) {
      this.newCategory.attributes = [];
    }
    
    this.newCategory.attributes.push({
      id: '',
      name: '',
      type: 'text' as AttributeType,
      required: false,
      order: this.newCategory.attributes.length,
      showInFilter: true,
      showInProductList: false,
      showInProductDetail: true
    });
  }

  removeAttribute(index: number): void {
    if (this.newCategory.attributes) {
      this.newCategory.attributes.splice(index, 1);
    }
  }

  resetNewCategoryForm(): void {
    this.newCategory = {
      name: '',
      description: '',
      parentId: '',
      attributes: []
    };
  }

  downloadTemplate(): void {
    this.categoryService.downloadCategoryTemplate(true).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'category-template.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.importFromExcel(file);
    }
  }

  importFromExcel(file: File): void {
    this.importProgress = true;
    
    const options = {
      updateExisting: true,
      createMissingCategories: true,
      validateData: true,
      skipErrors: false,
      columnMapping: {
        'نام دسته‌بندی': 'name',
        'دسته والد': 'parentName',
        'توضیحات': 'description',
        'ویژگی‌ها': 'attributes'
      }
    };

    this.storeService.currentStore$.subscribe(store => {
      if (store) {
        this.categoryService.importCategoriesFromExcel(store.id, file, options).subscribe({
          next: (result) => {
            this.importProgress = false;
            this.loadCategories();
            
            const message = `
              بارگذاری کامل شد:
              - ${result.createdCategories} دسته‌بندی جدید
              - ${result.updatedCategories} دسته‌بندی بروزرسانی شد
              ${result.errors.length > 0 ? `- ${result.errors.length} خطا` : ''}
            `;
            alert(message);
          },
          error: (error) => {
            this.importProgress = false;
            alert('خطا در بارگذاری Excel: ' + error.message);
          }
        });
      }
    });
  }
}
