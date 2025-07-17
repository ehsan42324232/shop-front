import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DomainService, StoreConfig } from './domain.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializationService {
  constructor(
    private domainService: DomainService,
    private router: Router
  ) {}

  /**
   * Initialize the application based on domain
   */
  initializeApp(): Observable<boolean> {
    return this.domainService.initialize().pipe(
      tap((config: StoreConfig) => {
        console.log('Store initialized:', config.store.name);
        
        // Set up routing based on store configuration
        this.setupStoreRouting(config);
        
        // Apply additional store-specific initialization
        this.applyStoreSettings(config);
      }),
      catchError(error => {
        console.error('Failed to initialize store:', error);
        
        // Check if this is a domain not found error
        if (error.status === 404) {
          this.handleStoreNotFound();
        } else {
          this.handleInitializationError(error);
        }
        
        return of(false);
      }),
      tap(() => true)
    );
  }

  /**
   * Set up store-specific routing
   */
  private setupStoreRouting(config: StoreConfig): void {
    // You can dynamically modify routes based on store configuration
    // For example, disable certain routes if features are not enabled
    
    if (!config.features.categories_enabled) {
      // Could disable category routes
      console.log('Categories disabled for this store');
    }
    
    if (!config.features.attributes_enabled) {
      // Could disable attribute filtering
      console.log('Attributes disabled for this store');
    }
  }

  /**
   * Apply store-specific settings
   */
  private applyStoreSettings(config: StoreConfig): void {
    // Set up currency formatting
    this.setupCurrencyFormatting(config.store.currency);
    
    // Set up tax calculation
    this.setupTaxCalculation(config.store.tax_rate);
    
    // Apply any additional store-specific settings
    this.applyStoreSpecificCSS(config.theme);
  }

  /**
   * Set up currency formatting
   */
  private setupCurrencyFormatting(currency: string): void {
    // Store currency in a global service or localStorage
    localStorage.setItem('store_currency', currency);
  }

  /**
   * Set up tax calculation
   */
  private setupTaxCalculation(taxRate: number): void {
    // Store tax rate for calculations
    localStorage.setItem('store_tax_rate', taxRate.toString());
  }

  /**
   * Apply store-specific CSS
   */
  private applyStoreSpecificCSS(theme: any): void {
    // Additional CSS beyond what's in DomainService
    const additionalCSS = `
      .store-branding {
        --primary: ${theme.primary_color};
        --secondary: ${theme.secondary_color};
        --font-family: ${theme.font_family};
      }
      
      .btn-primary {
        background-color: ${theme.primary_color};
        border-color: ${theme.primary_color};
      }
      
      .btn-primary:hover {
        background-color: ${this.darkenColor(theme.primary_color, 10)};
        border-color: ${this.darkenColor(theme.primary_color, 10)};
      }
      
      .navbar-brand {
        color: ${theme.primary_color} !important;
      }
    `;
    
    this.injectCSS(additionalCSS, 'store-theme-css');
  }

  /**
   * Darken a color by a percentage
   */
  private darkenColor(color: string, percent: number): string {
    // Simple color darkening - you might want to use a more sophisticated library
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  /**
   * Inject CSS into the document
   */
  private injectCSS(css: string, id: string): void {
    let styleElement = document.getElementById(id) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = id;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = css;
  }

  /**
   * Handle store not found error
   */
  private handleStoreNotFound(): void {
    // Show a "store not found" page or redirect
    console.error('Store not found for this domain');
    
    // You could redirect to a generic "store not found" page
    this.router.navigate(['/store-not-found']);
  }

  /**
   * Handle other initialization errors
   */
  private handleInitializationError(error: any): void {
    console.error('Store initialization error:', error);
    
    // Show an error page or fallback
    this.router.navigate(['/error']);
  }

  /**
   * Check if app is initialized
   */
  isInitialized(): boolean {
    return this.domainService.getCurrentStoreConfig() !== null;
  }

  /**
   * Get current store config
   */
  getCurrentStoreConfig(): StoreConfig | null {
    return this.domainService.getCurrentStoreConfig();
  }

  /**
   * Reinitialize app (useful for testing or domain changes)
   */
  reinitialize(): Observable<boolean> {
    return this.initializeApp();
  }
}

/**
 * Factory function for APP_INITIALIZER
 */
export function appInitializerFactory(appInit: AppInitializationService): () => Observable<boolean> {
  return () => appInit.initializeApp();
}
