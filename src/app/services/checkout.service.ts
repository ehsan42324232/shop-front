import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Order, CheckoutRequest, DeliveryOption, TimeSlot, Address } from '../models/order.models';
import { ShippingMethod, PaymentMethod } from '../models/store.models';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private apiUrl = '/api/checkout/';
  private checkoutDataSubject = new BehaviorSubject<CheckoutData | null>(null);
  public checkoutData$ = this.checkoutDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('X-Store-Domain', window.location.hostname);
  }

  // Initialize checkout process
  initializeCheckout(): Observable<CheckoutData> {
    const headers = this.getHeaders();
    return this.http.post<CheckoutData>(`${this.apiUrl}initialize/`, {}, { headers });
  }

  // Get available shipping methods
  getShippingMethods(address: Address): Observable<ShippingMethod[]> {
    const headers = this.getHeaders();
    return this.http.post<ShippingMethod[]>(`${this.apiUrl}shipping-methods/`, { address }, { headers });
  }

  // Get available payment methods
  getPaymentMethods(): Observable<PaymentMethod[]> {
    const headers = this.getHeaders();
    return this.http.get<PaymentMethod[]>(`${this.apiUrl}payment-methods/`, { headers });
  }

  // Get delivery options and time slots
  getDeliveryOptions(address: Address, shippingMethodId: number): Observable<DeliveryOption[]> {
    const headers = this.getHeaders();
    return this.http.post<DeliveryOption[]>(`${this.apiUrl}delivery-options/`, {
      address,
      shipping_method_id: shippingMethodId
    }, { headers });
  }

  // Get available time slots for a specific date
  getTimeSlots(date: string, shippingMethodId: number, address: Address): Observable<TimeSlot[]> {
    const headers = this.getHeaders();
    return this.http.post<TimeSlot[]>(`${this.apiUrl}time-slots/`, {
      date,
      shipping_method_id: shippingMethodId,
      address
    }, { headers });
  }

  // Calculate shipping cost
  calculateShipping(address: Address, shippingMethodId: number): Observable<ShippingCalculation> {
    const headers = this.getHeaders();
    return this.http.post<ShippingCalculation>(`${this.apiUrl}calculate-shipping/`, {
      address,
      shipping_method_id: shippingMethodId
    }, { headers });
  }

  // Calculate tax
  calculateTax(address: Address): Observable<TaxCalculation> {
    const headers = this.getHeaders();
    return this.http.post<TaxCalculation>(`${this.apiUrl}calculate-tax/`, { address }, { headers });
  }

  // Apply coupon
  applyCoupon(couponCode: string): Observable<CouponResult> {
    const headers = this.getHeaders();
    return this.http.post<CouponResult>(`${this.apiUrl}apply-coupon/`, { code: couponCode }, { headers });
  }

  // Remove coupon
  removeCoupon(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}remove-coupon/`, {}, { headers });
  }

  // Validate address
  validateAddress(address: Address): Observable<AddressValidation> {
    const headers = this.getHeaders();
    return this.http.post<AddressValidation>(`${this.apiUrl}validate-address/`, { address }, { headers });
  }

  // Save address
  saveAddress(address: Address): Observable<Address> {
    const headers = this.getHeaders();
    return this.http.post<Address>(`${this.apiUrl}save-address/`, address, { headers });
  }

  // Get saved addresses
  getSavedAddresses(): Observable<Address[]> {
    const headers = this.getHeaders();
    return this.http.get<Address[]>(`${this.apiUrl}addresses/`, { headers });
  }

  // Create order
  createOrder(checkoutData: CheckoutRequest): Observable<Order> {
    const headers = this.getHeaders();
    return this.http.post<Order>(`${this.apiUrl}create-order/`, checkoutData, { headers });
  }

  // Process payment
  processPayment(orderId: number, paymentData: any): Observable<PaymentResult> {
    const headers = this.getHeaders();
    return this.http.post<PaymentResult>(`${this.apiUrl}process-payment/`, {
      order_id: orderId,
      payment_data: paymentData
    }, { headers });
  }

  // Confirm order
  confirmOrder(orderId: number): Observable<Order> {
    const headers = this.getHeaders();
    return this.http.post<Order>(`${this.apiUrl}confirm-order/`, { order_id: orderId }, { headers });
  }

  // Get order summary
  getOrderSummary(): Observable<OrderSummary> {
    const headers = this.getHeaders();
    return this.http.get<OrderSummary>(`${this.apiUrl}summary/`, { headers });
  }

  // Update checkout data
  updateCheckoutData(data: Partial<CheckoutData>): void {
    const currentData = this.checkoutDataSubject.value;
    this.checkoutDataSubject.next({ ...currentData, ...data } as CheckoutData);
  }

  // Clear checkout data
  clearCheckoutData(): void {
    this.checkoutDataSubject.next(null);
  }

  // Get current checkout data
  getCurrentCheckoutData(): CheckoutData | null {
    return this.checkoutDataSubject.value;
  }
}

export interface CheckoutData {
  items: any[];
  shipping_address?: Address;
  billing_address?: Address;
  shipping_method?: ShippingMethod;
  payment_method?: PaymentMethod;
  delivery_date?: string;
  delivery_time_slot?: string;
  coupon_code?: string;
  notes?: string;
  totals: OrderTotals;
}

export interface OrderTotals {
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
}

export interface ShippingCalculation {
  cost: number;
  estimated_delivery_date: string;
  is_available: boolean;
  restrictions?: string[];
}

export interface TaxCalculation {
  tax_amount: number;
  tax_rate: number;
  tax_breakdown: { [key: string]: number };
}

export interface CouponResult {
  is_valid: boolean;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  message: string;
  restrictions?: string[];
}

export interface AddressValidation {
  is_valid: boolean;
  suggestions?: Address[];
  errors?: string[];
  warnings?: string[];
}

export interface PaymentResult {
  success: boolean;
  transaction_id?: string;
  payment_method: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  message: string;
  redirect_url?: string;
}

export interface OrderSummary {
  items: any[];
  totals: OrderTotals;
  shipping_address?: Address;
  billing_address?: Address;
  shipping_method?: ShippingMethod;
  payment_method?: PaymentMethod;
  delivery_info?: {
    date: string;
    time_slot: string;
    estimated_delivery: string;
  };
}
