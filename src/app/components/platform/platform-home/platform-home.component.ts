  // Chat Methods
  sendChatMessage(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const message = input.value.trim();
    
    if (message) {
      // Here you would normally send the message to your chat service
      console.log('پیام ارسال شد:', message);
      
      // Clear input
      input.value = '';
      
      // You can add logic here to:
      // - Send message to backend
      // - Add message to chat history
      // - Get response from support team
      
      // For demo purposes, show an alert
      setTimeout(() => {
        alert(`پیام شما "${message}" دریافت شد!\n\nتیم پشتیبانی ما به زودی پاسخ خواهند داد.`);
      }, 500);
    }
  }

  // Navigation Methods
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Modal Methods
  startFreeTrial() {
    // Navigate to registration page
    this.router.navigate(['/register'], { 
      queryParams: { trial: 'free', duration: '14days' }
    });
  }

  closeSignupModal() {
    this.showSignupModal = false;
    document.body.style.overflow = 'auto';
  }

  // Live Chat Methods
  openLiveChat() {
    this.showLiveChat = true;
  }

  closeLiveChat() {
    this.showLiveChat = false;
  }

  // Form Submission
  submitSignupForm() {
    if (!this.signupData.name || !this.signupData.phone || !this.signupData.email) {
      alert('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    this.isSubmitting = true;

    // Simulate form submission
    setTimeout(() => {
      alert(`${this.signupData.name} عزیز!\n\nثبت‌نام شما با موفقیت انجام شد.\n\nطی 24 ساعت آینده با شما تماس خواهیم گرفت.\n\nشماره تماس: ${this.signupData.phone}\nایمیل: ${this.signupData.email}\nنوع کسب‌وکار: ${this.signupData.business}`);
      
      this.closeSignupModal();
      this.isSubmitting = false;
      this.resetSignupForm();
    }, 2000);
  }

  resetSignupForm() {
    this.signupData = {
      name: '',
      phone: '',
      email: '',
      business: ''
    };
  }

  // Pricing Methods
  selectPlan(plan: PricingPlan) {
    this.router.navigate(['/register'], { 
      queryParams: { plan: plan.id } 
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fa-IR').format(price);
  }

  // Demo Methods
  playDemo() {
    alert('ویدیو نمایشی در حال بارگذاری...\n\nدر ویدیو خواهید دید:\n• نحوه ثبت‌نام و راه‌اندازی فروشگاه\n• اضافه کردن محصولات\n• تنظیمات طراحی\n• مدیریت سفارش‌ها\n• ادغام با شبکه‌های اجتماعی');
  }

  // Support Methods
  callSupport() {
    window.open('tel:+989123456789');
  }

  sendSMS() {
    window.open('sms:+989123456789');
  }

  sendEmail() {
    window.open('mailto:support@yourplatform.com');
  }
}