// src/app/services/sms-campaign.service.ts
/**
 * Mall Platform - SMS Campaign Service
 * Angular service for SMS campaign management
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface SMSTemplate {
  id: number;
  name: string;
  template_type: string;
  subject: string;
  message: string;
  variables: string[];
  is_active: boolean;
  send_immediately: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerSegment {
  id: number;
  name: string;
  segment_type: string;
  description: string;
  criteria: any;
  customer_count: number;
  last_updated: string;
  created_at: string;
}

export interface SMSCampaign {
  id: number;
  name: string;
  description: string;
  template?: SMSTemplate;
  custom_message: string;
  segments: CustomerSegment[];
  custom_recipients: any[];
  send_type: string;
  scheduled_at?: string;
  is_recurring: boolean;
  recurrence_pattern: any;
  status: string;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  estimated_cost: number;
  actual_cost: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface DeliveryReport {
  id: number;
  mobile_number: string;
  name: string;
  status: string;
  sent_at?: string;
  delivered_at?: string;
  cost: number;
  gateway_message_id: string;
}

export interface CampaignAnalytics {
  summary: {
    total_campaigns: number;
    total_sent: number;
    total_delivered: number;
    delivery_rate: number;
    total_cost: number;
    average_cost_per_campaign: number;
  };
  template_performance: any[];
  segment_performance: any[];
  recent_campaigns: any[];
}

@Injectable({
  providedIn: 'root'
})
export class SmsCampaignService {
  private apiUrl = `${environment.apiUrl}`;
  private campaignsSubject = new BehaviorSubject<SMSCampaign[]>([]);
  private templatesSubject = new BehaviorSubject<SMSTemplate[]>([]);
  private segmentsSubject = new BehaviorSubject<CustomerSegment[]>([]);

  public campaigns$ = this.campaignsSubject.asObservable();
  public templates$ = this.templatesSubject.asObservable();
  public segments$ = this.segmentsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.getTemplates().subscribe();
    this.getSegments().subscribe();
    this.getCampaigns().subscribe();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // SMS Templates
  getTemplates(): Observable<SMSTemplate[]> {
    return this.http.get<any>(`${this.apiUrl}/sms/templates/`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.templatesSubject.next(response.templates);
          return response.templates;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  createTemplate(templateData: Partial<SMSTemplate>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sms/templates/`, templateData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getTemplates().subscribe(); // Refresh list
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  updateTemplate(templateId: number, templateData: Partial<SMSTemplate>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/sms/templates/${templateId}/`, templateData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getTemplates().subscribe(); // Refresh list
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  deleteTemplate(templateId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/sms/templates/${templateId}/`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getTemplates().subscribe(); // Refresh list
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  getTemplateVariables(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sms/template-variables/`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.variables;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  previewTemplate(message: string, templateType: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sms/preview-template/`, {
      message,
      template_type: templateType
    }, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.preview;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Customer Segments
  getSegments(): Observable<CustomerSegment[]> {
    return this.http.get<any>(`${this.apiUrl}/sms/segments/`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.segmentsSubject.next(response.segments);
          return response.segments;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  createSegment(segmentData: Partial<CustomerSegment>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sms/segments/`, segmentData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getSegments().subscribe(); // Refresh list
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  updateSegment(segmentId: number, segmentData: Partial<CustomerSegment>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/sms/segments/${segmentId}/`, segmentData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getSegments().subscribe(); // Refresh list
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  deleteSegment(segmentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/sms/segments/${segmentId}/`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getSegments().subscribe(); // Refresh list
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  refreshSegmentCount(segmentId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sms/segments/${segmentId}/refresh/`, {}, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getSegments().subscribe(); // Refresh list
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  previewSegment(segmentId: number, page: number = 1, perPage: number = 50): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sms/segments/${segmentId}/preview/`, {
      headers: this.getHeaders(),
      params: { page: page.toString(), per_page: perPage.toString() }
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

  // SMS Campaigns
  getCampaigns(page: number = 1, perPage: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sms/campaigns/`, {
      headers: this.getHeaders(),
      params: { page: page.toString(), per_page: perPage.toString() }
    }).pipe(
      map(response => {
        if (response.success) {
          if (page === 1) {
            this.campaignsSubject.next(response.campaigns);
          }
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  createCampaign(campaignData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sms/campaigns/`, campaignData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getCampaigns().subscribe(); // Refresh list
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  getCampaign(campaignId: number): Observable<SMSCampaign> {
    return this.http.get<any>(`${this.apiUrl}/sms/campaigns/${campaignId}/`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.campaign;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  updateCampaign(campaignId: number, campaignData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/sms/campaigns/${campaignId}/`, campaignData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getCampaigns().subscribe(); // Refresh list
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  deleteCampaign(campaignId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/sms/campaigns/${campaignId}/`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getCampaigns().subscribe(); // Refresh list
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  startCampaign(campaignId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sms/campaigns/${campaignId}/start/`, {}, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getCampaigns().subscribe(); // Refresh list
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  pauseCampaign(campaignId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sms/campaigns/${campaignId}/pause/`, {}, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getCampaigns().subscribe(); // Refresh list
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  resumeCampaign(campaignId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sms/campaigns/${campaignId}/resume/`, {}, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          this.getCampaigns().subscribe(); // Refresh list
          return response;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  getCampaignDeliveryReport(campaignId: number, page: number = 1, perPage: number = 50): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sms/campaigns/${campaignId}/delivery-report/`, {
      headers: this.getHeaders(),
      params: { page: page.toString(), per_page: perPage.toString() }
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

  // Analytics
  getAnalytics(days: number = 30): Observable<CampaignAnalytics> {
    return this.http.get<any>(`${this.apiUrl}/sms/analytics/`, {
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

  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sms/dashboard/`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.success) {
          return response.dashboard;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // Utilities
  testSMS(mobile: string, message: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sms/test/`, {
      mobile,
      message
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

  bulkImportRecipients(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.post<any>(`${this.apiUrl}/sms/bulk-import/`, formData, {
      headers
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

  // Helper methods
  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'draft': 'text-gray-600',
      'scheduled': 'text-blue-600',
      'sending': 'text-yellow-600',
      'completed': 'text-green-600',
      'paused': 'text-orange-600',
      'cancelled': 'text-red-600',
      'failed': 'text-red-600'
    };
    return statusColors[status] || 'text-gray-600';
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'draft': 'پیش‌نویس',
      'scheduled': 'زمان‌بندی شده',
      'sending': 'در حال ارسال',
      'completed': 'تکمیل شده',
      'paused': 'متوقف شده',
      'cancelled': 'لغو شده',
      'failed': 'ناموفق'
    };
    return statusTexts[status] || status;
  }

  getTemplateTypeText(type: string): string {
    const typeTexts: { [key: string]: string } = {
      'welcome': 'خوش‌آمدگویی',
      'order_confirmation': 'تایید سفارش',
      'shipping_notification': 'اطلاع‌رسانی ارسال',
      'delivery_confirmation': 'تایید تحویل',
      'payment_reminder': 'یادآوری پرداخت',
      'promotion': 'تبلیغات و تخفیف',
      'birthday': 'تبریک تولد',
      'abandoned_cart': 'سبد خرید رها شده',
      'feedback_request': 'درخواست نظر',
      'loyalty_reward': 'پاداش وفاداری',
      'custom': 'سفارشی'
    };
    return typeTexts[type] || type;
  }

  getSegmentTypeText(type: string): string {
    const typeTexts: { [key: string]: string } = {
      'all_customers': 'همه مشتریان',
      'new_customers': 'مشتریان جدید',
      'returning_customers': 'مشتریان بازگشتی',
      'high_value': 'مشتریان پرارزش',
      'inactive': 'مشتریان غیرفعال',
      'birthday_this_month': 'تولد این ماه',
      'location_based': 'بر اساس موقعیت',
      'purchase_behavior': 'بر اساس رفتار خرید',
      'custom': 'سفارشی'
    };
    return typeTexts[type] || type;
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

  private handleError = (error: any) => {
    console.error('SMS Campaign Service Error:', error);
    throw error.error?.message || error.message || 'خطای سیستم';
  };
}
