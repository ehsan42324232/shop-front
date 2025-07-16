import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { BulkImportProduct } from '../models/product.models';

@Injectable({ providedIn: 'root' })
export class BulkImportService {
  private apiUrl = '/api/bulk-import/';
  private importProgressSubject = new BehaviorSubject<ImportProgress | null>(null);
  public importProgress$ = this.importProgressSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('X-Store-Domain', window.location.hostname);
  }

  // Store creation with CSV
  importStoreData(file: File, storeData: any): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('store_data', JSON.stringify(storeData));
    return this.http.post<ImportResult>(`${this.apiUrl}stores/`, formData);
  }

  // Products import for store owners
  importProducts(file: File, options?: ImportOptions): Observable<ImportResult> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }
    return this.http.post<ImportResult>(`${this.apiUrl}products/`, formData, { headers });
  }

  // Categories import
  importCategories(file: File): Observable<ImportResult> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImportResult>(`${this.apiUrl}categories/`, formData, { headers });
  }

  // Attributes import
  importAttributes(file: File): Observable<ImportResult> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImportResult>(`${this.apiUrl}attributes/`, formData, { headers });
  }

  // Get import history
  getImportHistory(): Observable<ImportRecord[]> {
    const headers = this.getHeaders();
    return this.http.get<ImportRecord[]>(`${this.apiUrl}history/`, { headers });
  }

  // Get import status
  getImportStatus(importId: string): Observable<ImportProgress> {
    const headers = this.getHeaders();
    return this.http.get<ImportProgress>(`${this.apiUrl}status/${importId}/`, { headers });
  }

  // Cancel import
  cancelImport(importId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}cancel/${importId}/`, {}, { headers });
  }

  // Download import template
  downloadTemplate(type: 'products' | 'categories' | 'attributes' | 'stores'): Observable<Blob> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}templates/${type}/`, { 
      headers, 
      responseType: 'blob' 
    });
  }

  // Validate file before import
  validateFile(file: File, type: string): Observable<ValidationResult> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return this.http.post<ValidationResult>(`${this.apiUrl}validate/`, formData, { headers });
  }

  // Preview import data
  previewImport(file: File, type: string, limit: number = 10): Observable<PreviewResult> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('limit', limit.toString());
    return this.http.post<PreviewResult>(`${this.apiUrl}preview/`, formData, { headers });
  }

  // Export data
  exportProducts(filters?: any): Observable<Blob> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}export/products/`, filters || {}, { 
      headers, 
      responseType: 'blob' 
    });
  }

  exportCategories(): Observable<Blob> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}export/categories/`, { 
      headers, 
      responseType: 'blob' 
    });
  }

  exportAttributes(): Observable<Blob> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}export/attributes/`, { 
      headers, 
      responseType: 'blob' 
    });
  }

  // Helper methods
  updateProgress(progress: ImportProgress): void {
    this.importProgressSubject.next(progress);
  }

  clearProgress(): void {
    this.importProgressSubject.next(null);
  }
}

export interface ImportOptions {
  update_existing: boolean;
  create_categories: boolean;
  create_attributes: boolean;
  ignore_errors: boolean;
  batch_size?: number;
}

export interface ImportResult {
  import_id: string;
  status: 'started' | 'completed' | 'failed';
  total_rows: number;
  processed_rows: number;
  success_count: number;
  error_count: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  created_at: string;
  completed_at?: string;
}

export interface ImportProgress {
  import_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress_percentage: number;
  current_row: number;
  total_rows: number;
  success_count: number;
  error_count: number;
  estimated_completion?: string;
  current_operation: string;
}

export interface ImportRecord {
  id: string;
  type: string;
  filename: string;
  status: string;
  total_rows: number;
  success_count: number;
  error_count: number;
  created_at: string;
  completed_at?: string;
  created_by: string;
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
  data?: any;
}

export interface ImportWarning {
  row: number;
  field?: string;
  message: string;
  data?: any;
}

export interface ValidationResult {
  is_valid: boolean;
  errors: ImportError[];
  warnings: ImportWarning[];
  detected_format: string;
  total_rows: number;
  required_columns: string[];
  missing_columns: string[];
  extra_columns: string[];
}

export interface PreviewResult {
  headers: string[];
  rows: any[][];
  total_rows: number;
  detected_format: string;
  sample_data: any[];
}
