import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  customerData = {
    name: '',
    phone: '',
    email: '',
    orders: [],
    wallet: 0,
    points: 0
  };

  recentOrders: any[] = [];
  notifications: any[] = [];
  favoriteProducts: any[] = [];
  
  loading = false;
  activeTab = 'overview';

  constructor() {}

  ngOnInit(): void {
    this.loadCustomerData();
    this.loadRecentOrders();
    this.loadNotifications();
    this.loadFavoriteProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCustomerData(): void {
    this.loading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.customerData = {
        name: 'علی احمدی',
        phone: '09123456789',
        email: 'ali@example.com',
        orders: [],
        wallet: 125000,
        points: 850
      };
      this.loading = false;
    }, 1000);
  }

  loadRecentOrders(): void {
    // Simulate recent orders
    this.recentOrders = [
      {
        id: 'ORD-001',
        date: '1403/01/15',
        status: 'delivered',
        statusText: 'تحویل داده شده',
        total: 245000,
        items: 3
      },
      {
        id: 'ORD-002', 
        date: '1403/01/10',
        status: 'processing',
        statusText: 'در حال پردازش',
        total: 180000,
        items: 2
      },
      {
        id: 'ORD-003',
        date: '1403/01/05',
        status: 'shipped',
        statusText: 'ارسال شده',
        total: 320000,
        items: 5
      }
    ];
  }

  loadNotifications(): void {
    this.notifications = [
      {
        id: 1,
        title: 'سفارش شما ارسال شد',
        message: 'سفارش ORD-002 با موفقیت ارسال شد و تا 2 روز آینده به دست شما خواهد رسید.',
        date: '1403/01/16',
        read: false,
        type: 'order'
      },
      {
        id: 2,
        title: 'تخفیف ویژه برای شما',
        message: '20% تخفیف روی تمام محصولات دسته لباس فقط تا پایان هفته',
        date: '1403/01/14',
        read: false,
        type: 'promotion'
      },
      {
        id: 3,
        title: 'کیف پول شما شارژ شد',
        message: 'مبلغ 100,000 تومان به کیف پول شما اضافه شد',
        date: '1403/01/12',
        read: true,
        type: 'wallet'
      }
    ];
  }

  loadFavoriteProducts(): void {
    this.favoriteProducts = [
      {
        id: 1,
        name: 'تیشرت یقه گرد نخی',
        price: 85000,
        discountPrice: 68000,
        image: '/assets/images/tshirt.jpg',
        inStock: true
      },
      {
        id: 2,
        name: 'شلوار جین مردانه',
        price: 195000,
        discountPrice: null,
        image: '/assets/images/jeans.jpg',
        inStock: true
      },
      {
        id: 3,
        name: 'کفش ورزشی',
        price: 280000,
        discountPrice: 250000,
        image: '/assets/images/shoes.jpg',
        inStock: false
      }
    ];
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  }

  getOrderStatusClass(status: string): string {
    const statusClasses = {
      'pending': 'status-pending',
      'processing': 'status-processing', 
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return statusClasses[status] || 'status-pending';
  }

  getNotificationIcon(type: string): string {
    const icons = {
      'order': 'shopping-bag',
      'promotion': 'gift',
      'wallet': 'credit-card',
      'general': 'bell'
    };
    return icons[type] || 'bell';
  }

  markNotificationAsRead(notification: any): void {
    notification.read = true;
  }

  removeFromFavorites(productId: number): void {
    this.favoriteProducts = this.favoriteProducts.filter(p => p.id !== productId);
  }

  viewOrderDetails(orderId: string): void {
    // Navigate to order details
    console.log('Viewing order:', orderId);
  }

  addToCart(product: any): void {
    // Add product to cart
    console.log('Adding to cart:', product);
  }
}
