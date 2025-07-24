// src/app/services/payment.service.ts
/**
 * Mall Platform - Payment Service
 * Angular service for payment processing with Iranian gateways
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, timer } from 'rxjs';
import { map, catchError, takeWhile, switchMap, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface PaymentGateway {
  name: string;
  display_name: string;
  description: string;
  icon: string;
  fee_percentage: number;
  fee_fixed: number;
  min_amount: number;
  max_amount?: number;
  is_default: boolean;
}

export interface Payment {
  id: number;
  order_id: number;
  order_number: string;
  store_name: string;
  amount: number;
  gateway_fee: number;
  total_amount: number;
  gateway_type: string;
  status: string;
  tracking_code: string;
  gateway_transaction_id?: string;
  created_at: string;
  paid_at?: string;
  failure_reason?: string;
}

export interface PaymentInitiation {
  payment_id: number;
  payment_url: string;
  tracking_code: string;
  amount: number;
  gateway_fee: number;
  total_amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}`;
  private paymentsSubject = new BehaviorSubject<Payment[]>([]);
  private gatewaysSubject = new BehaviorSubject<PaymentGateway[]>([]);

  public payments$ = this.paymentsSubject.asObservable();
  public gateways$ = this.gatewaysSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadGateways();
  }

  private loadGateways(): void {
    this.getAvailableGateways().subscribe();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Payment Gateways
  getAvailableGateways(): Observable<PaymentGateway[]> {
    return this.http.get<any>(`${this.apiUrl}/payment/gateways/`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.gatewaysSubject.next(response.gateways);
          return response.gateways;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Payment Processing
  initiatePayment(orderId: number, gateway: string = 'zarinpal'): Observable<PaymentInitiation> {
    return this.http.post<any>(`${this.apiUrl}/payment/initiate/`, {
      order_id: orderId,
      gateway: gateway
    }, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response as PaymentInitiation;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  checkPaymentStatus(paymentId: number): Observable<Payment> {
    return this.http.get<any>(`${this.apiUrl}/payment/status/${paymentId}/`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.payment;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Payment History
  getPaymentHistory(page: number = 1, perPage: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/payment/history/`, {
      headers: this.getHeaders(),
      params: { 
        page: page.toString(), 
        per_page: perPage.toString() 
      }
    }).pipe(
      map(response => {
        if (response.success) {
          if (page === 1) {
            this.paymentsSubject.next(response.payments);
          }
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Payment Refund (for store owners)
  refundPayment(paymentId: number, amount?: number, reason?: string): Observable<any> {
    const data: any = {};
    if (amount) data.amount = amount;
    if (reason) data.reason = reason;

    return this.http.post<any>(`${this.apiUrl}/payment/refund/${paymentId}/`, data, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getPaymentHistory().subscribe(); // Refresh list
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Payment Status Polling
  pollPaymentStatus(paymentId: number, maxAttempts: number = 60): Observable<Payment> {
    return interval(5000).pipe(
      switchMap(() => this.checkPaymentStatus(paymentId)),
      takeWhile((payment, index) => {
        return payment.status === 'pending' && index < maxAttempts;
      }, true),
      take(maxAttempts)
    );
  }

  // Helper Methods
  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'pending': 'text-yellow-600 bg-yellow-100',
      'completed': 'text-green-600 bg-green-100',
      'failed': 'text-red-600 bg-red-100',
      'cancelled': 'text-gray-600 bg-gray-100',
      'refunded': 'text-purple-600 bg-purple-100'
    };
    return statusColors[status] || 'text-gray-600 bg-gray-100';
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'pending': 'در انتظار',
      'completed': 'موفق',
      'failed': 'ناموفق',
      'cancelled': 'لغو شده',
      'refunded': 'بازگردانده شده'
    };
    return statusTexts[status] || status;
  }

  getGatewayName(gateway: string): string {
    const gatewayNames: { [key: string]: string } = {
      'zarinpal': 'زرین‌پال',
      'mellat': 'بانک ملت',
      'saman': 'بانک سامان',
      'parsian': 'بانک پارسیان',
      'pasargad': 'بانک پاسارگاد'
    };
    return gatewayNames[gateway] || gateway;
  }

  calculateGatewayFee(amount: number, gateway: PaymentGateway): number {
    let fee = 0;
    if (gateway.fee_percentage) {
      fee += amount * (gateway.fee_percentage / 100);
    }
    if (gateway.fee_fixed) {
      fee += gateway.fee_fixed;
    }
    return Math.round(fee);
  }

  validateAmount(amount: number, gateway: PaymentGateway): { valid: boolean; message?: string } {
    if (gateway.min_amount && amount < gateway.min_amount) {
      return {
        valid: false,
        message: `حداقل مبلغ پرداخت ${this.formatCurrency(gateway.min_amount)} است`
      };
    }

    if (gateway.max_amount && amount > gateway.max_amount) {
      return {
        valid: false,
        message: `حداکثر مبلغ پرداخت ${this.formatCurrency(gateway.max_amount)} است`
      };
    }

    return { valid: true };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('ریال', 'تومان');
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fa-IR').format(num);
  }

  // Payment Flow Management
  redirectToPayment(paymentUrl: string): void {
    window.location.href = paymentUrl;
  }

  openPaymentInNewTab(paymentUrl: string): Window | null {
    return window.open(paymentUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  }

  // Local Storage for Payment Tracking
  savePaymentInfo(paymentId: number, orderId: number): void {
    const paymentInfo = {
      paymentId,
      orderId,
      timestamp: Date.now()
    };
    localStorage.setItem('pendingPayment', JSON.stringify(paymentInfo));
  }

  getPendingPayment(): { paymentId: number; orderId: number; timestamp: number } | null {
    const stored = localStorage.getItem('pendingPayment');
    if (stored) {
      const paymentInfo = JSON.parse(stored);
      // Check if payment info is less than 1 hour old
      if (Date.now() - paymentInfo.timestamp < 3600000) {
        return paymentInfo;
      } else {
        this.clearPendingPayment();
      }
    }
    return null;
  }

  clearPendingPayment(): void {
    localStorage.removeItem('pendingPayment');
  }

  // Payment Analytics (for store owners)
  getPaymentAnalytics(days: number = 30): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/payment/analytics/`, {
      headers: this.getHeaders(),
      params: { days: days.toString() }
    }).pipe(
      map(response => {
        if (response.success) {
          return response.analytics;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Gateway Configuration (for store owners)
  configureGateway(gatewayData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payment/configure-gateway/`, gatewayData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getAvailableGateways().subscribe(); // Refresh gateways
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Payment Receipt Generation
  generateReceipt(paymentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/payment/receipt/${paymentId}/`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  downloadReceipt(paymentId: number, fileName?: string): void {
    this.generateReceipt(paymentId).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `receipt-${paymentId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // Payment Verification for Customers
  verifyPaymentByTrackingCode(trackingCode: string): Observable<Payment> {
    return this.http.get<any>(`${this.apiUrl}/payment/verify/${trackingCode}/`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.payment;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Payment Reminders (for pending payments)
  sendPaymentReminder(orderId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payment/remind/${orderId}/`, {}, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Payment Link Generation (for store owners)
  generatePaymentLink(orderId: number, expiryHours: number = 24): Observable<string> {
    return this.http.post<any>(`${this.apiUrl}/payment/generate-link/`, {
      order_id: orderId,
      expiry_hours: expiryHours
    }, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.payment_link;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Payment Disputes (for customers)
  reportPaymentDispute(paymentId: number, reason: string, description: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payment/dispute/${paymentId}/`, {
      reason,
      description
    }, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Batch Payment Processing (for multiple orders)
  initiateBatchPayment(orderIds: number[], gateway: string = 'zarinpal'): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payment/batch-initiate/`, {
      order_ids: orderIds,
      gateway: gateway
    }, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Payment Statistics for Dashboard
  getPaymentStats(period: string = 'month'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/payment/stats/`, {
      headers: this.getHeaders(),
      params: { period }
    }).pipe(
      map(response => {
        if (response.success) {
          return response.stats;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Currency Conversion (if needed for international payments)
  convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/payment/convert/`, {
      headers: this.getHeaders(),
      params: {
        amount: amount.toString(),
        from: fromCurrency,
        to: toCurrency
      }
    }).pipe(
      map(response => {
        if (response.success) {
          return response.converted_amount;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Payment Method Preferences
  savePaymentPreference(gateway: string): void {
    localStorage.setItem('preferredPaymentGateway', gateway);
  }

  getPaymentPreference(): string | null {
    return localStorage.getItem('preferredPaymentGateway');
  }

  // Error Handling
  private handleError = (error: any) => {
    console.error('Payment Service Error:', error);
    throw error.error?.message || error.message || 'خطای سیستم';
  };

  // Payment Flow Tracking
  trackPaymentFlow(paymentId: number, event: string, data?: any): void {
    // Analytics tracking for payment flow
    const trackingData = {
      payment_id: paymentId,
      event: event,
      timestamp: new Date().toISOString(),
      data: data || {}
    };
    
    // Send to analytics service
    this.http.post(`${this.apiUrl}/payment/track/`, trackingData, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => console.log('Payment event tracked:', event),
      error: (error) => console.warn('Failed to track payment event:', error)
    });
  }

  // Payment Security
  validatePaymentSecurity(paymentData: any): boolean {
    // Basic client-side validation
    if (!paymentData.order_id || !paymentData.gateway) {
      return false;
    }
    
    // Check for suspicious patterns
    if (paymentData.amount <= 0) {
      return false;
    }
    
    return true;
  }

  // Payment Notifications
  subscribeToPaymentNotifications(paymentId: number): Observable<any> {
    // WebSocket connection for real-time payment updates
    // This would typically use WebSocket or Server-Sent Events
    return new Observable(observer => {
      const eventSource = new EventSource(
        `${this.apiUrl}/payment/notifications/${paymentId}/`
      );
      
      eventSource.onmessage = event => {
        observer.next(JSON.parse(event.data));
      };
      
      eventSource.onerror = error => {
        observer.error(error);
      };
      
      return () => {
        eventSource.close();
      };
    });
  }
}
