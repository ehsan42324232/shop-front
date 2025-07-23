import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { ProductService } from '../../services/product.service';

interface StoreStats {
  total_products: number;
  active_products: number;
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  monthly_revenue: number;
  total_customers: number;
  active_customers: number;
  average_order_value: number;
  conversion_rate: number;
}

interface RecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  created_at: string;
  items_count: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  count?: number;
}

@Component({
  selector: 'app-store-management',
  template: `
    <div class="min-h-screen bg-gray-50" dir="rtl">
      
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-blue-500 rounded-xl flex items-center justify-center ml-3">
                <span class="text-white font-bold text-lg">🏪</span>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">پنل مدیریت فروشگاه</h1>
                <p class="text-sm text-gray-500">{{currentStore?.name || 'فروشگاه من'}}</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-3 space-x-reverse">
              <button
                (click)="viewStore()"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                👁️ مشاهده فروشگاه
              </button>
              <button
                (click)="editStore()"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                ⚙️ تنظیمات فروشگاه
              </button>
              <button
                (click)="logout()"
                class="px-4 py-2 text-red-600 hover:text-red-700 transition-colors">
                🚪 خروج
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Welcome Section -->
        <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 mb-8 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold mb-2">سلام {{currentUser?.name || 'کاربر گرامی'}}! 👋</h2>
              <p class="text-blue-100 mb-4">امروز روز خوبی برای فروش است. آمار فروشگاه شما:</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-white/20 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold">{{stats?.total_products || 0}}</div>
                  <div class="text-sm text-blue-100">محصولات</div>
                </div>
                <div class="bg-white/20 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold">{{stats?.total_orders || 0}}</div>
                  <div class="text-sm text-blue-100">سفارشات</div>
                </div>
                <div class="bg-white/20 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold">{{formatPrice(stats?.monthly_revenue || 0)}}</div>
                  <div class="text-sm text-blue-100">درآمد ماه</div>
                </div>
                <div class="bg-white/20 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold">{{stats?.total_customers || 0}}</div>
                  <div class="text-sm text-blue-100">مشتریان</div>
                </div>
              </div>
            </div>
            <div class="hidden lg:block">
              <div class="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center text-6xl">
                📊
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div
            *ngFor="let action of quickActions"
            (click)="navigateTo(action.route)"
            class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1">
            <div class="text-center">
              <div [class]="'w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ' + action.color">
                <span class="text-2xl">{{action.icon}}</span>
              </div>
              <h3 class="font-semibold text-gray-800 mb-1">{{action.title}}</h3>
              <p class="text-xs text-gray-600 mb-2">{{action.description}}</p>
              <div *ngIf="action.count !== undefined" class="text-lg font-bold text-blue-600">
                {{action.count}}
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Recent Orders -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-semibold text-gray-800">سفارشات اخیر</h3>
                  <button
                    (click)="navigateTo('/orders')"
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    مشاهده همه →
                  </button>
                </div>
              </div>
              
              <div class="divide-y divide-gray-200">
                <div *ngIf="recentOrders.length === 0" class="p-8 text-center">
                  <div class="text-gray-400 text-4xl mb-3">📋</div>
                  <h4 class="text-lg font-medium text-gray-600 mb-2">هنوز سفارشی ندارید</h4>
                  <p class="text-gray-500 text-sm">وقتی مشتریان سفارش دهند، اینجا نمایش داده می‌شود</p>
                </div>
                
                <div
                  *ngFor="let order of recentOrders"
                  class="p-4 hover:bg-gray-50 transition-colors">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 space-x-reverse mb-1">
                        <span class="font-medium text-gray-800">#{{order.order_number}}</span>
                        <span [class]="getOrderStatusClass(order.status)" class="px-2 py-1 rounded-full text-xs">
                          {{getOrderStatusLabel(order.status)}}
                        </span>
                      </div>
                      <div class="text-sm text-gray-600 mb-1">
                        {{order.customer_name}} • {{order.customer_phone}}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{order.items_count}} محصول • {{formatDate(order.created_at)}}
                      </div>
                    </div>
                    <div class="text-left">
                      <div class="font-bold text-gray-800">{{formatPrice(order.total_amount)}} تومان</div>
                      <button
                        (click)="viewOrder(order.id)"
                        class="text-blue-600 hover:text-blue-700 text-sm">
                        جزئیات
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats & Quick Info -->
          <div class="space-y-6">
            
            <!-- Revenue Chart Card -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">عملکرد فروش</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">درآمد امروز</span>
                  <span class="font-bold text-green-600">{{formatPrice(stats?.daily_revenue || 0)}} تومان</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">درآمد این ماه</span>
                  <span class="font-bold text-blue-600">{{formatPrice(stats?.monthly_revenue || 0)}} تومان</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">میانگین فروش</span>
                  <span class="font-medium text-gray-800">{{formatPrice(stats?.average_order_value || 0)}} تومان</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">نرخ تبدیل</span>
                  <span class="font-medium text-gray-800">{{(stats?.conversion_rate || 0).toFixed(1)}}%</span>
                </div>
              </div>
              
              <button
                (click)="navigateTo('/analytics')"
                class="w-full mt-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                📊 مشاهده گزارش کامل
              </button>
            </div>

            <!-- Alerts & Notifications -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">هشدارها</h3>
              <div class="space-y-3">
                
                <div *ngIf="stats?.pending_orders && stats.pending_orders > 0" 
                     class="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div class="flex items-center">
                    <span class="text-orange-500 ml-2">⚠️</span>
                    <div class="flex-1">
                      <div class="text-sm font-medium text-orange-800">سفارشات در انتظار</div>
                      <div class="text-xs text-orange-600">{{stats.pending_orders}} سفارش منتظر تایید</div>
                    </div>
                  </div>
                </div>

                <div *ngIf="lowStockCount > 0" 
                     class="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div class="flex items-center">
                    <span class="text-red-500 ml-2">📦</span>
                    <div class="flex-1">
                      <div class="text-sm font-medium text-red-800">موجودی کم</div>
                      <div class="text-xs text-red-600">{{lowStockCount}} محصول موجودی کم دارد</div>
                    </div>
                  </div>
                </div>

                <div *ngIf="!hasActiveProducts" 
                     class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex items-center">
                    <span class="text-blue-500 ml-2">💡</span>
                    <div class="flex-1">
                      <div class="text-sm font-medium text-blue-800">شروع کنید</div>
                      <div class="text-xs text-blue-600">اولین محصول خود را اضافه کنید</div>
                    </div>
                  </div>
                </div>

                <div *ngIf="!alerts || alerts.length === 0" class="text-center py-4">
                  <div class="text-gray-400 text-2xl mb-2">✅</div>
                  <div class="text-sm text-gray-500">همه چیز عالی است!</div>
                </div>
              </div>
            </div>

            <!-- Store Info -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">اطلاعات فروشگاه</h3>
              <div class="space-y-3">
                <div>
                  <div class="text-sm text-gray-600">نام فروشگاه</div>
                  <div class="font-medium">{{currentStore?.name || 'فروشگاه من'}}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600">دامنه</div>
                  <div class="font-medium text-blue-600">{{currentStore?.domain || 'نامشخص'}}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600">وضعیت</div>
                  <span [class]="currentStore?.is_active ? 'text-green-600' : 'text-red-600'" class="font-medium">
                    {{currentStore?.is_active ? '🟢 فعال' : '🔴 غیرفعال'}}
                  </span>
                </div>
                <div>
                  <div class="text-sm text-gray-600">تاریخ ایجاد</div>
                  <div class="font-medium">{{formatDate(currentStore?.created_at)}}</div>
                </div>
              </div>
              
              <button
                (click)="editStore()"
                class="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                ⚙️ ویرایش اطلاعات
              </button>
            </div>
          </div>
        </div>

        <!-- Help Section -->
        <div class="mt-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">🎯 نیاز به راهنمایی دارید؟</h2>
            <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
              تیم پشتیبانی مال آماده کمک به شما در راه‌اندازی و بهینه‌سازی فروشگاه آنلاین‌تان است
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button class="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                💬 چت با پشتیبانی
              </button>
              <button class="px-6 py-3 border border-purple-300 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors">
                📚 راهنمای کاربری
              </button>
              <button class="px-6 py-3 border border-purple-300 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors">
                🎥 ویدیوهای آموزشی
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StoreManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentUser: any = null;
  currentStore: any = null;
  stats: StoreStats | null = null;
  recentOrders: RecentOrder[] = [];
  alerts: any[] = [];
  lowStockCount = 0;
  hasActiveProducts = false;

  quickActions: QuickAction[] = [
    {
      title: 'محصولات',
      description: 'مدیریت محصولات',
      icon: '📦',
      route: '/products',
      color: 'bg-blue-100',
      count: 0
    },
    {
      title: 'سفارشات',
      description: 'مشاهده سفارشات',
      icon: '📋',
      route: '/orders',
      color: 'bg-green-100',
      count: 0
    },
    {
      title: 'مشتریان',
      description: 'لیست مشتریان',
      icon: '👥',
      route: '/customers',
      color: 'bg-purple-100',
      count: 0
    },
    {
      title: 'گزارشات',
      description: 'آمار و تحلیل',
      icon: '📊',
      route: '/analytics',
      color: 'bg-orange-100'
    },
    {
      title: 'تنظیمات',
      description: 'تنظیمات فروشگاه',
      icon: '⚙️',
      route: '/settings',
      color: 'bg-gray-100'
    },
    {
      title: 'پیام‌ها',
      description: 'پیام‌های مشتریان',
      icon: '💬',
      route: '/messages',
      color: 'bg-pink-100',
      count: 0
    }
  ];

  constructor(
    private authService: AuthService,
    private storeService: StoreService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadStoreData();
    this.loadStats();
    this.loadRecentOrders();
    this.checkAlerts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadUserData(): Promise<void> {
    try {
      this.currentUser = await this.authService.getCurrentUser();
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  private async loadStoreData(): Promise<void> {
    try {
      this.currentStore = await this.storeService.getCurrentStore();
    } catch (error) {
      console.error('Error loading store data:', error);
    }
  }

  private async loadStats(): Promise<void> {
    try {
      this.stats = await this.storeService.getStats();
      
      // Update quick actions with counts
      this.quickActions[0].count = this.stats.total_products;
      this.quickActions[1].count = this.stats.total_orders;
      this.quickActions[2].count = this.stats.total_customers;
      
      this.hasActiveProducts = (this.stats.active_products || 0) > 0;
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  private async loadRecentOrders(): Promise<void> {
    try {
      this.recentOrders = await this.storeService.getRecentOrders(10);
    } catch (error) {
      console.error('Error loading recent orders:', error);
    }
  }

  private async checkAlerts(): Promise<void> {
    try {
      // Check for low stock products
      const lowStockProducts = await this.productService.getLowStockProducts();
      this.lowStockCount = lowStockProducts.length;
      
      // Load other alerts
      this.alerts = await this.storeService.getAlerts();
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  viewStore(): void {
    if (this.currentStore?.domain) {
      window.open(`https://${this.currentStore.domain}`, '_blank');
    }
  }

  editStore(): void {
    this.router.navigate(['/store-settings']);
  }

  viewOrder(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  formatPrice(amount: number): string {
    return new Intl.NumberFormat('fa-IR').format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'نامشخص';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  getOrderStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'pending': 'در انتظار',
      'confirmed': 'تایید شده',
      'processing': 'در حال پردازش',
      'shipped': 'ارسال شده',
      'delivered': 'تحویل داده شده',
      'cancelled': 'لغو شده'
    };
    return statusLabels[status] || status;
  }

  getOrderStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'bg-orange-100 text-orange-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }
}
