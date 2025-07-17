import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface StoreConfig {
  store: {
    id: string;
    name: string;
    description: string;
    domain: string;
    currency: string;
    tax_rate: number;
    email: string;
    phone: string;
    address: string;
    logo: string | null;
  };
  theme: {
    store_name: string;
    store_logo: string | null;
    primary_color: string;
    secondary_color: string;
    font_family: string;
    custom_css: string;
    favicon: string | null;
  };
  features: {
    attributes_enabled: boolean;
    categories_enabled: boolean;
    featured_products_enabled: boolean;
  };
}

export interface DomainStatus {
  status: 'active' | 'not_found';
  store_id?: string;
  store_name?: string;
  domain: string;
  configured: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private storeConfigSubject = new BehaviorSubject<StoreConfig | null>(null);
  private domainStatusSubject = new BehaviorSubject<DomainStatus | null>(null);
  
  public storeConfig$ = this.storeConfigSubject.asObservable();
  public domainStatus$ = this.domainStatusSubject.asObservable();
  
  private currentDomain: string;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.currentDomain = window.location.hostname;
    this.apiUrl = this.getApiUrl();
  }

  private getApiUrl(): string {
    // Check if we're on a custom domain or the main domain
    const isCustomDomain = this.currentDomain !== 'localhost' && 
                           this.currentDomain !== '127.0.0.1' && 
                           !this.currentDomain.includes('localhost');
    
    if (isCustomDomain) {
      // Use the current domain for API calls
      return `${window.location.protocol}//${this.currentDomain}/api`;
    } else {
      // Use the configured API URL
      return environment.apiUrl;
    }
  }

  /**
   * Initialize the domain service by loading store configuration
   */
  initialize(): Observable<StoreConfig> {
    return this.loadStoreConfig().pipe(
      tap(config => {
        this.storeConfigSubject.next(config);
        this.applyStoreTheme(config.theme);
      }),
      catchError(error => {
        console.error('Failed to initialize domain service:', error);
        this.storeConfigSubject.next(null);
        throw error;
      })
    );
  }

  /**
   * Load store configuration for the current domain
   */
  loadStoreConfig(): Observable<StoreConfig> {
    return this.http.get<StoreConfig>(`${this.apiUrl}/config/store_config`);
  }

  /**
   * Check domain status
   */
  checkDomainStatus(): Observable<DomainStatus> {
    return this.http.get<DomainStatus>(`${this.apiUrl}/config/domain_status`).pipe(
      tap(status => {
        this.domainStatusSubject.next(status);
      })
    );
  }

  /**
   * Get current store configuration
   */
  getCurrentStoreConfig(): StoreConfig | null {
    return this.storeConfigSubject.value;
  }

  /**
   * Get current domain status
   */
  getCurrentDomainStatus(): DomainStatus | null {
    return this.domainStatusSubject.value;
  }

  /**
   * Apply store theme to the document
   */
  private applyStoreTheme(theme: any): void {
    if (!theme) return;

    const root = document.documentElement;
    
    // Apply CSS custom properties
    if (theme.primary_color) {
      root.style.setProperty('--store-primary-color', theme.primary_color);
    }
    if (theme.secondary_color) {
      root.style.setProperty('--store-secondary-color', theme.secondary_color);
    }
    if (theme.font_family) {
      root.style.setProperty('--store-font-family', theme.font_family);
    }

    // Update page title
    if (theme.store_name) {
      document.title = theme.store_name;
    }

    // Update favicon
    if (theme.favicon) {
      this.updateFavicon(theme.favicon);
    }

    // Apply custom CSS
    if (theme.custom_css) {
      this.applyCustomCSS(theme.custom_css);
    }
  }

  /**
   * Update favicon
   */
  private updateFavicon(faviconUrl: string): void {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || 
                document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  /**
   * Apply custom CSS
   */
  private applyCustomCSS(css: string): void {
    const styleId = 'store-custom-css';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = css;
  }

  /**
   * Check if current domain is a custom store domain
   */
  isCustomDomain(): boolean {
    return this.currentDomain !== 'localhost' && 
           this.currentDomain !== '127.0.0.1' && 
           !this.currentDomain.includes('localhost');
  }

  /**
   * Get store-specific API URL
   */
  getStoreApiUrl(): string {
    return this.apiUrl;
  }

  /**
   * Get current domain
   */
  getCurrentDomain(): string {
    return this.currentDomain;
  }

  /**
   * Redirect to store admin
   */
  redirectToAdmin(): void {
    const adminUrl = this.isCustomDomain() 
      ? `${window.location.protocol}//${this.currentDomain}/admin`
      : `${environment.adminUrl}`;
    window.location.href = adminUrl;
  }

  /**
   * Redirect to main platform
   */
  redirectToPlatform(): void {
    window.location.href = environment.platformUrl || 'https://platform.yoursite.com';
  }
}
