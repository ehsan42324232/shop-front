import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription, forkJoin } from 'rxjs';

interface DashboardStats {
  store: {
    name: string;
    domain: string;
    status: 'active' | 'inactive' | 'pending';
    total_views: number;
    monthly_views: number;
  };
  products: {
    total: number;
    active: number;
    inactive: number;
    out_of_stock: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    monthly_revenue: number;
  };
  customers: {
    total: number;
    new_this_month: number;
    active: number;
  };
}

interface RecentActivity {
  id: number;
  type: 'order' | 'customer' | 'product' | 'view';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  permission?: string;
}

interface Tip {
  id: number;
  title: string;
  description: string;
  icon: string;
  action?: () => void;
  actionLabel?: string;
  priority: number;
}

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  
  // Component state
  isLoadingStats = false;
  isLoadingActivity = false;
  isLoadingChart = false;
  
  // Data
  dashboardStats: DashboardStats | null = null;
  recentActivity: RecentActivity[] = [];
  currentUser: any = null;
  
  // Chart
  chartPeriod = '30';
  performanceChart: any;
  
  // Quick Actions
  quickActions: QuickAction[] = [
    {
      title: 'محصول جدید',
      description: 'افزودن محصول به فروشگاه',
      icon: 'fa-plus-circle',
      color: '#10b981',
      route: '/products/create'
    },
    {
      title: 'مدیریت سفارشات',
      description: 'بررسی و پیگیری سفارشات',
      icon: 'fa-shopping-cart',
      color: '#3b82f6',
      route: '/orders'
    },
    {
      title: 'پیام‌های مشتریان',
      description: 'پاسخ به سوالات مشتریان',
      icon: 'fa-comments',
      color: '#8b5cf6',
      route: '/messages'
    },
    {
      title: 'تنظیمات فروشگاه',
      description: 'شخصی‌سازی و تنظیمات',
      icon: 'fa-cog',
      color: '#6b7280',
      route: '/settings'
    },
    {
      title: 'گزارش‌ها',
      description: 'آمار و گزارش‌های فروش',
      icon: 'fa-chart-bar',
      color: '#f59e0b',
      route: '/analytics'
    },
    {
      title: 'کمپین پیامکی',
      description: 'ارسال پیامک تبلیغاتی',
      icon: 'fa-mobile-alt',
      color: '#ef4444',
      route: '/sms-campaigns'
    }
  ];
  
  // Tips and recommendations
  currentTips: Tip[] = [];
  
  // Subscriptions
  private subscriptions: Subscription[] = [];
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private storeService: StoreService,
    private productService: ProductService,
    private customerService: CustomerService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
    this.generateTips();
    
    // Show welcome message for new users
    if (this.currentUser && !localStorage.getItem('welcomed_' + this.currentUser.id)) {
      setTimeout(() => {
        this.notificationService.showWelcome(this.currentUser.name);
        localStorage.setItem('welcomed_' + this.currentUser.id, 'true');
      }, 1000);
    }
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.performanceChart) {
      this.performanceChart.destroy();
    }
  }
  
  // Data Loading Methods
  loadDashboardData(): void {
    this.isLoadingStats = true;
    
    const dashboardSub = forkJoin({
      store: this.storeService.getCurrentStore(),
      products: this.productService.getProductStats(),
      orders: this.storeService.getOrderStats(),
      customers: this.customerService.getCustomerStats()
    }).subscribe({
      next: (results) => {
        this.dashboardStats = {
          store: results.store.data || {},
          products: results.products.data || {},
          orders: results.orders.data || {},
          customers: results.customers.data || {}
        };
        this.isLoadingStats = false;
        this.loadRecentActivity();
        this.loadPerformanceChart();
      },
      error: (error) => {
        this.notificationService.showApiError(error);
        this.isLoadingStats = false;
      }
    });
    
    this.subscriptions.push(dashboardSub);
  }
  
  loadRecentActivity(): void {
    this.isLoadingActivity = true;
    
    const activitySub = this.storeService.getRecentActivity(10).subscribe({
      next: (response) => {
        if (response.success) {
          this.recentActivity = response.data || [];
        }
        this.isLoadingActivity = false;
      },
      error: (error) => {
        console.error('Error loading activity:', error);
        this.isLoadingActivity = false;
      }
    });
    
    this.subscriptions.push(activitySub);
  }
  
  loadPerformanceChart(): void {
    this.isLoadingChart = true;
    
    const chartSub = this.storeService.getPerformanceData(parseInt(this.chartPeriod)).subscribe({
      next: (response) => {
        if (response.success) {
          this.renderChart(response.data);
        }
        this.isLoadingChart = false;
      },
      error: (error) => {
        console.error('Error loading chart data:', error);
        this.isLoadingChart = false;
      }
    });
    
    this.subscriptions.push(chartSub);
  }
  
  // Chart Methods
  renderChart(data: any): void {
    // Implementation would use Chart.js or similar
    // For now, just log the data
    console.log('Chart data:', data);
  }
  
  updateChart(): void {
    this.loadPerformanceChart();
  }
  
  // Navigation Methods
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  
  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
  
  viewStore(): void {
    if (this.dashboardStats?.store?.domain) {
      const storeUrl = `${window.location.origin}/store/${this.dashboardStats.store.domain}`;
      window.open(storeUrl, '_blank');
    }
  }
  
  // Action Methods
  refreshActivity(): void {
    this.loadRecentActivity();
  }
  
  // Tips Generation
  generateTips(): void {
    this.currentTips = [];
    
    // Check if store needs setup
    if (this.dashboardStats?.store?.status === 'pending') {
      this.currentTips.push({
        id: 1,
        title: 'تکمیل راه‌اندازی فروشگاه',
        description: 'فروشگاه شما هنوز کامل راه‌اندازی نشده است. برای شروع فروش، تنظیمات را تکمیل کنید.',
        icon: 'fa-exclamation-triangle',
        action: () => this.router.navigate(['/settings/store']),
        actionLabel: 'تکمیل تنظیمات',
        priority: 1
      });
    }
    
    // Check if no products
    if (this.dashboardStats?.products?.total === 0) {
      this.currentTips.push({
        id: 2,
        title: 'افزودن اولین محصول',
        description: 'فروشگاه شما هنوز محصولی ندارد. برای شروع فروش، اولین محصول خود را اضافه کنید.',
        icon: 'fa-plus-circle',
        action: () => this.router.navigate(['/products/create']),
        actionLabel: 'افزودن محصول',
        priority: 2
      });
    }
    
    // Check out of stock products
    if (this.dashboardStats?.products?.out_of_stock > 0) {
      this.currentTips.push({
        id: 3,
        title: 'بروزرسانی موجودی',
        description: `${this.dashboardStats.products.out_of_stock} محصول ناموجود دارید. موجودی آنها را بروزرسانی کنید.`,
        icon: 'fa-exclamation-triangle',
        action: () => this.router.navigate(['/products'], { queryParams: { filter: 'out_of_stock' } }),
        actionLabel: 'مشاهده محصولات',
        priority: 3
      });
    }
    
    // Check pending orders
    if (this.dashboardStats?.orders?.pending > 0) {
      this.currentTips.push({
        id: 4,
        title: 'سفارشات در انتظار',
        description: `${this.dashboardStats.orders.pending} سفارش در انتظار بررسی شما است.`,
        icon: 'fa-clock',
        action: () => this.router.navigate(['/orders'], { queryParams: { status: 'pending' } }),
        actionLabel: 'بررسی سفارشات',
        priority: 4
      });
    }
    
    // General tips
    this.currentTips.push({
      id: 5,
      title: 'اتصال شبکه‌های اجتماعی',
      description: 'با اتصال اکانت‌های اینستاگرام و تلگرام، محتوا را به سادگی وارد کنید.',
      icon: 'fa-share-alt',
      action: () => this.router.navigate(['/social-media']),
      actionLabel: 'اتصال اکانت‌ها',
      priority: 5
    });
    
    this.currentTips.push({
      id: 6,
      title: 'راه‌اندازی کمپین پیامکی',
      description: 'با ارسال پیامک‌های تبلیغاتی، مشتریان خود را از تخفیف‌ها با خبر کنید.',
      icon: 'fa-mobile-alt',
      action: () => this.router.navigate(['/sms-campaigns']),
      actionLabel: 'ایجاد کمپین',
      priority: 6
    });
    
    // Sort tips by priority and show top 3
    this.currentTips = this.currentTips
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 3);
  }
  
  executeTipAction(tip: Tip): void {
    if (tip.action) {
      tip.action();
    }
  }
  
  // Utility Methods
  formatNumber(num: number): string {
    if (!num) return '۰';
    return num.toLocaleString('fa-IR');
  }
  
  formatPrice(price: number): string {
    if (!price) return '۰ تومان';
    return `${price.toLocaleString('fa-IR')} تومان`;
  }
  
  formatTime(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
      return `${minutes} دقیقه پیش`;
    } else if (hours < 24) {
      return `${hours} ساعت پیش`;
    } else if (days < 7) {
      return `${days} روز پیش`;
    } else {
      return time.toLocaleDateString('fa-IR');
    }
  }
  
  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'فعال',
      'inactive': 'غیرفعال',
      'pending': 'در انتظار تکمیل'
    };
    return statusMap[status] || status;
  }
  
  // Event Handlers
  onQuickActionClick(action: QuickAction): void {
    this.navigateTo(action.route);
  }
  
  onActivityItemClick(activity: RecentActivity): void {
    // Navigate to relevant section based on activity type
    switch (activity.type) {
      case 'order':
        this.router.navigate(['/orders', activity.id]);
        break;
      case 'customer':
        this.router.navigate(['/customers', activity.id]);
        break;
      case 'product':
        this.router.navigate(['/products', activity.id]);
        break;
      default:
        // Handle other types or do nothing
        break;
    }
  }
  
  // Refresh Methods
  refreshDashboard(): void {
    this.loadDashboardData();
  }
  
  refreshStats(): void {
    this.isLoadingStats = true;
    this.loadDashboardData();
  }
}
