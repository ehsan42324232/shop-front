import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface OrderItem {
  id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  items: OrderItem[];
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  tracking_code?: string;
}

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {
  // State
  loading = false;
  error: string | null = null;
  
  // Orders
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  
  // Filters
  statusFilter = 'all';
  dateRange = '30';
  searchTerm = '';
  
  // Pagination
  currentPage = 1;
  totalOrders = 0;
  ordersPerPage = 20;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    
    const params = {
      page: this.currentPage.toString(),
      per_page: this.ordersPerPage.toString(),
      status: this.statusFilter,
      days: this.dateRange,
      search: this.searchTerm
    };

    this.http.get<{orders: Order[], total: number}>(`${environment.apiUrl}/api/orders/`, { params })
      .subscribe({
        next: (response) => {
          this.orders = response.orders;
          this.totalOrders = response.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در بارگذاری سفارشات:', error);
          this.error = 'خطا در بارگذاری فهرست سفارشات';
          this.loading = false;
        }
      });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  selectOrder(order: Order): void {
    this.selectedOrder = order;
  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    this.http.patch(`${environment.apiUrl}/api/orders/${orderId}/status/`, { status: newStatus })
      .subscribe({
        next: () => {
          const order = this.orders.find(o => o.id === orderId);
          if (order) {
            order.status = newStatus as any;
          }
          if (this.selectedOrder && this.selectedOrder.id === orderId) {
            this.selectedOrder.status = newStatus as any;
          }
          alert('وضعیت سفارش بروزرسانی شد');
        },
        error: (error) => {
          console.error('خطا در بروزرسانی وضعیت:', error);
          alert('خطا در بروزرسانی وضعیت سفارش');
        }
      });
  }

  addTrackingCode(orderId: number): void {
    const trackingCode = prompt('کد رهگیری را وارد کنید:');
    if (!trackingCode) return;

    this.http.patch(`${environment.apiUrl}/api/orders/${orderId}/tracking/`, { tracking_code: trackingCode })
      .subscribe({
        next: () => {
          const order = this.orders.find(o => o.id === orderId);
          if (order) {
            order.tracking_code = trackingCode;
          }
          if (this.selectedOrder && this.selectedOrder.id === orderId) {
            this.selectedOrder.tracking_code = trackingCode;
          }
          alert('کد رهگیری اضافه شد');
        },
        error: (error) => {
          console.error('خطا در افزودن کد رهگیری:', error);
          alert('خطا در افزودن کد رهگیری');
        }
      });
  }

  printOrder(order: Order): void {
    window.print();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fa-IR');
  }

  getStatusClass(status: string): string {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  }

  getStatusText(status: string): string {
    const statusTexts = {
      'pending': 'در انتظار',
      'processing': 'در حال پردازش',
      'shipped': 'ارسال شده',
      'delivered': 'تحویل داده شده',
      'cancelled': 'لغو شده'
    };
    return statusTexts[status as keyof typeof statusTexts] || 'نامشخص';
  }

  getTotalPages(): number {
    return Math.ceil(this.totalOrders / this.ordersPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }
}