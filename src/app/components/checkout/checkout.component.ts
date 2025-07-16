import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService, CheckoutData } from '../../services/checkout.service';
import { BasketService } from '../../services/basket.service';
import { Address, Order } from '../../models/order.models';
import { ShippingMethod, PaymentMethod } from '../../models/store.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkout',
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Checkout Form -->
          <div class="lg:col-span-2 space-y-8">
            
            <!-- Shipping Address -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <form [formGroup]="shippingForm" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" formControlName="first_name" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" formControlName="last_name" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" formControlName="address_line_1" placeholder="Street address" 
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" formControlName="city" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input type="text" formControlName="state" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input type="text" formControlName="postal_code" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  </div>
                </div>
              </form>
            </div>

            <!-- Shipping Method -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Shipping Method</h2>
              <div class="space-y-3">
                <div *ngFor="let method of shippingMethods" 
                     class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer"
                     (click)="selectShippingMethod(method)"
                     [class.border-blue-500]="selectedShippingMethod?.id === method.id"
                     [class.bg-blue-50]="selectedShippingMethod?.id === method.id">
                  <input type="radio" [checked]="selectedShippingMethod?.id === method.id" 
                         class="text-blue-600 focus:ring-blue-500">
                  <div class="ml-3 flex-1">
                    <div class="flex justify-between items-center">
                      <h3 class="text-sm font-medium text-gray-900">{{ method.name }}</h3>
                      <span class="text-sm font-medium text-gray-900">\${{ method.price }}</span>
                    </div>
                    <p class="text-sm text-gray-500">{{ method.description }}</p>
                    <p class="text-xs text-gray-400">Estimated delivery: {{ method.estimated_days }} days</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delivery Options -->
            <div *ngIf="selectedShippingMethod" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Delivery Options</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                  <input type="date" [(ngModel)]="selectedDeliveryDate" 
                         [min]="minDeliveryDate"
                         (change)="onDeliveryDateChange()"
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                
                <div *ngIf="selectedDeliveryDate">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                  <select [(ngModel)]="selectedTimeSlot" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select time slot</option>
                    <option *ngFor="let slot of availableTimeSlots" [value]="slot.id">
                      {{ slot.label }} 
                      <span *ngIf="slot.additional_fee">(+\${{ slot.additional_fee }})</span>
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div class="space-y-3">
                <div *ngFor="let method of paymentMethods" 
                     class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer"
                     (click)="selectPaymentMethod(method)"
                     [class.border-blue-500]="selectedPaymentMethod?.id === method.id"
                     [class.bg-blue-50]="selectedPaymentMethod?.id === method.id">
                  <input type="radio" [checked]="selectedPaymentMethod?.id === method.id" 
                         class="text-blue-600 focus:ring-blue-500">
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-gray-900">{{ method.name }}</h3>
                    <p class="text-sm text-gray-500">{{ method.provider }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <!-- Items -->
              <div class="space-y-3 mb-4">
                <div *ngFor="let item of basketItems" class="flex items-center space-x-3">
                  <img [src]="item.product.media?.[0]?.file || '/assets/placeholder.png'" 
                       [alt]="item.product.title" 
                       class="w-12 h-12 object-cover rounded-lg">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ item.product.title }}</p>
                    <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                  </div>
                  <p class="text-sm font-medium text-gray-900">\${{ item.total_price.toFixed(2) }}</p>
                </div>
              </div>
              
              <hr class="my-4">
              
              <!-- Totals -->
              <div class="space-y-2 mb-6">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="text-gray-900">\${{ orderSummary.subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Shipping</span>
                  <span class="text-gray-900">\${{ orderSummary.shipping_cost.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Tax</span>
                  <span class="text-gray-900">\${{ orderSummary.tax_amount.toFixed(2) }}</span>
                </div>
                <hr class="my-2">
                <div class="flex justify-between text-lg font-semibold">
                  <span class="text-gray-900">Total</span>
                  <span class="text-gray-900">\${{ orderSummary.total.toFixed(2) }}</span>
                </div>
              </div>
              
              <!-- Place Order Button -->
              <button (click)="placeOrder()" 
                      [disabled]="!canPlaceOrder() || isProcessing"
                      class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                {{ isProcessing ? 'Processing...' : 'Place Order' }}
              </button>
              
              <p class="text-xs text-gray-500 text-center mt-3">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  shippingForm: FormGroup;
  basketItems: any[] = [];
  shippingMethods: ShippingMethod[] = [];
  paymentMethods: PaymentMethod[] = [];
  availableTimeSlots: any[] = [];
  
  selectedShippingMethod: ShippingMethod | null = null;
  selectedPaymentMethod: PaymentMethod | null = null;
  selectedDeliveryDate: string = '';
  selectedTimeSlot: string = '';
  
  orderSummary = {
    subtotal: 0,
    shipping_cost: 0,
    tax_amount: 0,
    total: 0
  };
  
  isProcessing = false;
  minDeliveryDate = '';

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private basketService: BasketService,
    private router: Router
  ) {
    this.shippingForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      address_line_1: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postal_code: ['', Validators.required],
      country: ['US']
    });
    
    // Set minimum delivery date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDeliveryDate = tomorrow.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadBasketItems();
    this.loadPaymentMethods();
    this.calculateOrderSummary();
  }

  loadBasketItems(): void {
    this.basketService.basketItems$.subscribe(items => {
      this.basketItems = items;
      this.calculateOrderSummary();
      if (this.shippingForm.valid) {
        this.loadShippingMethods();
      }
    });
  }

  loadShippingMethods(): void {
    if (this.shippingForm.valid) {
      const address = this.shippingForm.value as Address;
      this.checkoutService.getShippingMethods(address).subscribe({
        next: (methods) => {
          this.shippingMethods = methods;
        },
        error: (error) => console.error('Error loading shipping methods:', error)
      });
    }
  }

  loadPaymentMethods(): void {
    this.checkoutService.getPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
      },
      error: (error) => console.error('Error loading payment methods:', error)
    });
  }

  selectShippingMethod(method: ShippingMethod): void {
    this.selectedShippingMethod = method;
    this.calculateOrderSummary();
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod = method;
  }

  onDeliveryDateChange(): void {
    if (this.selectedDeliveryDate && this.selectedShippingMethod && this.shippingForm.valid) {
      const address = this.shippingForm.value as Address;
      this.checkoutService.getTimeSlots(
        this.selectedDeliveryDate, 
        this.selectedShippingMethod.id, 
        address
      ).subscribe({
        next: (slots) => {
          this.availableTimeSlots = slots;
        },
        error: (error) => console.error('Error loading time slots:', error)
      });
    }
  }

  calculateOrderSummary(): void {
    this.orderSummary.subtotal = this.basketItems.reduce((total, item) => total + item.total_price, 0);
    this.orderSummary.shipping_cost = this.selectedShippingMethod?.price || 0;
    this.orderSummary.tax_amount = this.orderSummary.subtotal * 0.08; // 8% tax
    this.orderSummary.total = this.orderSummary.subtotal + this.orderSummary.shipping_cost + this.orderSummary.tax_amount;
  }

  canPlaceOrder(): boolean {
    return this.shippingForm.valid && 
           this.selectedShippingMethod !== null && 
           this.selectedPaymentMethod !== null && 
           this.basketItems.length > 0;
  }

  placeOrder(): void {
    if (!this.canPlaceOrder()) return;
    
    this.isProcessing = true;
    
    const checkoutData = {
      items: this.basketItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      })),
      shipping_address: this.shippingForm.value as Address,
      billing_address: this.shippingForm.value as Address,
      shipping_method_id: this.selectedShippingMethod!.id,
      payment_method_id: this.selectedPaymentMethod!.id,
      delivery_date: this.selectedDeliveryDate,
      delivery_time_slot: this.selectedTimeSlot
    };
    
    this.checkoutService.createOrder(checkoutData).subscribe({
      next: (order) => {
        this.router.navigate(['/order-confirmation', order.id]);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.isProcessing = false;
      }
    });
  }
}
