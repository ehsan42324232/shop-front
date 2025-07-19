import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { 
  Store, 
  StoreSettings, 
  StoreTheme, 
  StoreTemplate, 
  StoreAnalytics,
  THEME_PRESETS,
  PLAN_LIMITS
} from '../models/store.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = environment.apiUrl;
  private currentStoreSubject = new BehaviorSubject<Store | null>(null);
  public currentStore$ = this.currentStoreSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentStore();
  }

  // Store Management
  getCurrentStore(): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/stores/current`).pipe(
      tap(store => this.currentStoreSubject.next(store))
    );
  }

  createStore(storeData: Partial<Store>): Observable<Store> {
    return this.http.post<Store>(`${this.apiUrl}/stores`, storeData).pipe(
      tap(store => this.currentStoreSubject.next(store))
    );
  }

  updateStore(storeId: string, updates: Partial<Store>): Observable<Store> {
    return this.http.put<Store>(`${this.apiUrl}/stores/${storeId}`, updates).pipe(
      tap(store => this.currentStoreSubject.next(store))
    );
  }

  updateStoreSettings(storeId: string, settings: StoreSettings): Observable<Store> {
    return this.http.put<Store>(`${this.apiUrl}/stores/${storeId}/settings`, settings).pipe(
      tap(store => this.currentStoreSubject.next(store))
    );
  }

  deleteStore(storeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/stores/${storeId}`);
  }

  // Theme Management
  getAvailableThemes(): Observable<StoreTheme[]> {
    return this.http.get<StoreTheme[]>(`${this.apiUrl}/themes`);
  }

  getThemePresets(): { [key: string]: Partial<StoreTheme> } {
    return THEME_PRESETS;
  }

  updateTheme(storeId: string, theme: StoreTheme): Observable<Store> {
    return this.http.put<Store>(`${this.apiUrl}/stores/${storeId}/theme`, theme).pipe(
      tap(store => this.currentStoreSubject.next(store))
    );
  }

  previewTheme(storeId: string, theme: StoreTheme): Observable<string> {
    return this.http.post<{ previewUrl: string }>(`${this.apiUrl}/stores/${storeId}/theme/preview`, theme)
      .pipe(map(response => response.previewUrl));
  }

  saveCustomTheme(storeId: string, theme: StoreTheme): Observable<StoreTheme> {
    return this.http.post<StoreTheme>(`${this.apiUrl}/stores/${storeId}/themes/custom`, theme);
  }

  // Store Templates
  getStoreTemplates(): Observable<StoreTemplate[]> {
    return this.http.get<StoreTemplate[]>(`${this.apiUrl}/store-templates`);
  }

  applyStoreTemplate(storeId: string, templateId: string): Observable<Store> {
    return this.http.post<Store>(`${this.apiUrl}/stores/${storeId}/apply-template`, { templateId }).pipe(
      tap(store => this.currentStoreSubject.next(store))
    );
  }

  // Analytics
  getStoreAnalytics(storeId: string, period: 'day' | 'week' | 'month' | 'year'): Observable<StoreAnalytics> {
    return this.http.get<StoreAnalytics>(`${this.apiUrl}/stores/${storeId}/analytics`, {
      params: { period }
    });
  }

  // Domain Management
  checkDomainAvailability(subdomain: string): Observable<boolean> {
    return this.http.get<{ available: boolean }>(`${this.apiUrl}/domains/check`, {
      params: { subdomain }
    }).pipe(map(response => response.available));
  }

  setCustomDomain(storeId: string, domain: string): Observable<Store> {
    return this.http.post<Store>(`${this.apiUrl}/stores/${storeId}/custom-domain`, { domain }).pipe(
      tap(store => this.currentStoreSubject.next(store))
    );
  }

  verifyCustomDomain(storeId: string): Observable<{ verified: boolean; error?: string }> {
    return this.http.post<{ verified: boolean; error?: string }>(`${this.apiUrl}/stores/${storeId}/verify-domain`, {});
  }

  // Subscription Management
  getAvailablePlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/subscription/plans`);
  }

  upgradePlan(storeId: string, planId: string): Observable<Store> {
    return this.http.post<Store>(`${this.apiUrl}/stores/${storeId}/upgrade`, { planId }).pipe(
      tap(store => this.currentStoreSubject.next(store))
    );
  }

  getPlanLimits(): typeof PLAN_LIMITS {
    return PLAN_LIMITS;
  }

  checkPlanLimits(storeId: string): Observable<{
    products: { current: number; max: number; exceeded: boolean };
    categories: { current: number; max: number; exceeded: boolean };
    attributes: { current: number; max: number; exceeded: boolean };
    storage: { current: number; max: number; exceeded: boolean };
  }> {
    return this.http.get<any>(`${this.apiUrl}/stores/${storeId}/limits`);
  }

  // Store Status
  activateStore(storeId: string): Observable<Store> {
    return this.http.post<Store>(`${this.apiUrl}/stores/${storeId}/activate`, {}).pipe(
      tap(store => this.currentStoreSubject.next(store))
    );
  }

  deactivateStore(storeId: string): Observable<Store> {
    return this.http.post<Store>(`${this.apiUrl}/stores/${storeId}/deactivate`, {}).pipe(
      tap(store => this.currentStoreSubject.next(store))
    );
  }

  // Store Export/Backup
  exportStoreData(storeId: string, includeProducts = true, includeOrders = false): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/stores/${storeId}/export`, {
      params: { includeProducts: includeProducts.toString(), includeOrders: includeOrders.toString() },
      responseType: 'blob'
    });
  }

  importStoreData(storeId: string, file: File): Observable<{
    success: boolean;
    importedCategories: number;
    importedProducts: number;
    errors: any[];
  }> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<any>(`${this.apiUrl}/stores/${storeId}/import`, formData);
  }

  // Store Preview
  getStorePreviewUrl(storeId: string): Observable<string> {
    return this.http.get<{ previewUrl: string }>(`${this.apiUrl}/stores/${storeId}/preview`)
      .pipe(map(response => response.previewUrl));
  }

  // Store Search & Discovery
  searchStores(query: string, filters?: any): Observable<Store[]> {
    const params: any = { query };
    if (filters) {
      Object.assign(params, filters);
    }
    return this.http.get<Store[]>(`${this.apiUrl}/stores/search`, { params });
  }

  // Helper Methods
  private loadCurrentStore(): void {
    const storeId = localStorage.getItem('currentStoreId');
    if (storeId) {
      this.getCurrentStore().subscribe();
    }
  }

  setCurrentStoreId(storeId: string): void {
    localStorage.setItem('currentStoreId', storeId);
  }

  clearCurrentStore(): void {
    localStorage.removeItem('currentStoreId');
    this.currentStoreSubject.next(null);
  }

  // Validation Helpers
  validateStoreName(name: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('نام فروشگاه الزامی است');
    } else if (name.length < 2) {
      errors.push('نام فروشگاه باید حداقل ۲ کاراکتر باشد');
    } else if (name.length > 100) {
      errors.push('نام فروشگاه باید حداکثر ۱۰۰ کاراکتر باشد');
    }
    
    return { valid: errors.length === 0, errors };
  }

  validateSubdomain(subdomain: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const subdomainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?$/;
    
    if (!subdomain || subdomain.trim().length === 0) {
      errors.push('نام زیردامنه الزامی است');
    } else if (subdomain.length < 3) {
      errors.push('نام زیردامنه باید حداقل ۳ کاراکتر باشد');
    } else if (subdomain.length > 63) {
      errors.push('نام زیردامنه باید حداکثر ۶۳ کاراکتر باشد');
    } else if (!subdomainRegex.test(subdomain)) {
      errors.push('نام زیردامنه فقط می‌تواند شامل حروف انگلیسی، اعداد و خط تیره باشد');
    }
    
    // Reserved subdomains
    const reserved = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'localhost', 'test', 'staging'];
    if (reserved.includes(subdomain.toLowerCase())) {
      errors.push('این نام زیردامنه رزرو شده است');
    }
    
    return { valid: errors.length === 0, errors };
  }

  // Currency and formatting helpers
  formatCurrency(amount: number, currency: string = 'IRR'): string {
    const currencyFormats: { [key: string]: { symbol: string; decimals: number } } = {
      'IRR': { symbol: 'تومان', decimals: 0 },
      'USD': { symbol: '$', decimals: 2 },
      'EUR': { symbol: '€', decimals: 2 }
    };
    
    const format = currencyFormats[currency] || currencyFormats['IRR'];
    const formatted = amount.toLocaleString('fa-IR', {
      minimumFractionDigits: format.decimals,
      maximumFractionDigits: format.decimals
    });
    
    return currency === 'IRR' ? `${formatted} ${format.symbol}` : `${format.symbol}${formatted}`;
  }
}
