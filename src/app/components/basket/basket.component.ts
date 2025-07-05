import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasketService } from '../../services/basket.service';
import { OrderService } from '../../services/order.service';
import { BasketItem } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-basket',
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div *ngIf="basketItems.length > 0; else emptyCart" class="space-y-4">
            <div *ngFor="let item of basketItems" 
                 class="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
              
              <!-- Product Image -->
              <div class="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img *ngIf="item.product.media && item.product.media.length > 0" 
                     [src]="item.product.media[0].file" 
                     [alt]="item.product.title"
                     class="w-full h-full object-cover">
                <div *ngIf="!item.product.media || item.product.media.length === 0" 
                     class="w-full h-full flex items-center justify-center text-gray-400">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Product Info -->
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600" 
                    (click)="router.navigate(['/products', item.product.id])">
                  {{ item.product.title }}
                </h3>
                <p class="text-gray-600 text-sm">{{ item.product.description | slice:0:100 }}...</p>
                <p class="text-blue-600 font-semibold mt-2">${{ item.product.price }}</p>
              </div>
              
              <!-- Quantity Controls -->
              <div class="flex items-center space-x-2">
                <button class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100" 
                        (click)="updateQuantity(item, item.quantity - 1)"
                        [disabled]="item.quantity <= 1">
                  -
                </button>
                <span class="w-12 text-center">{{ item.quantity }}</span>
                <button class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100" 
                        (click)="updateQuantity(item, item.quantity + 1)"
                        [disabled]="item.quantity >= item.product.stock">
                  +
                </button>
              </div>
              
              <!-- Item Total -->
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">${{ item.total_price.toFixed(2) }}</p>
                <button class="text-red-500 hover:text-red-700 text-sm mt-1" 
                        (click)="removeItem(item)">
                  Remove
                </button>
              </div>
            </div>
          </div>
          
          <!-- Empty Cart -->
          <ng-template #emptyCart>
            <div class="text-center py-12">
              <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 8.32a2 2 0 01-1.98 1.68H9m8 0a2 2 0 11-4 0m4 0a2 2 0 11-4 0"></path>
              </svg>
              <h3 class="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
              <p class="mt-1 text-gray-500">Start shopping to add items to your cart.</p>
              <button class="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700" 
                      (click)="router.navigate(['/'])">
                Continue Shopping
              </button>
            </div>
          </ng-template>
        </div>
        
        <!-- Order Summary -->
        <div *ngIf="basketItems.length > 0" class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div class="space-y-2 mb-4">
              <div class="flex justify-between">
                <span>Subtotal ({{ getTotalItems() }} items)</span>
                <span>${{ getSubtotal().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div class="flex justify-between">
                <span>Tax</span>
                <span>${{ getTax().toFixed(2) }}</span>
              </div>
              <hr class="my-2">
              <div class="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${{ getTotal().toFixed(2) }}</span>
              </div>
            </div>
            
            <button class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold mb-4"
                    (click)="proceedToCheckout()"
                    [disabled]="isProcessing">
              {{ isProcessing ? 'Processing...' : 'Proceed to Checkout' }}
            </button>
            
            <button class="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                    (click)="router.navigate(['/'])">
              Continue Shopping
            </button>
            
            <div class="mt-4 pt-4 border-t">
              <button class="text-red-500 hover:text-red-700 text-sm" 
                      (click)="clearCart()">
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BasketComponent implements OnInit {
  basketItems: BasketItem[] = [];
  isProcessing = false;

  constructor(
    private basketService: BasketService,
    private orderService: OrderService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.basketService.basketItems$.subscribe(items => {
      this.basketItems = items;
    });
  }

  updateQuantity(item: BasketItem, newQuantity: number): void {
    if (newQuantity > 0 && newQuantity <= item.product.stock) {
      this.basketService.updateBasketItem(item.id, newQuantity).subscribe({
        error: (error) => {
          console.error('Error updating quantity:', error);
        }
      });
    }
  }

  removeItem(item: BasketItem): void {
    this.basketService.removeFromBasket(item.id).subscribe({
      error: (error) => {
        console.error('Error removing item:', error);
      }
    });
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.basketService.clearBasket().subscribe({
        error: (error) => {
          console.error('Error clearing cart:', error);
        }
      });
    }
  }

  getTotalItems(): number {
    return this.basketItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.basketItems.reduce((total, item) => total + item.total_price, 0);
  }

  getTax(): number {
    return this.getSubtotal() * 0.08; // 8% tax
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  proceedToCheckout(): void {
    // Group items by store
    const storeGroups = this.basketItems.reduce((groups, item) => {
      const storeId = item.product.category?.store || 1; // Fallback to store 1
      if (!groups[storeId]) {
        groups[storeId] = [];
      }
      groups[storeId].push(item);
      return groups;
    }, {} as { [key: number]: BasketItem[] });

    // For now, create order for the first store
    const firstStoreId = Object.keys(storeGroups)[0];
    if (firstStoreId) {
      this.isProcessing = true;
      this.orderService.createOrder(parseInt(firstStoreId)).subscribe({
        next: (order) => {
          this.router.navigate(['/orders', order.id]);
        },
        error: (error) => {
          console.error('Error creating order:', error);
          this.isProcessing = false;
        }
      });
    }
  }
}
