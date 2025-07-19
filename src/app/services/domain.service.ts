import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface DomainCheckResult {
  available: boolean;
  domain: string;
  suggestion?: string;
  price?: number;
  registrarInfo?: {
    name: string;
    contact: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // بررسی دسترسی دامنه .ir
  checkIrDomainAvailability(domainName: string): Observable<DomainCheckResult> {
    return this.http.get<DomainCheckResult>(`${this.apiUrl}/domains/check-ir`, {
      params: { domain: domainName }
    });
  }

  // بررسی دامنه‌های بین‌المللی
  checkInternationalDomainAvailability(domainName: string, tld: string = 'com'): Observable<DomainCheckResult> {
    return this.http.get<DomainCheckResult>(`${this.apiUrl}/domains/check-international`, {
      params: { domain: domainName, tld }
    });
  }

  // دریافت قیمت دامنه
  getDomainPrice(domain: string): Observable<{ price: number; currency: string; period: string }> {
    return this.http.get<any>(`${this.apiUrl}/domains/price`, {
      params: { domain }
    });
  }

  // ثبت دامنه
  registerDomain(domainData: {
    domain: string;
    storeId: string;
    ownerInfo: {
      name: string;
      email: string;
      phone: string;
      address: string;
      nationalId: string;
    };
  }): Observable<{ success: boolean; registrationId: string; message: string }> {
    return this.http.post<any>(`${this.apiUrl}/domains/register`, domainData);
  }

  // دریافت لیست دامنه‌های ثبت شده
  getRegisteredDomains(storeId: string): Observable<{
    domain: string;
    status: 'active' | 'pending' | 'expired' | 'suspended';
    registeredAt: Date;
    expiresAt: Date;
    autoRenew: boolean;
  }[]> {
    return this.http.get<any>(`${this.apiUrl}/stores/${storeId}/domains`);
  }

  // تمدید دامنه
  renewDomain(domainId: string, years: number = 1): Observable<{ success: boolean; message: string }> {
    return this.http.post<any>(`${this.apiUrl}/domains/${domainId}/renew`, { years });
  }

  // تنظیم DNS
  setupDNS(domainId: string, storeId: string): Observable<{ success: boolean; message: string; dnsRecords: any[] }> {
    return this.http.post<any>(`${this.apiUrl}/domains/${domainId}/setup-dns`, { storeId });
  }

  // تایید مالکیت دامنه
  verifyDomainOwnership(domainId: string): Observable<{ verified: boolean; method: string; instructions: string }> {
    return this.http.post<any>(`${this.apiUrl}/domains/${domainId}/verify`, {});
  }

  // پیشنهاد دامنه‌های مشابه
  suggestSimilarDomains(domainName: string): Observable<string[]> {
    return this.http.get<{ suggestions: string[] }>(`${this.apiUrl}/domains/suggestions`, {
      params: { domain: domainName }
    }).pipe(map(response => response.suggestions));
  }

  // اعتبارسنجی نام دامنه
  validateDomainName(domainName: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // حداقل و حداکثر طول
    if (domainName.length < 3) {
      errors.push('نام دامنه باید حداقل ۳ کاراکتر باشد');
    }
    if (domainName.length > 63) {
      errors.push('نام دامنه باید حداکثر ۶۳ کاراکتر باشد');
    }
    
    // کاراکترهای مجاز
    const validPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;
    if (!validPattern.test(domainName)) {
      errors.push('نام دامنه فقط می‌تواند شامل حروف انگلیسی، اعداد و خط تیره باشد');
    }
    
    // نمی‌تواند با خط تیره شروع یا تمام شود
    if (domainName.startsWith('-') || domainName.endsWith('-')) {
      errors.push('نام دامنه نمی‌تواند با خط تیره شروع یا تمام شود');
    }
    
    // دو خط تیره متوالی مجاز نیست
    if (domainName.includes('--')) {
      errors.push('دو خط تیره متوالی مجاز نیست');
    }
    
    // کلمات رزرو شده
    const reservedWords = [
      'www', 'api', 'admin', 'app', 'mail', 'ftp', 'localhost', 
      'test', 'staging', 'dev', 'development', 'prod', 'production',
      'blog', 'shop', 'store', 'news', 'support', 'help'
    ];
    
    if (reservedWords.includes(domainName.toLowerCase())) {
      errors.push('این نام دامنه رزرو شده است');
    }
    
    return { valid: errors.length === 0, errors };
  }

  // تولید پیشنهادات خودکار
  generateDomainSuggestions(baseName: string): string[] {
    const suggestions: string[] = [];
    const cleanName = baseName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    
    // پیشوندها و پسوندها
    const prefixes = ['my', 'best', 'top', 'super', 'mega', 'pro'];
    const suffixes = ['shop', 'store', 'market', 'plaza', 'center', 'hub', 'zone'];
    
    // اضافه کردن اعداد
    for (let i = 1; i <= 99; i++) {
      suggestions.push(`${cleanName}${i}`);
      if (suggestions.length >= 10) break;
    }
    
    // اضافه کردن پیشوند
    for (const prefix of prefixes) {
      suggestions.push(`${prefix}${cleanName}`);
      if (suggestions.length >= 15) break;
    }
    
    // اضافه کردن پسوند
    for (const suffix of suffixes) {
      suggestions.push(`${cleanName}${suffix}`);
      if (suggestions.length >= 20) break;
    }
    
    return suggestions.slice(0, 10);
  }

  // کش کردن نتایج بررسی دامنه
  private domainCheckCache = new Map<string, { result: DomainCheckResult; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 دقیقه

  checkDomainWithCache(domainName: string): Observable<DomainCheckResult> {
    const cacheKey = `${domainName}.ir`;
    const cached = this.domainCheckCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return new Observable(observer => {
        observer.next(cached.result);
        observer.complete();
      });
    }
    
    return this.checkIrDomainAvailability(domainName).pipe(
      map(result => {
        this.domainCheckCache.set(cacheKey, {
          result,
          timestamp: Date.now()
        });
        return result;
      })
    );
  }

  // پاکسازی کش
  clearDomainCache(): void {
    this.domainCheckCache.clear();
  }
}
