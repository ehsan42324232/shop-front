import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface ProductAttribute {
  id?: number;
  name: string;
  type: 'text' | 'color' | 'size' | 'number';
  is_categorizer: boolean;
  required: boolean;
  options?: string[];
}

interface ProductClass {
  id?: number;
  name: string;
  description: string;
  parent_id?: number;
  attributes: ProductAttribute[];
  children?: ProductClass[];
  level: number;
}

interface ProductInstance {
  id?: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
  videos: string[];
  attribute_values: { [key: string]: any };
  is_active: boolean;
}

interface SocialMediaContent {
  platform: 'telegram' | 'instagram';
  type: 'post' | 'story';
  content: string;
  images: string[];
  videos: string[];
  date: string;
}

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  // Main state
  currentView: 'classes' | 'instances' | 'create-class' | 'create-instance' = 'classes';
  loading = false;
  error: string | null = null;

  // Product classes
  productClasses: ProductClass[] = [];
  selectedClass: ProductClass | null = null;
  editingClass: ProductClass | null = null;

  // Product instances
  productInstances: ProductInstance[] = [];
  selectedInstance: ProductInstance | null = null;
  editingInstance: ProductInstance | null = null;

  // Forms
  classForm: Partial<ProductClass> = {
    name: '',
    description: '',
    parent_id: undefined,
    attributes: []
  };

  instanceForm: Partial<ProductInstance> = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    images: [],
    videos: [],
    attribute_values: {},
    is_active: true
  };

  // Social media integration
  showSocialImport = false;
  socialContent: SocialMediaContent[] = [];
  selectedSocialContent: SocialMediaContent[] = [];
  socialChannels = {
    telegram: '',
    instagram: ''
  };

  // File uploads
  uploadingFiles = false;
  dragOver = false;

  // Bulk creation
  createAnother = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProductClasses();
  }

  // ===============================
  // Data Loading
  // ===============================

  loadProductClasses(): void {
    this.loading = true;
    this.http.get<ProductClass[]>(`${environment.apiUrl}/api/products/classes/`)
      .subscribe({
        next: (classes) => {
          this.productClasses = classes;
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در بارگذاری کلاس‌های محصول:', error);
          this.error = 'خطا در بارگذاری کلاس‌های محصول';
          this.loading = false;
        }
      });
  }

  loadProductInstances(classId?: number): void {
    this.loading = true;
    const url = classId 
      ? `${environment.apiUrl}/api/products/instances/?class_id=${classId}`
      : `${environment.apiUrl}/api/products/instances/`;

    this.http.get<ProductInstance[]>(url)
      .subscribe({
        next: (instances) => {
          this.productInstances = instances;
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در بارگذاری نمونه‌های محصول:', error);
          this.error = 'خطا در بارگذاری نمونه‌های محصول';
          this.loading = false;
        }
      });
  }

  // ===============================
  // View Management
  // ===============================

  switchView(view: 'classes' | 'instances' | 'create-class' | 'create-instance'): void {
    this.currentView = view;
    this.error = null;

    if (view === 'instances') {
      this.loadProductInstances();
    } else if (view === 'create-class') {
      this.resetClassForm();
    } else if (view === 'create-instance') {
      this.resetInstanceForm();
    }
  }

  // ===============================
  // Product Class Management
  // ===============================

  resetClassForm(): void {
    this.classForm = {
      name: '',
      description: '',
      parent_id: undefined,
      attributes: [
        { name: 'رنگ', type: 'color', is_categorizer: false, required: false },
        { name: 'توضیحات', type: 'text', is_categorizer: false, required: false }
      ]
    };
    this.editingClass = null;
  }

  addAttribute(): void {
    if (!this.classForm.attributes) {
      this.classForm.attributes = [];
    }
    
    this.classForm.attributes.push({
      name: '',
      type: 'text',
      is_categorizer: false,
      required: false
    });
  }

  removeAttribute(index: number): void {
    if (this.classForm.attributes) {
      this.classForm.attributes.splice(index, 1);
    }
  }

  saveProductClass(): void {
    if (!this.classForm.name || !this.classForm.description) {
      this.error = 'نام و توضیحات کلاس محصول الزامی است';
      return;
    }

    this.loading = true;
    const url = this.editingClass 
      ? `${environment.apiUrl}/api/products/classes/${this.editingClass.id}/`
      : `${environment.apiUrl}/api/products/classes/`;
    
    const method = this.editingClass ? 'put' : 'post';

    this.http[method]<ProductClass>(url, this.classForm)
      .subscribe({
        next: (productClass) => {
          this.loading = false;
          this.loadProductClasses();
          this.switchView('classes');
          
          // Show success message
          const message = this.editingClass ? 'کلاس محصول با موفقیت بروزرسانی شد' : 'کلاس محصول با موفقیت ایجاد شد';
          alert(message);
        },
        error: (error) => {
          console.error('خطا در ذخیره کلاس محصول:', error);
          this.error = 'خطا در ذخیره کلاس محصول';
          this.loading = false;
        }
      });
  }

  editClass(productClass: ProductClass): void {
    this.editingClass = productClass;
    this.classForm = { ...productClass };
    this.switchView('create-class');
  }

  deleteClass(classId: number): void {
    if (!confirm('آیا از حذف این کلاس محصول اطمینان دارید؟')) {
      return;
    }

    this.loading = true;
    this.http.delete(`${environment.apiUrl}/api/products/classes/${classId}/`)
      .subscribe({
        next: () => {
          this.loading = false;
          this.loadProductClasses();
          alert('کلاس محصول با موفقیت حذف شد');
        },
        error: (error) => {
          console.error('خطا در حذف کلاس محصول:', error);
          this.error = 'خطا در حذف کلاس محصول';
          this.loading = false;
        }
      });
  }

  // ===============================
  // Product Instance Management
  // ===============================

  resetInstanceForm(): void {
    this.instanceForm = {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      images: [],
      videos: [],
      attribute_values: {},
      is_active: true
    };
    this.editingInstance = null;
  }

  saveProductInstance(): void {
    if (!this.instanceForm.name || !this.selectedClass) {
      this.error = 'نام محصول و انتخاب کلاس الزامی است';
      return;
    }

    this.loading = true;
    const data = {
      ...this.instanceForm,
      class_id: this.selectedClass.id
    };

    const url = this.editingInstance 
      ? `${environment.apiUrl}/api/products/instances/${this.editingInstance.id}/`
      : `${environment.apiUrl}/api/products/instances/`;
    
    const method = this.editingInstance ? 'put' : 'post';

    this.http[method]<ProductInstance>(url, data)
      .subscribe({
        next: (instance) => {
          this.loading = false;
          
          if (this.createAnother && !this.editingInstance) {
            // Reset form but keep some data for quick creation
            const name = this.instanceForm.name;
            const description = this.instanceForm.description;
            this.resetInstanceForm();
            this.instanceForm.name = name;
            this.instanceForm.description = description;
            alert('محصول با موفقیت ایجاد شد. فرم برای ایجاد محصول مشابه آماده است.');
          } else {
            this.loadProductInstances(this.selectedClass?.id);
            this.switchView('instances');
            
            const message = this.editingInstance ? 'محصول با موفقیت بروزرسانی شد' : 'محصول با موفقیت ایجاد شد';
            alert(message);
          }
        },
        error: (error) => {
          console.error('خطا در ذخیره محصول:', error);
          this.error = 'خطا در ذخیره محصول';
          this.loading = false;
        }
      });
  }

  editInstance(instance: ProductInstance): void {
    this.editingInstance = instance;
    this.instanceForm = { ...instance };
    this.switchView('create-instance');
  }

  deleteInstance(instanceId: number): void {
    if (!confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      return;
    }

    this.loading = true;
    this.http.delete(`${environment.apiUrl}/api/products/instances/${instanceId}/`)
      .subscribe({
        next: () => {
          this.loading = false;
          this.loadProductInstances(this.selectedClass?.id);
          alert('محصول با موفقیت حذف شد');
        },
        error: (error) => {
          console.error('خطا در حذف محصول:', error);
          this.error = 'خطا در حذف محصول';
          this.loading = false;
        }
      });
  }

  // ===============================
  // Social Media Integration
  // ===============================

  openSocialImport(): void {
    this.showSocialImport = true;
    this.socialContent = [];
    this.selectedSocialContent = [];
  }

  closeSocialImport(): void {
    this.showSocialImport = false;
  }

  fetchSocialContent(): void {
    if (!this.socialChannels.telegram && !this.socialChannels.instagram) {
      this.error = 'لطفاً حداقل یک کانال تلگرام یا اینستاگرام وارد کنید';
      return;
    }

    this.loading = true;
    this.http.post<SocialMediaContent[]>(`${environment.apiUrl}/api/social/fetch-content/`, this.socialChannels)
      .subscribe({
        next: (content) => {
          this.socialContent = content;
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در دریافت محتوای شبکه‌های اجتماعی:', error);
          this.error = 'خطا در دریافت محتوای شبکه‌های اجتماعی';
          this.loading = false;
        }
      });
  }

  toggleSocialContent(content: SocialMediaContent): void {
    const index = this.selectedSocialContent.findIndex(c => 
      c.platform === content.platform && c.date === content.date
    );

    if (index > -1) {
      this.selectedSocialContent.splice(index, 1);
    } else {
      this.selectedSocialContent.push(content);
    }
  }

  importSelectedContent(): void {
    if (this.selectedSocialContent.length === 0) {
      this.error = 'لطفاً محتوای مورد نظر را انتخاب کنید';
      return;
    }

    // Import text content
    const textContent = this.selectedSocialContent
      .map(c => c.content)
      .filter(c => c.trim())
      .join('\n\n');

    if (textContent && this.currentView === 'create-instance') {
      this.instanceForm.description = (this.instanceForm.description || '') + '\n' + textContent;
    }

    // Import images and videos
    this.selectedSocialContent.forEach(content => {
      if (content.images && this.instanceForm.images) {
        this.instanceForm.images.push(...content.images);
      }
      if (content.videos && this.instanceForm.videos) {
        this.instanceForm.videos.push(...content.videos);
      }
    });

    this.closeSocialImport();
    alert('محتوای انتخاب شده با موفقیت وارد شد');
  }

  // ===============================
  // File Upload
  // ===============================

  onFileSelect(event: any, type: 'images' | 'videos'): void {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    this.uploadFiles(files, type);
  }

  onFileDrop(event: DragEvent, type: 'images' | 'videos'): void {
    event.preventDefault();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    this.uploadFiles(files, type);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
  }

  uploadFiles(files: FileList, type: 'images' | 'videos'): void {
    this.uploadingFiles = true;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    formData.append('type', type);

    this.http.post<{urls: string[]}>(`${environment.apiUrl}/api/upload/`, formData)
      .subscribe({
        next: (response) => {
          if (type === 'images' && this.instanceForm.images) {
            this.instanceForm.images.push(...response.urls);
          } else if (type === 'videos' && this.instanceForm.videos) {
            this.instanceForm.videos.push(...response.urls);
          }
          this.uploadingFiles = false;
        },
        error: (error) => {
          console.error('خطا در آپلود فایل:', error);
          this.error = 'خطا در آپلود فایل';
          this.uploadingFiles = false;
        }
      });
  }

  removeFile(index: number, type: 'images' | 'videos'): void {
    if (type === 'images' && this.instanceForm.images) {
      this.instanceForm.images.splice(index, 1);
    } else if (type === 'videos' && this.instanceForm.videos) {
      this.instanceForm.videos.splice(index, 1);
    }
  }

  // ===============================
  // Helper Methods
  // ===============================

  getLeafClasses(): ProductClass[] {
    return this.productClasses.filter(cls => 
      !this.productClasses.some(child => child.parent_id === cls.id)
    );
  }

  getParentClasses(): ProductClass[] {
    return this.productClasses.filter(cls => !cls.parent_id);
  }

  isLowStock(instance: ProductInstance): boolean {
    return instance.quantity <= 1;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  }
}