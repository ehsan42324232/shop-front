import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

interface OrderItem {
  id: number;
  product_title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_attributes: any;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

@Component({
  selector: 'app-order-management',
  template: `
    <div class="min-h-screen bg-gray-50" dir="rtl">
      
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-gray-900">مدیریت سفارشات</h1>
              <span class="mr-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {{totalOrders}} سفارش
              </span>
            </div>
            <div class="flex items-center space-x-3 space-x-reverse">
              <select
                [(ngModel)]="statusFilter"
                (ngModelChange)="loadOrders()"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">همه سفارشات</option>
                <option value="pending">در انتظار تایید</option>
                <option value="confirmed">تایید شده</option>
                <option value="processing">در حال آماده‌سازی</option>
                <option value="shipped">ارسال شده</option>
                <option value="delivered">تحویل داده شده</option>
                <option value="cancelled">لغو شده</option>
              </select>
              <button
                (click)="exportOrders()"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                📊 خروجی Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg p-6 border border-gray-200">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center ml-3">
                <span class="text-orange-600 text-xl">⏳</span>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-800">{{pendingOrders}}</div>
                <div class="text-sm text-gray-600">در انتظار تایید</div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-6 border border-gray-200">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ml-3">
                <span class="text-blue-600 text-xl">📦</span>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-800">{{processingOrders}}</div>
                <div class="text-sm text-gray-600">در حال پردازش</div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-6 border border-gray-200">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center ml-3">
                <span class="text-green-600 text-xl">✅</span>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-800">{{completedOrders}}</div>
                <div class="text-sm text-gray-600">تکمیل شده</div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-6 border border-gray-200">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center ml-3">
                <span class="text-purple-600 text-xl">💰</span>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-800">{{formatPrice(totalRevenue)}}</div>
                <div class="text-sm text-gray-600">درآمد کل</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders List -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-800">لیست سفارشات</h2>
              <div class="flex items-center space-x-3 space-x-reverse">
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="loadOrders()"
                  placeholder="جستجو در سفارشات..."
                  class="px-3 py-2 border border-gray-300 rounded-lg text-sm w-64">
                <select
                  [(ngModel)]="sortBy"
                  (ngModelChange)="loadOrders()"
                  class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="created_at">جدیدترین</option>
                  <option value="total_amount">مبلغ</option>
                  <option value="customer_name">نام مشتری</option>
                </select>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    شماره سفارش
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    مشتری
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاریخ
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    مبلغ
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    پرداخت
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let order of orders" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{order.order_number}}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{order.customer_name}}</div>
                      <div class="text-sm text-gray-500">{{order.customer_phone}}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{formatDate(order.created_at)}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{formatPrice(order.total_amount)}} تومان</div>
                    <div class="text-sm text-gray-500">{{order.items.length}} محصول</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getOrderStatusClass(order.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{getOrderStatusLabel(order.status)}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getPaymentStatusClass(order.payment_status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{getPaymentStatusLabel(order.payment_status)}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2 space-x-reverse">
                      <button
                        (click)="viewOrder(order)"
                        class="text-blue-600 hover:text-blue-900">
                        مشاهده
                      </button>
                      <button
                        (click)="updateOrderStatus(order)"
                        class="text-green-600 hover:text-green-900">
                        به‌روزرسانی
                      </button>
                      <button
                        (click)="printOrder(order)"
                        class="text-purple-600 hover:text-purple-900">
                        چاپ
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div *ngIf="orders.length === 0" class="text-center py-12">
            <div class="text-gray-400 text-6xl mb-4">📋</div>
            <h3 class="text-lg font-medium text-gray-800 mb-2">هنوز سفارشی ندارید</h3>
            <p class="text-gray-600">وقتی مشتریان سفارش دهند، اینجا نمایش داده می‌شود</p>
          </div>
        </div>

        <!-- Order Detail Modal -->
        <div *ngIf="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-4xl w-full max-h-90vh overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-semibold text-gray-800">جزئیات سفارش {{selectedOrder.order_number}}</h2>
                <button
                  (click)="selectedOrder = null"
                  class="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <!-- Customer Information -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">اطلاعات مشتری</h3>
                  <div class="space-y-3">
                    <div>
                      <span class="text-sm font-medium text-gray-600">نام:</span>
                      <span class="mr-2">{{selectedOrder.customer_name}}</span>
                    </div>
                    <div>
                      <span class="text-sm font-medium text-gray-600">تلفن:</span>
                      <span class="mr-2">{{selectedOrder.customer_phone}}</span>
                    </div>
                    <div>
                      <span class="text-sm font-medium text-gray-600">آدرس:</span>
                      <span class="mr-2">{{selectedOrder.customer_address}}</span>
                    </div>
                  </div>
                </div>

                <!-- Order Information -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">اطلاعات سفارش</h3>
                  <div class="space-y-3">
                    <div>
                      <span class="text-sm font-medium text-gray-600">تاریخ:</span>
                      <span class="mr-2">{{formatDate(selectedOrder.created_at)}}</span>
                    </div>
                    <div>
                      <span class="text-sm font-medium text-gray-600">وضعیت:</span>
                      <span [class]="'mr-2 px-2 py-1 text-xs rounded-full ' + getOrderStatusClass(selectedOrder.status)">
                        {{getOrderStatusLabel(selectedOrder.status)}}
                      </span>
                    </div>
                    <div>
                      <span class="text-sm font-medium text-gray-600">پرداخت:</span>
                      <span [class]="'mr-2 px-2 py-1 text-xs rounded-full ' + getPaymentStatusClass(selectedOrder.payment_status)">
                        {{getPaymentStatusLabel(selectedOrder.payment_status)}}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <div class="mt-8">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">محصولات سفارش</h3>
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                  <table class="w-full">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-4 py-3 text-right text-sm font-medium text-gray-600">محصول</th>
                        <th class="px-4 py-3 text-right text-sm font-medium text-gray-600">تعداد</th>
                        <th class="px-4 py-3 text-right text-sm font-medium text-gray-600">قیمت واحد</th>
                        <th class="px-4 py-3 text-right text-sm font-medium text-gray-600">مجموع</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr *ngFor="let item of selectedOrder.items">
                        <td class="px-4 py-3">
                          <div class="text-sm font-medium text-gray-900">{{item.product_title}}</div>
                          <div *ngIf="item.product_attributes" class="text-xs text-gray-500 mt-1">
                            <span *ngFor="let attr of getAttributesDisplay(item.product_attributes)" class="mr-2">
                              {{attr}}
                            </span>
                          </div>
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-900">{{item.quantity}}</td>
                        <td class="px-4 py-3 text-sm text-gray-900">{{formatPrice(item.unit_price)}} تومان</td>
                        <td class="px-4 py-3 text-sm font-medium text-gray-900">{{formatPrice(item.total_price)}} تومان</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Order Total -->
                <div class="mt-4 flex justify-end">
                  <div class="w-64">
                    <div class="flex justify-between py-2">
                      <span class="text-sm text-gray-600">جمع کل:</span>
                      <span class="text-lg font-bold text-gray-900">{{formatPrice(selectedOrder.total_amount)}} تومان</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-6 flex justify-end space-x-3 space-x-reverse">
                <button
                  (click)="selectedOrder = null"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  بستن
                </button>
                <button
                  (click)="updateOrderStatus(selectedOrder)"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  به‌روزرسانی وضعیت
                </button>
                <button
                  (click)="printOrder(selectedOrder)"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  چاپ سفارش
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrderManagementComponent implements OnInit {
  private destroy$ = new Subject<void>();

  orders: Order[] = [];
  selectedOrder: Order | null = null;
  
  // Filters and sorting
  statusFilter = '';
  searchQuery = '';
  sortBy = 'created_at';
  
  // Statistics
  totalOrders = 0;
  pendingOrders = 0;
  processingOrders = 0;
  completedOrders = 0;
  totalRevenue = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadOrders(): Promise<void> {
    // TODO: Implement API call
    console.log('Loading orders with filters:', {
      status: this.statusFilter,
      search: this.searchQuery,
      sortBy: this.sortBy
    });
  }

  async loadStats(): Promise<void> {
    // TODO: Implement API call
    console.log('Loading order statistics');
  }

  viewOrder(order: Order): void {
    this.selectedOrder = order;
  }

  updateOrderStatus(order: Order): void {
    // TODO: Implement status update modal
    console.log('Updating order status for:', order.order_number);
  }

  printOrder(order: Order): void {
    // TODO: Implement print functionality
    console.log('Printing order:', order.order_number);
  }

  exportOrders(): void {
    // TODO: Implement Excel export
    console.log('Exporting orders to Excel');
  }

  formatPrice(amount: number): string {
    return new Intl.NumberFormat('fa-IR').format(amount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getOrderStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'در انتظار تایید',
      'confirmed': 'تایید شده',
      'processing': 'در حال آماده‌سازی',
      'shipped': 'ارسال شده',
      'delivered': 'تحویل داده شده',
      'cancelled': 'لغو شده'
    };
    return labels[status] || status;
  }

  getOrderStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'bg-orange-100 text-orange-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getPaymentStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'در انتظار پرداخت',
      'paid': 'پرداخت شده',
      'failed': 'پرداخت ناموفق',
      'refunded': 'بازگشت داده شده'
    };
    return labels[status] || status;
  }

  getPaymentStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'paid': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getAttributesDisplay(attributes: any): string[] {
    return Object.entries(attributes).map(([key, value]) => `${key}: ${value}`);
  }
}
