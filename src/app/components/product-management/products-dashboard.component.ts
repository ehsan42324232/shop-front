import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SocialContentService } from '../../services/social-content.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

interface ProductClass {
  id: number;
  name: string;
  parent_id: number | null;
  level: number;
  children?: ProductClass[];
  attributes?: ProductAttribute[];
  can_create_instances: boolean;
}

interface ProductAttribute {
  id: number;
  name: string;
  attribute_type: 'text' | 'number' | 'color' | 'select' | 'boolean';
  is_required: boolean;
  is_categorizer: boolean;
  options?: string[];
  default_value?: string;
}

interface ProductInstance {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  images: string[];
  videos: string[];
  attributes: { [key: string]: any };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-products-dashboard',
  templateUrl: './products-dashboard.component.html',
  styleUrls: ['./products-dashboard.component.css']
})
export class ProductsDashboardComponent implements OnInit, OnDestroy {
  
  // Component state
  currentView: 'list' | 'grid' = 'list';
  isLoadingHierarchy = false;
  isLoadingInstances = false;
  
  // Data
  productHierarchy: ProductClass[] = [];
  productInstances: ProductInstance[] = [];
  selectedClass: ProductClass | null = null;
  
  // UI state
  expandedNodes = new Set<number>();
  selectedInstances: number[] = [];
  allSelected = false;
  
  // Filters and search
  searchQuery = '';
  statusFilter = '';
  sortBy = 'created_at';
  
  // Stats
  stats = {
    totalClasses: 0,
    totalInstances: 0,
    activeInstances: 0,
    lowStockInstances: 0
  };
  
  // Forms
  classForm: FormGroup;
  instanceForm: FormGroup;
  
  // Modals
  showCreateClassModal = false;
  showCreateInstanceModal = false;
  showEditModal = false;
  showSocialImportModal = false;
  
  // Subscriptions
  private subscriptions: Subscription[] = [];
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private socialContentService: SocialContentService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.initializeForms();
  }
  
  ngOnInit(): void {
    this.loadProductHierarchy();
    this.loadStats();
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  private initializeForms(): void {
    this.classForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      parent_id: [null],
      description: [''],
      attributes: this.fb.array([])
    });
    
    this.instanceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock_quantity: [0, [Validators.required, Validators.min(0)]],
      is_active: [true],
      images: [[]],
      videos: [[]],
      attributes: this.fb.group({})
    });
  }
  
  // Data Loading Methods
  loadProductHierarchy(): void {
    this.isLoadingHierarchy = true;
    
    const hierarchySub = this.productService.getProductHierarchy().subscribe({
      next: (response) => {
        if (response.success) {
          this.productHierarchy = response.data || [];
          this.buildHierarchyTree();
        }
        this.isLoadingHierarchy = false;
      },
      error: (error) => {
        this.notificationService.showApiError(error);
        this.isLoadingHierarchy = false;
      }
    });
    
    this.subscriptions.push(hierarchySub);
  }
  
  loadProductInstances(classId?: number): void {
    if (!classId && !this.selectedClass) return;
    
    this.isLoadingInstances = true;
    const targetClassId = classId || this.selectedClass!.id;
    
    const instancesSub = this.productService.getProductInstances(targetClassId, {
      search: this.searchQuery,
      status: this.statusFilter,
      sort_by: this.sortBy
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.productInstances = response.data || [];
          this.updateSelectionState();
        }
        this.isLoadingInstances = false;
      },
      error: (error) => {
        this.notificationService.showApiError(error);
        this.isLoadingInstances = false;
      }
    });
    
    this.subscriptions.push(instancesSub);
  }
  
  loadStats(): void {
    const statsSub = this.productService.getProductStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
    
    this.subscriptions.push(statsSub);
  }
  
  // Tree Navigation Methods
  toggleNode(node: ProductClass): void {
    if (this.expandedNodes.has(node.id)) {
      this.expandedNodes.delete(node.id);
    } else {
      this.expandedNodes.add(node.id);
    }
  }
  
  selectClass(productClass: ProductClass): void {
    this.selectedClass = productClass;
    this.selectedInstances = [];
    this.loadProductInstances(productClass.id);
  }
  
  // CRUD Operations for Classes
  openCreateModal(): void {
    this.classForm.reset();
    if (this.selectedClass) {
      this.classForm.patchValue({ parent_id: this.selectedClass.id });
    }
    this.showCreateClassModal = true;
  }
  
  createClass(): void {
    if (!this.classForm.valid) {
      this.notificationService.error('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }
    
    const classData = this.classForm.value;
    
    const createSub = this.productService.createProductClass(classData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSaveSuccess('دسته‌بندی');
          this.showCreateClassModal = false;
          this.loadProductHierarchy();
          this.loadStats();
        } else {
          this.notificationService.error(response.message || 'خطا در ایجاد دسته‌بندی');
        }
      },
      error: (error) => {
        this.notificationService.showApiError(error);
      }
    });
    
    this.subscriptions.push(createSub);
  }
  
  editClass(productClass: ProductClass): void {
    this.selectedClass = productClass;
    this.classForm.patchValue({
      name: productClass.name,
      parent_id: productClass.parent_id,
      description: productClass.name // Assuming description exists
    });
    this.showEditModal = true;
  }
  
  updateClass(): void {
    if (!this.classForm.valid || !this.selectedClass) return;
    
    const updateData = this.classForm.value;
    
    const updateSub = this.productService.updateProductClass(this.selectedClass.id, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showUpdateSuccess('دسته‌بندی');
          this.showEditModal = false;
          this.loadProductHierarchy();
        } else {
          this.notificationService.error(response.message || 'خطا در بروزرسانی');
        }
      },
      error: (error) => {
        this.notificationService.showApiError(error);
      }
    });
    
    this.subscriptions.push(updateSub);
  }
  
  // CRUD Operations for Instances
  createInstance(): void {
    if (!this.selectedClass || !this.selectedClass.can_create_instances) {
      this.notificationService.error('امکان ایجاد محصول در این دسته‌بندی وجود ندارد');
      return;
    }
    
    this.instanceForm.reset();
    this.instanceForm.patchValue({ is_active: true });
    this.showCreateInstanceModal = true;
  }
  
  saveInstance(): void {
    if (!this.instanceForm.valid || !this.selectedClass) return;
    
    const instanceData = {
      ...this.instanceForm.value,
      product_class_id: this.selectedClass.id
    };
    
    const saveSub = this.productService.createProductInstance(instanceData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSaveSuccess('محصول');
          this.showCreateInstanceModal = false;
          this.loadProductInstances();
          this.loadStats();
        } else {
          this.notificationService.error(response.message || 'خطا در ایجاد محصول');
        }
      },
      error: (error) => {
        this.notificationService.showApiError(error);
      }
    });
    
    this.subscriptions.push(saveSub);
  }
  
  editInstance(instance: ProductInstance): void {
    this.instanceForm.patchValue({
      name: instance.name,
      description: instance.description,
      price: instance.price,
      stock_quantity: instance.stock_quantity,
      is_active: instance.is_active,
      images: instance.images,
      videos: instance.videos,
      attributes: instance.attributes
    });
    this.showEditModal = true;
  }
  
  duplicateInstance(instance: ProductInstance): void {
    this.notificationService.confirm(
      `آیا می‌خواهید محصول "${instance.name}" را کپی کنید؟`,
      () => {
        const duplicateData = {
          ...instance,
          name: `${instance.name} - کپی`,
          id: undefined
        };
        
        const duplicateSub = this.productService.createProductInstance(duplicateData).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.success('محصول با موفقیت کپی شد');
              this.loadProductInstances();
              this.loadStats();
            }
          },
          error: (error) => {
            this.notificationService.showApiError(error);
          }
        });
        
        this.subscriptions.push(duplicateSub);
      }
    );
  }
  
  deleteInstance(instance: ProductInstance): void {
    this.notificationService.confirm(
      `آیا از حذف محصول "${instance.name}" اطمینان دارید؟`,
      () => {
        const deleteSub = this.productService.deleteProductInstance(instance.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.showDeleteSuccess('محصول');
              this.loadProductInstances();
              this.loadStats();
            }
          },
          error: (error) => {
            this.notificationService.showApiError(error);
          }
        });
        
        this.subscriptions.push(deleteSub);
      }
    );
  }
  
  // Selection and Bulk Operations
  toggleInstanceSelection(instanceId: number, event: any): void {
    if (event.target.checked) {
      this.selectedInstances.push(instanceId);
    } else {
      this.selectedInstances = this.selectedInstances.filter(id => id !== instanceId);
    }
    this.updateSelectionState();
  }
  
  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedInstances = this.productInstances.map(instance => instance.id);
    } else {
      this.selectedInstances = [];
    }
    this.updateSelectionState();
  }
  
  private updateSelectionState(): void {
    this.allSelected = this.selectedInstances.length === this.productInstances.length && this.productInstances.length > 0;
  }
  
  bulkActivate(): void {
    this.bulkOperation('activate', 'فعال‌سازی');
  }
  
  bulkDeactivate(): void {
    this.bulkOperation('deactivate', 'غیرفعال‌سازی');
  }
  
  bulkDelete(): void {
    this.notificationService.confirm(
      `آیا از حذف ${this.selectedInstances.length} محصول انتخاب شده اطمینان دارید؟`,
      () => {
        this.bulkOperation('delete', 'حذف');
      }
    );
  }
  
  private bulkOperation(operation: string, operationName: string): void {
    if (this.selectedInstances.length === 0) return;
    
    const bulkSub = this.productService.bulkUpdateInstances(this.selectedInstances, operation).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success(`${operationName} ${this.selectedInstances.length} محصول با موفقیت انجام شد`);
          this.selectedInstances = [];
          this.loadProductInstances();
          this.loadStats();
        }
      },
      error: (error) => {
        this.notificationService.showApiError(error);
      }
    });
    
    this.subscriptions.push(bulkSub);
  }
  
  // Search and Filter Methods
  onSearchChange(): void {
    // Debounce search
    setTimeout(() => {
      this.applyFilters();
    }, 300);
  }
  
  applyFilters(): void {
    if (this.selectedClass) {
      this.loadProductInstances();
    }
  }
  
  // Social Media Integration
  openSocialImport(): void {
    this.showSocialImportModal = true;
  }
  
  importFromSocial(platform: 'telegram' | 'instagram', username: string): void {
    const importSub = this.socialContentService.importContent(platform, username).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('محتوا از شبکه اجتماعی با موفقیت وارد شد');
          this.showSocialImportModal = false;
          // Show content selection modal
        }
      },
      error: (error) => {
        this.notificationService.showApiError(error);
      }
    });
    
    this.subscriptions.push(importSub);
  }
  
  // Utility Methods
  toggleView(): void {
    this.currentView = this.currentView === 'list' ? 'grid' : 'list';
  }
  
  refreshHierarchy(): void {
    this.loadProductHierarchy();
  }
  
  formatPrice(price: number): string {
    return price.toLocaleString('fa-IR');
  }
  
  private buildHierarchyTree(): void {
    // Build tree structure from flat array
    const nodeMap = new Map<number, ProductClass>();
    const rootNodes: ProductClass[] = [];
    
    // First pass: create node map
    this.productHierarchy.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });
    
    // Second pass: build tree
    this.productHierarchy.forEach(node => {
      const treeNode = nodeMap.get(node.id)!;
      if (node.parent_id === null) {
        rootNodes.push(treeNode);
      } else {
        const parent = nodeMap.get(node.parent_id);
        if (parent) {
          parent.children!.push(treeNode);
        }
      }
    });
    
    this.productHierarchy = rootNodes;
  }
  
  // Navigation
  navigateToAnalytics(): void {
    this.router.navigate(['/analytics']);
  }
  
  navigateToOrders(): void {
    this.router.navigate(['/orders']);
  }
}
