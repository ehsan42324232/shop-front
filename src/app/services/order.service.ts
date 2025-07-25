import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Order {
  id: number;
  order_number: string;
  customer: {
    id: number;
    name: string;
    phone: string;
    email?: string;
  };
  items: OrderItem[];
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  shipping_cost: number;
  final_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  delivery_method: DeliveryMethod;
  payment_method: PaymentMethod;
  notes?: string;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string;
  tracking_code?: string;
  discount_code?: string;
}

export interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    image?: string;
    sku?: string;
  };
  product_instance: {
    id: number;
    attributes: { [key: string]: any };
    price: number;
    stock: number;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
  discount_amount: number;
  notes?: string;
}

export interface ShippingAddress {
  id?: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  is_default?: boolean;
}

export interface DeliveryMethod {
  id: number;
  name: string;
  description?: string;
  cost: number;
  estimated_days: number;
  is_available: boolean;
}

export interface PaymentMethod {
  id: number;
  name: string;
  type: 'gateway' | 'cash' | 'card' | 'transfer';
  is_available: boolean;
  gateway_name?: string;
}

export type OrderStatus = 
  | 'pending'           // در انتظار تأیید
  | 'confirmed'         // تأیید شده
  | 'processing'        // در حال آماده‌سازی
  | 'ready_to_ship'     // آماده ارسال
  | 'shipped'           // ارسال شده
  | 'delivered'         // تحویل داده شده
  | 'returned'          // مرجوع شده
  | 'cancelled'         // لغو شده
  | 'refunded';         // بازپرداخت شده

export type PaymentStatus = 
  | 'pending'           // در انتظار پرداخت
  | 'paid'              // پرداخت شده
  | 'failed'            // ناموفق
  | 'refunded'          // بازپرداخت شده
  | 'partially_paid'    // پرداخت جزئی
  | 'cancelled';        // لغو شده

export interface OrderFilters {
  status?: OrderStatus[];
  payment_status?: PaymentStatus[];
  date_from?: string;
  date_to?: string;
  customer_search?: string;
  order_number?: string;
  min_amount?: number;
  max_amount?: number;
  delivery_method?: number;
  payment_method?: number;
}

export interface OrderSummary {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  average_order_value: number;
  orders_growth: number;
  revenue_growth: number;
}

export interface OrderStatusHistory {
  id: number;
  status: OrderStatus;
  notes?: string;
  created_at: string;
  created_by?: {
    id: number;
    name: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private orderSummarySubject = new BehaviorSubject<OrderSummary | null>(null);
  
  public orders$ = this.ordersSubject.asObservable();
  public orderSummary$ = this.orderSummarySubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all orders with filtering and pagination
   */
  getOrders(filters: OrderFilters = {}, page: number = 1, limit: number = 20): Observable<{
    results: Order[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Add filters
    if (filters.status && filters.status.length > 0) {
      params = params.set('status', filters.status.join(','));
    }
    if (filters.payment_status && filters.payment_status.length > 0) {
      params = params.set('payment_status', filters.payment_status.join(','));
    }
    if (filters.date_from) {
      params = params.set('date_from', filters.date_from);
    }
    if (filters.date_to) {
      params = params.set('date_to', filters.date_to);
    }
    if (filters.customer_search) {
      params = params.set('customer_search', filters.customer_search);
    }
    if (filters.order_number) {
      params = params.set('order_number', filters.order_number);
    }
    if (filters.min_amount) {
      params = params.set('min_amount', filters.min_amount.toString());
    }
    if (filters.max_amount) {
      params = params.set('max_amount', filters.max_amount.toString());
    }

    return this.http.get<{
      results: Order[];
      count: number;
      next: string | null;
      previous: string | null;
    }>(`${this.apiUrl}/`, { params })
      .pipe(
        tap(response => {
          if (page === 1) {
            this.ordersSubject.next(response.results);
          }
        })
      );
  }

  /**
   * Get single order by ID
   */
  getOrder(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}/`);
  }

  /**
   * Get order by order number
   */
  getOrderByNumber(orderNumber: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/by-number/${orderNumber}/`);
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderId: number, status: OrderStatus, notes?: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/status/`, {
      status,
      notes
    }).pipe(
      tap(updatedOrder => {
        this.updateOrderInList(updatedOrder);
      })
    );
  }

  /**
   * Update payment status
   */
  updatePaymentStatus(orderId: number, paymentStatus: PaymentStatus, notes?: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/payment-status/`, {
      payment_status: paymentStatus,
      notes
    }).pipe(
      tap(updatedOrder => {
        this.updateOrderInList(updatedOrder);
      })
    );
  }

  /**
   * Add tracking information
   */
  addTrackingInfo(orderId: number, trackingCode: string, carrierName?: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/tracking/`, {
      tracking_code: trackingCode,
      carrier_name: carrierName
    }).pipe(
      tap(updatedOrder => {
        this.updateOrderInList(updatedOrder);
      })
    );
  }

  /**
   * Get order status history
   */
  getOrderStatusHistory(orderId: number): Observable<OrderStatusHistory[]> {
    return this.http.get<OrderStatusHistory[]>(`${this.apiUrl}/${orderId}/status-history/`);
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId: number, reason: string): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${orderId}/cancel/`, {
      reason
    }).pipe(
      tap(updatedOrder => {
        this.updateOrderInList(updatedOrder);
      })
    );
  }

  /**
   * Process refund
   */
  processRefund(orderId: number, amount: number, reason: string): Observable<{
    success: boolean;
    message: string;
    refund_id: string;
  }> {
    return this.http.post<{
      success: boolean;
      message: string;
      refund_id: string;
    }>(`${this.apiUrl}/${orderId}/refund/`, {
      amount,
      reason
    });
  }

  /**
   * Get order summary/statistics
   */
  getOrderSummary(dateRange?: { from: string; to: string }): Observable<OrderSummary> {
    let params = new HttpParams();
    
    if (dateRange) {
      params = params.set('date_from', dateRange.from)
                     .set('date_to', dateRange.to);
    }

    return this.http.get<OrderSummary>(`${this.apiUrl}/summary/`, { params })
      .pipe(
        tap(summary => {
          this.orderSummarySubject.next(summary);
        })
      );
  }

  /**
   * Export orders to CSV/Excel
   */
  exportOrders(filters: OrderFilters = {}, format: 'csv' | 'xlsx' = 'xlsx'): Observable<Blob> {
    let params = new HttpParams().set('format', format);
    
    // Add filters
    if (filters.status && filters.status.length > 0) {
      params = params.set('status', filters.status.join(','));
    }
    if (filters.date_from) {
      params = params.set('date_from', filters.date_from);
    }
    if (filters.date_to) {
      params = params.set('date_to', filters.date_to);
    }

    return this.http.get(`${this.apiUrl}/export/`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Send order confirmation email
   */
  sendOrderConfirmation(orderId: number): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/${orderId}/send-confirmation/`, {}
    );
  }

  /**
   * Send SMS notification
   */
  sendSMSNotification(orderId: number, messageType: 'confirmation' | 'shipped' | 'delivered'): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/${orderId}/send-sms/`, {
        message_type: messageType
      }
    );
  }

  /**
   * Get available delivery methods
   */
  getDeliveryMethods(): Observable<DeliveryMethod[]> {
    return this.http.get<DeliveryMethod[]>(`${environment.apiUrl}/delivery-methods/`);
  }

  /**
   * Get available payment methods
   */
  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${environment.apiUrl}/payment-methods/`);
  }

  /**
   * Get order status display name in Persian
   */
  getOrderStatusDisplay(status: OrderStatus): string {
    const statusMap: { [key in OrderStatus]: string } = {
      'pending': 'در انتظار تأیید',
      'confirmed': 'تأیید شده',
      'processing': 'در حال آماده‌سازی',
      'ready_to_ship': 'آماده ارسال',
      'shipped': 'ارسال شده',
      'delivered': 'تحویل داده شده',
      'returned': 'مرجوع شده',
      'cancelled': 'لغو شده',
      'refunded': 'بازپرداخت شده'
    };
    
    return statusMap[status] || status;
  }

  /**
   * Get payment status display name in Persian
   */
  getPaymentStatusDisplay(status: PaymentStatus): string {
    const statusMap: { [key in PaymentStatus]: string } = {
      'pending': 'در انتظار پرداخت',
      'paid': 'پرداخت شده',
      'failed': 'ناموفق',
      'refunded': 'بازپرداخت شده',
      'partially_paid': 'پرداخت جزئی',
      'cancelled': 'لغو شده'
    };
    
    return statusMap[status] || status;
  }

  /**
   * Get order status color for UI
   */
  getOrderStatusColor(status: OrderStatus): string {
    const colorMap: { [key in OrderStatus]: string } = {
      'pending': 'yellow',
      'confirmed': 'blue',
      'processing': 'purple',
      'ready_to_ship': 'indigo',
      'shipped': 'cyan',
      'delivered': 'green',
      'returned': 'orange',
      'cancelled': 'red',
      'refunded': 'gray'
    };
    
    return colorMap[status] || 'gray';
  }

  /**
   * Format order amount in Toman
   */
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  }

  /**
   * Calculate order totals
   */
  calculateOrderTotals(items: OrderItem[], shippingCost: number = 0, discountAmount: number = 0): {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const tax = Math.round(subtotal * 0.09); // 9% VAT
    const total = subtotal + tax + shippingCost - discountAmount;
    
    return {
      subtotal,
      tax,
      shipping: shippingCost,
      discount: discountAmount,
      total: Math.max(0, total)
    };
  }

  /**
   * Update order in local list
   */
  private updateOrderInList(updatedOrder: Order): void {
    const currentOrders = this.ordersSubject.value;
    const index = currentOrders.findIndex(order => order.id === updatedOrder.id);
    
    if (index !== -1) {
      currentOrders[index] = updatedOrder;
      this.ordersSubject.next([...currentOrders]);
    }
  }

  /**
   * Check if order can be cancelled
   */
  canCancelOrder(order: Order): boolean {
    return ['pending', 'confirmed', 'processing'].includes(order.status);
  }

  /**
   * Check if order can be refunded
   */
  canRefundOrder(order: Order): boolean {
    return order.payment_status === 'paid' && 
           ['delivered', 'returned'].includes(order.status);
  }

  /**
   * Get next possible statuses for an order
   */
  getNextPossibleStatuses(currentStatus: OrderStatus): OrderStatus[] {
    const statusFlow: { [key in OrderStatus]: OrderStatus[] } = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['processing', 'cancelled'],
      'processing': ['ready_to_ship', 'cancelled'],
      'ready_to_ship': ['shipped', 'cancelled'],
      'shipped': ['delivered', 'returned'],
      'delivered': ['returned'],
      'returned': ['refunded'],
      'cancelled': [],
      'refunded': []
    };
    
    return statusFlow[currentStatus] || [];
  }
}
