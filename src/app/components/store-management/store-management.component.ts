import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-management',
  template: `
    <div class="min-h-screen bg-gray-50" dir="rtl">
      <!-- Header -->
      <div class="bg-white shadow">
        <div class="container mx-auto px-4 py-6">
          <h1 class="text-2xl font-bold text-gray-800">پنل مدیریت فروشگاه</h1>
        </div>
      </div>

      <!-- Dashboard Grid -->
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Stats Cards -->
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <div class="mr-4">
                <p class="text-sm text-gray-600">محصولات</p>
                <p class="text-2xl font-bold">{{ stats.products }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div class="mr-4">
                <p class="text-sm text-gray-600">سفارشات</p>
                <p class="text-2xl font-bold">{{ stats.orders }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div class="mr-4">
                <p class="text-sm text-gray-600">فروش (تومان)</p>
                <p class="text-2xl font-bold">{{ formatNumber(stats.revenue) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="mr-4">
                <p class="text-sm text-gray-600">مشتریان</p>
                <p class="text-2xl font-bold">{{ stats.customers }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-bold mb-4">مدیریت محصولات</h3>
            <p class="text-gray-600 mb-4">محصولات جدید اضافه کنید یا موجودی‌ها را ویرایش کنید</p>
            <div class="space-y-2">
              <button 
                (click)="goToProducts()"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                مشاهده محصولات
              </button>
              <button 
                (click)="addProduct()"
                class="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded hover:bg-blue-50 transition-colors">
                افزودن محصول جدید
              </button>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-bold mb-4">مدیریت سفارشات</h3>
            <p class="text-gray-600 mb-4">سفارشات جدید و در حال پردازش را بررسی کنید</p>
            <div class="space-y-2">
              <button 
                (click)="goToOrders()"
                class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
                مشاهده سفارشات
              </button>
              <div class="text-sm text-gray-500">
                {{ stats.pendingOrders }} سفارش در انتظار بررسی
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-bold mb-4">تنظیمات فروشگاه</h3>
            <p class="text-gray-600 mb-4">اطلاعات فروشگاه و تنظیمات را ویرایش کنید</p>
            <div class="space-y-2">
              <button 
                (click)="goToSettings()"
                class="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
                تنظیمات فروشگاه
              </button>
              <button 
                (click)="viewAnalytics()"
                class="w-full border border-purple-600 text-purple-600 py-2 px-4 rounded hover:bg-purple-50 transition-colors">
                آمار و گزارش‌ها
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      direction: rtl;
    }
  `]
})
export class StoreManagementComponent implements OnInit {
  stats = {
    products: 24,
    orders: 156,
    revenue: 12500000,
    customers: 89,
    pendingOrders: 5
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Load actual stats from API
    this.loadStats();
  }

  loadStats(): void {
    // TODO: Implement API call to get real stats
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fa-IR').format(num);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  addProduct(): void {
    this.router.navigate(['/products/new']);
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }

  goToSettings(): void {
    this.router.navigate(['/my-store/settings']);
  }

  viewAnalytics(): void {
    this.router.navigate(['/analytics']);
  }
}
