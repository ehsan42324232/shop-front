import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="min-h-screen bg-gray-50" dir="rtl">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-gray-900">پنل مدیریت</h1>
            </div>
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="relative">
                <button class="bg-blue-50 text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5v-12"></path>
                  </svg>
                </button>
              </div>
              <div class="relative">
                <button class="flex items-center space-x-2 space-x-reverse bg-gray-100 rounded-lg px-3 py-2 hover:bg-gray-200 transition-colors">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">ا</span>
                  </div>
                  <span class="text-gray-700 font-medium">احسان</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="flex">
        <!-- Sidebar -->
        <nav class="w-64 bg-white shadow-sm min-h-screen">
          <div class="p-4">
            <div class="space-y-2">
              <a href="#" class="flex items-center space-x-3 space-x-reverse text-gray-700 p-2 rounded-lg hover:bg-gray-100 bg-blue-50 text-blue-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7"></path>
                </svg>
                <span>داشبورد</span>
              </a>
              
              <a href="#" class="flex items-center space-x-3 space-x-reverse text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4"></path>
                </svg>
                <span>فروشگاه‌ها</span>
                <span class="mr-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">۳</span>
              </a>
              
              <a href="#" class="flex items-center space-x-3 space-x-reverse text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
                </svg>
                <span>محصولات</span>
              </a>
              
              <a href="#" class="flex items-center space-x-3 space-x-reverse text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <span>سفارش‌ها</span>
              </a>
              
              <a href="#" class="flex items-center space-x-3 space-x-reverse text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4m-6-6V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h6m-6 4h6m2-4h4m-4 4h4"></path>
                </svg>
                <span>دسته‌بندی‌ها</span>
              </a>
              
              <a href="#" class="flex items-center space-x-3 space-x-reverse text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span>آنالیتیک</span>
              </a>
              
              <a href="#" class="flex items-center space-x-3 space-x-reverse text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>تنظیمات</span>
              </a>
            </div>
          </div>
        </nav>

        <!-- Main Content -->
        <main class="flex-1 p-6">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div class="flex items-center">
                <div class="p-2 bg-blue-50 rounded-lg">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4"></path>
                  </svg>
                </div>
                <div class="mr-4">
                  <p class="text-sm font-medium text-gray-600">فروشگاه‌های فعال</p>
                  <p class="text-2xl font-bold text-gray-900">۳</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div class="flex items-center">
                <div class="p-2 bg-green-50 rounded-lg">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div class="mr-4">
                  <p class="text-sm font-medium text-gray-600">درآمد ماهانه</p>
                  <p class="text-2xl font-bold text-gray-900">۱۲.۸ میلیون</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div class="flex items-center">
                <div class="p-2 bg-purple-50 rounded-lg">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
                  </svg>
                </div>
                <div class="mr-4">
                  <p class="text-sm font-medium text-gray-600">کل محصولات</p>
                  <p class="text-2xl font-bold text-gray-900">۱,۲۰۵</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div class="flex items-center">
                <div class="p-2 bg-orange-50 rounded-lg">
                  <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div class="mr-4">
                  <p class="text-sm font-medium text-gray-600">سفارش‌های امروز</p>
                  <p class="text-2xl font-bold text-gray-900">۴۲</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts and Tables Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Sales Chart -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">نمودار فروش</h3>
              <div class="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <!-- Simulated Chart -->
                <div class="flex items-end space-x-2 space-x-reverse h-32">
                  <div class="w-8 bg-blue-500 rounded-t animate-pulse" style="height: 60%"></div>
                  <div class="w-8 bg-blue-400 rounded-t animate-pulse" style="height: 80%; animation-delay: 0.2s"></div>
                  <div class="w-8 bg-blue-600 rounded-t animate-pulse" style="height: 100%; animation-delay: 0.4s"></div>
                  <div class="w-8 bg-blue-400 rounded-t animate-pulse" style="height: 70%; animation-delay: 0.6s"></div>
                  <div class="w-8 bg-blue-500 rounded-t animate-pulse" style="height: 90%; animation-delay: 0.8s"></div>
                  <div class="w-8 bg-blue-300 rounded-t animate-pulse" style="height: 65%; animation-delay: 1s"></div>
                  <div class="w-8 bg-blue-600 rounded-t animate-pulse" style="height: 85%; animation-delay: 1.2s"></div>
                </div>
              </div>
            </div>

            <!-- Recent Orders -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900">سفارش‌های اخیر</h3>
                <a href="#" class="text-blue-600 text-sm hover:text-blue-700">مشاهده همه</a>
              </div>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span class="text-blue-600 font-medium text-sm">#۱۲۳۴</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">محمد احمدی</p>
                      <p class="text-xs text-gray-500">۲ دقیقه پیش</p>
                    </div>
                  </div>
                  <span class="text-green-600 font-medium">۸۹,۹۰۰ تومان</span>
                </div>

                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span class="text-purple-600 font-medium text-sm">#۱۲۳۵</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">فاطمه حسینی</p>
                      <p class="text-xs text-gray-500">۵ دقیقه پیش</p>
                    </div>
                  </div>
                  <span class="text-green-600 font-medium">۱۵۶,۵۰۰ تومان</span>
                </div>

                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span class="text-green-600 font-medium text-sm">#۱۲۳۶</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">علی رضایی</p>
                      <p class="text-xs text-gray-500">۱۰ دقیقه پیش</p>
                    </div>
                  </div>
                  <span class="text-green-600 font-medium">۲۰۳,۷۵۰ تومان</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Stores List -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="p-6 border-b border-gray-100">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-900">فروشگاه‌های من</h3>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  + فروشگاه جدید
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Store Card 1 -->
                <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold text-gray-900">فروشگاه پوشاک آریا</h4>
                    <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">فعال</span>
                  </div>
                  <p class="text-sm text-gray-600 mb-4">پوشاک زنانه و مردانه، کیف و کفش</p>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">محصولات:</span>
                      <span class="font-medium text-gray-900">۱۲۰</span>
                    </div>
                    <div>
                      <span class="text-gray-500">سفارش‌ها:</span>
                      <span class="font-medium text-gray-900">۴۸</span>
                    </div>
                  </div>
                  <div class="mt-4 flex space-x-2 space-x-reverse">
                    <button class="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded text-sm hover:bg-blue-100 transition-colors">
                      مدیریت
                    </button>
                    <button class="bg-gray-100 text-gray-600 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors">
                      مشاهده
                    </button>
                  </div>
                </div>

                <!-- Store Card 2 -->
                <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold text-gray-900">فروشگاه الکترونیک</h4>
                    <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">در حال ساخت</span>
                  </div>
                  <p class="text-sm text-gray-600 mb-4">موبایل، لپ‌تاپ و لوازم جانبی</p>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">محصولات:</span>
                      <span class="font-medium text-gray-900">۰</span>
                    </div>
                    <div>
                      <span class="text-gray-500">سفارش‌ها:</span>
                      <span class="font-medium text-gray-900">۰</span>
                    </div>
                  </div>
                  <div class="mt-4 flex space-x-2 space-x-reverse">
                    <button class="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded text-sm hover:bg-blue-100 transition-colors">
                      ادامه ساخت
                    </button>
                    <button class="bg-gray-100 text-gray-600 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors">
                      تنظیمات
                    </button>
                  </div>
                </div>

                <!-- Store Card 3 -->
                <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold text-gray-900">فروشگاه خانه و آشپزخانه</h4>
                    <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">فعال</span>
                  </div>
                  <p class="text-sm text-gray-600 mb-4">ظروف، لوازم خانگی و دکوراسیون</p>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">محصولات:</span>
                      <span class="font-medium text-gray-900">۸۵</span>
                    </div>
                    <div>
                      <span class="text-gray-500">سفارش‌ها:</span>
                      <span class="font-medium text-gray-900">۲۳</span>
                    </div>
                  </div>
                  <div class="mt-4 flex space-x-2 space-x-reverse">
                    <button class="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded text-sm hover:bg-blue-100 transition-colors">
                      مدیریت
                    </button>
                    <button class="bg-gray-100 text-gray-600 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors">
                      مشاهده
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}