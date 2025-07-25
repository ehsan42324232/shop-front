import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface BulkImportResult {
  success: boolean;
  message: string;
  total_rows: number;
  successful_imports: number;
  failed_imports: number;
  errors: ImportError[];
  import_id: string;
  file_name: string;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  value?: any;
}

export interface ImportValidationResult {
  valid: boolean;
  errors: ImportError[];
  warnings: ImportWarning[];
  total_rows: number;
  valid_rows: number;
}

export interface ImportWarning {
  row: number;
  field: string;
  message: string;
  suggestion?: string;
}

export interface ImportTemplate {
  headers: string[];
  sample_data: any[];
  field_descriptions: { [key: string]: string };
  required_fields: string[];
  optional_fields: string[];
}

export interface ImportProgress {
  percentage: number;
  current_row: number;
  total_rows: number;
  status: 'validating' | 'importing' | 'processing' | 'completed' | 'failed';
  message: string;
}

export interface ImportOptions {
  skipDuplicates?: boolean;
  updateExisting?: boolean;
  categoryId?: number;
  storeId?: number;
}

export interface ExportFilters {
  categoryId?: number;
  dateFrom?: string;
  dateTo?: string;
  format?: 'csv' | 'xlsx';
  includeImages?: boolean;
  includeStock?: boolean;
}

export interface ImportHistoryResponse {
  results: BulkImportResult[];
  count: number;
  next: string | null;
  previous: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class BulkImportService {
  private apiUrl = `${environment.apiUrl}/import`;
  private importProgressSubject = new BehaviorSubject<ImportProgress | null>(null);
  public importProgress$ = this.importProgressSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get import template for products
   */
  getProductImportTemplate(): Observable<ImportTemplate> {
    return this.http.get<ImportTemplate>(`${this.apiUrl}/template/products`);
  }

  /**
   * Download import template as CSV file
   */
  downloadTemplate(templateType: 'products' | 'categories' = 'products'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/template/${templateType}/download`, {
      responseType: 'blob'
    });
  }

  /**
   * Validate import file before actual import
   */
  validateImportFile(file: File, importType: 'products' | 'categories' = 'products'): Observable<ImportValidationResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('import_type', importType);
    formData.append('validate_only', 'true');

    return this.http.post<ImportValidationResult>(`${this.apiUrl}/validate`, formData);
  }

  /**
   * Import products from CSV/Excel file with progress tracking
   */
  importProducts(file: File, options: ImportOptions = {}): Observable<BulkImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('import_type', 'products');
    
    // Add options
    if (options.skipDuplicates) {
      formData.append('skip_duplicates', 'true');
    }
    if (options.updateExisting) {
      formData.append('update_existing', 'true');
    }
    if (options.categoryId) {
      formData.append('default_category_id', options.categoryId.toString());
    }
    if (options.storeId) {
      formData.append('store_id', options.storeId.toString());
    }

    return this.http.post(`${this.apiUrl}/products`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              const progress: ImportProgress = {
                percentage: Math.round(100 * event.loaded / event.total),
                current_row: 0,
                total_rows: 0,
                status: 'importing',
                message: 'در حال آپلود فایل...'
              };
              this.importProgressSubject.next(progress);
            }
            return null;

          case HttpEventType.Response:
            const result = event.body as BulkImportResult;
            const finalProgress: ImportProgress = {
              percentage: 100,
              current_row: result.total_rows,
              total_rows: result.total_rows,
              status: result.success ? 'completed' : 'failed',
              message: result.success ? 'واردات با موفقیت انجام شد' : 'خطا در واردات'
            };
            this.importProgressSubject.next(finalProgress);
            return result;

          default:
            return null;
        }
      }),
      catchError((error) => {
        const errorProgress: ImportProgress = {
          percentage: 0,
          current_row: 0,
          total_rows: 0,
          status: 'failed',
          message: 'خطا در واردات فایل'
        };
        this.importProgressSubject.next(errorProgress);
        return throwError(error);
      })
    ).pipe(
      map(result => result!),
      catchError(error => throwError(error))
    ) as Observable<BulkImportResult>;
  }

  /**
   * Import categories from CSV/Excel file
   */
  importCategories(file: File, options: ImportOptions = {}): Observable<BulkImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('import_type', 'categories');
    
    if (options.skipDuplicates) {
      formData.append('skip_duplicates', 'true');
    }
    if (options.updateExisting) {
      formData.append('update_existing', 'true');
    }

    return this.http.post<BulkImportResult>(`${this.apiUrl}/categories`, formData);
  }

  /**
   * Get import history/logs
   */
  getImportHistory(page: number = 1, limit: number = 20): Observable<ImportHistoryResponse> {
    return this.http.get<ImportHistoryResponse>(`${this.apiUrl}/history`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  /**
   * Get specific import details
   */
  getImportDetails(importId: string): Observable<BulkImportResult> {
    return this.http.get<BulkImportResult>(`${this.apiUrl}/details/${importId}`);
  }

  /**
   * Cancel ongoing import
   */
  cancelImport(importId: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/cancel/${importId}`, {});
  }

  /**
   * Export products to CSV/Excel
   */
  exportProducts(filters: ExportFilters = {}): Observable<Blob> {
    const params: any = {};
    
    if (filters.categoryId) params.category_id = filters.categoryId;
    if (filters.dateFrom) params.date_from = filters.dateFrom;
    if (filters.dateTo) params.date_to = filters.dateTo;
    if (filters.format) params.format = filters.format;
    if (filters.includeImages) params.include_images = 'true';
    if (filters.includeStock) params.include_stock = 'true';

    return this.http.get(`${this.apiUrl}/export/products`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Get supported file formats
   */
  getSupportedFormats(): string[] {
    return ['csv', 'xlsx', 'xls'];
  }

  /**
   * Get maximum file size (in bytes)
   */
  getMaxFileSize(): number {
    return 10 * 1024 * 1024; // 10MB
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.getMaxFileSize()) {
      return {
        valid: false,
        error: `حجم فایل نباید بیشتر از ${this.getMaxFileSize() / 1024 / 1024} مگابایت باشد`
      };
    }

    // Check file format
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !this.getSupportedFormats().includes(fileExtension)) {
      return {
        valid: false,
        error: `فرمت فایل پشتیبانی نمی‌شود. فرمت‌های مجاز: ${this.getSupportedFormats().join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * Reset import progress
   */
  resetProgress(): void {
    this.importProgressSubject.next(null);
  }

  /**
   * Process import errors for display
   */
  processImportErrors(errors: ImportError[]): { [key: string]: ImportError[] } {
    const groupedErrors: { [key: string]: ImportError[] } = {};
    
    errors.forEach(error => {
      if (!groupedErrors[error.field]) {
        groupedErrors[error.field] = [];
      }
      groupedErrors[error.field].push(error);
    });
    
    return groupedErrors;
  }

  /**
   * Generate import summary
   */
  generateImportSummary(result: BulkImportResult): string {
    const { total_rows, successful_imports, failed_imports } = result;
    const successRate = Math.round((successful_imports / total_rows) * 100);
    
    return `از ${total_rows} ردیف، ${successful_imports} مورد با موفقیت وارد شد (${successRate}%). ${failed_imports} مورد با خطا مواجه شد.`;
  }

  /**
   * Download import report
   */
  downloadImportReport(importId: string, format: 'csv' | 'xlsx' = 'xlsx'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/report/${importId}`, {
      params: { format },
      responseType: 'blob'
    });
  }

  /**
   * Get import statistics
   */
  getImportStatistics(dateRange?: { from: string; to: string }): Observable<ImportStatistics> {
    const params: any = {};
    if (dateRange) {
      params.date_from = dateRange.from;
      params.date_to = dateRange.to;
    }

    return this.http.get<ImportStatistics>(`${this.apiUrl}/statistics`, { params });
  }
}

export interface ImportStatistics {
  total_imports: number;
  successful_imports: number;
  failed_imports: number;
  total_rows_processed: number;
  average_success_rate: number;
  most_common_errors: { field: string; count: number }[];
  recent_imports: BulkImportResult[];
}
