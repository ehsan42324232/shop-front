import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from '../../../services/store.service';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bulk-import',
  template: `
    <div class="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            ایمپورت گروهی محصولات
          </h1>
          <p class="text-gray-600">
            محصولات خود را از طریق فایل Excel یا CSV به راحتی وارد کنید
          </p>
        </div>

        <!-- Upload Form -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <form [formGroup]="uploadForm" (ngSubmit)="onFileUpload()">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                انتخاب فایل
              </label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors"
                   [class.border-blue-400]="dragOver"
                   (dragover)="onDragOver($event)"
                   (dragleave)="onDragLeave($event)"
                   (drop)="onDrop($event)">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <div class="flex text-sm text-gray-600 justify-center">
                    <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>فایل را انتخاب کنید</span>
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" 
                             (change)="onFileSelected($event)"
                             accept=".csv,.xlsx,.xls">
                    </label>
                    <p class="pr-1">یا اینجا بکشید</p>
                  </div>
                  <p class="text-xs text-gray-500">
                    فرمت‌های مجاز: CSV, Excel (حداکثر 10 مگابایت)
                  </p>
                </div>
              </div>
              
              <!-- Selected File Info -->
              <div *ngIf="selectedFile" class="mt-4 p-4 bg-blue-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <svg class="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                    <div class="mr-3">
                      <p class="text-sm font-medium text-blue-900">{{ selectedFile.name }}</p>
                      <p class="text-sm text-blue-700">{{ getFileSize(selectedFile.size) }}</p>
                    </div>
                  </div>
                  <button type="button" (click)="removeFile()" class="text-blue-600 hover:text-blue-800">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Validation Results -->
            <div *ngIf="validationResult" class="mb-6">
              <div class="p-4 rounded-lg" [class]="validationResult.is_valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
                <div class="flex items-center mb-3">
                  <svg *ngIf="validationResult.is_valid" class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <svg *ngIf="!validationResult.is_valid" class="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                  <h3 class="mr-2 text-sm font-medium" [class]="validationResult.is_valid ? 'text-green-800' : 'text-red-800'">
                    {{ validationResult.is_valid ? 'فایل معتبر است' : 'فایل نامعتبر است' }}
                  </h3>
                </div>
                
                <div class="text-sm" [class]="validationResult.is_valid ? 'text-green-700' : 'text-red-700'">
                  <p class="mb-2">تعداد ردیف‌ها: {{ validationResult.total_rows }}</p>
                  
                  <div *ngIf="validationResult.errors?.length > 0" class="mb-2">
                    <p class="font-medium mb-1">خطاها:</p>
                    <ul class="list-disc list-inside">
                      <li *ngFor="let error of validationResult.errors">{{ error }}</li>
                    </ul>
                  </div>
                  
                  <div *ngIf="validationResult.warnings?.length > 0" class="mb-2">
                    <p class="font-medium mb-1">هشدارها:</p>
                    <ul class="list-disc list-inside">
                      <li *ngFor="let warning of validationResult.warnings">{{ warning }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center">
              <div class="space-x-4 space-x-reverse">
                <button type="button" 
                        (click)="validateFile()"
                        [disabled]="!selectedFile || isLoading"
                        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span *ngIf="!isValidating">اعتبارسنجی فایل</span>
                  <span *ngIf="isValidating" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    در حال اعتبارسنجی...
                  </span>
                </button>
                
                <button type="submit" 
                        [disabled]="!selectedFile || !validationResult?.is_valid || isLoading"
                        class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span *ngIf="!isLoading">شروع ایمپورت</span>
                  <span *ngIf="isLoading" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    در حال ایمپورت...
                  </span>
                </button>
              </div>
              
              <a href="/api/import/template/" 
                 class="text-blue-600 hover:text-blue-500 text-sm font-medium">
                دانلود فایل نمونه
              </a>
            </div>
          </form>
        </div>

        <!-- Import History -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">تاریخچه ایمپورت</h2>
          
          <div *ngIf="importLogs.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="mt-4 text-sm text-gray-500">هیچ ایمپورتی انجام نشده است</p>
          </div>

          <div *ngIf="importLogs.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نام فایل
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تعداد محصولات
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاریخ
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let log of importLogs">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ log.filename }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                          [class]="getStatusClass(log.status)">
                      {{ getStatusText(log.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ log.products_created + log.products_updated }} / {{ log.total_rows }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ log.created_at | date:'short' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button (click)="viewLogDetails(log)" class="text-blue-600 hover:text-blue-500 ml-4">
                      جزئیات
                    </button>
                    <button (click)="deleteLog(log.id)" class="text-red-600 hover:text-red-500">
                      حذف
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .drag-over {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }
  `]
})
export class BulkImportComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  dragOver = false;
  isLoading = false;
  isValidating = false;
  validationResult: any = null;
  importLogs: any[] = [];

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      file: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadImportLogs();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.validationResult = null;
      this.uploadForm.patchValue({ file: file });
    }
  }

  onDragOver(event: any) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: any) {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: any) {
    event.preventDefault();
    this.dragOver = false;
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.selectedFile = files[0];
      this.validationResult = null;
      this.uploadForm.patchValue({ file: files[0] });
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.validationResult = null;
    this.uploadForm.patchValue({ file: '' });
  }

  validateFile() {
    if (!this.selectedFile) return;

    this.isValidating = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.productService.validateImportFile(formData).subscribe({
      next: (result) => {
        this.validationResult = result;
        this.isValidating = false;
        
        if (result.is_valid) {
          this.toastr.success('فایل معتبر است و آماده ایمپورت می‌باشد');
        } else {
          this.toastr.warning('فایل دارای خطا است، لطفاً مشکلات را برطرف کنید');
        }
      },
      error: (error) => {
        this.isValidating = false;
        this.toastr.error('خطا در اعتبارسنجی فایل');
        console.error('Validation error:', error);
      }
    });
  }

  onFileUpload() {
    if (!this.selectedFile || !this.validationResult?.is_valid) return;

    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.productService.bulkImportProducts(formData).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.toastr.success('ایمپورت محصولات با موفقیت انجام شد');
        
        // Reset form
        this.selectedFile = null;
        this.validationResult = null;
        this.uploadForm.reset();
        
        // Reload import logs
        this.loadImportLogs();
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error('خطا در ایمپورت محصولات');
        console.error('Import error:', error);
      }
    });
  }

  loadImportLogs() {
    this.productService.getImportLogs().subscribe({
      next: (logs) => {
        this.importLogs = logs.import_logs;
      },
      error: (error) => {
        console.error('Error loading import logs:', error);
      }
    });
  }

  viewLogDetails(log: any) {
    // Navigate to log details or show modal
    console.log('View log details:', log);
  }

  deleteLog(logId: number) {
    if (confirm('آیا از حذف این لاگ اطمینان دارید؟')) {
      this.productService.deleteImportLog(logId).subscribe({
        next: () => {
          this.toastr.success('لاگ با موفقیت حذف شد');
          this.loadImportLogs();
        },
        error: (error) => {
          this.toastr.error('خطا در حذف لاگ');
          console.error('Delete error:', error);
        }
      });
    }
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed':
        return 'موفق';
      case 'failed':
        return 'ناموفق';
      case 'partial':
        return 'جزئی';
      case 'processing':
        return 'در حال پردازش';
      default:
        return 'نامشخص';
    }
  }
}
