کنیم!"></textarea>
              </div>
              
              <!-- Benefits reminder -->
              <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border-2 border-green-200">
                <div class="flex items-start space-x-4 space-x-reverse">
                  <div class="text-3xl">🎁</div>
                  <div>
                    <h4 class="text-xl font-bold text-gray-900 mb-2">هدیه ویژه برای شما:</h4>
                    <ul class="text-gray-700 space-y-1">
                      <li>✅ راه‌اندازی رایگان</li>
                      <li>✅ آموزش کامل</li>
                      <li>✅ پشتیبانی ۳۰ روزه</li>
                      <li>✅ طراحی اختصاصی</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="text-center">
                <button type="submit" class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-16 py-5 rounded-full text-xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl">
                  🚀 درخواست فروشگاه (رایگان)
                </button>
                <p class="text-gray-500 mt-4">⏰ پاسخ در کمتر از ۲۴ ساعت</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-gray-900" dir="rtl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h3 class="text-4xl font-bold text-white mb-4">اعداد و ارقام</h3>
          <p class="text-xl text-gray-400">آمارهای واقعی عملکرد ما</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="animate-fade-in-up">
            <div class="text-5xl md:text-6xl font-black text-white mb-2" #storesCount>0</div>
            <div class="text-gray-400 text-lg">فروشگاه فعال</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="text-5xl md:text-6xl font-black text-white mb-2" #revenueCount>0</div>
            <div class="text-gray-400 text-lg">میلیارد تومان فروش</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.4s">
            <div class="text-5xl md:text-6xl font-black text-white mb-2" #ordersCount>0</div>
            <div class="text-gray-400 text-lg">سفارش پردازش شده</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.6s">
            <div class="text-5xl md:text-6xl font-black text-white mb-2" #categoriesCount>0</div>
            <div class="text-gray-400 text-lg">دسته‌بندی متنوع</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .gradient-bg {
      background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
      background-size: 400% 400%;
      animation: gradient 15s ease infinite;
    }
    
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .glass-morphism {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.18);
    }
    
    .typing-text {
      border-right: 3px solid #3B82F6;
      white-space: nowrap;
      overflow: hidden;
      animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
    }
    
    @keyframes typing {
      from { width: 0 }
      to { width: 100% }
    }
    
    @keyframes blink-caret {
      from, to { border-color: transparent }
      50% { border-color: #3B82F6; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) }
      50% { transform: translateY(-20px) }
    }
    
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(30px) }
      100% { opacity: 1; transform: translateY(0) }
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out;
    }
    
    /* Persian font styles */
    * {
      font-family: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif !important;
    }
    
    @media (max-width: 768px) {
      .typing-text {
        animation: none;
        border-right: none;
        white-space: normal;
        overflow: visible;
      }
    }
  `]
})