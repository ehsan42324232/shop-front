import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface OtpResponse {
  success: boolean;
  message: string;
  request_id?: string;
  user?: any;
  token?: string;
}

@Component({
  selector: 'app-otp-authentication',
  templateUrl: './otp-authentication.component.html',
  styleUrls: ['./otp-authentication.component.css']
})
export class OtpAuthenticationComponent implements OnInit {
  @Input() phoneNumber: string = '';
  @Input() showModal: boolean = false;
  @Input() purpose: 'login' | 'register' | 'verify' = 'login';
  
  @Output() onSuccess = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();
  @Output() onError = new EventEmitter<string>();

  // Form states
  currentStep: 'phone' | 'otp' = 'phone';
  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Form data
  mobile = '';
  otpCode = '';
  requestId = '';

  // Timer
  countdown = 0;
  canResend = true;
  timer: any;

  // OTP input handling
  otpInputs: string[] = ['', '', '', '', '', ''];
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.phoneNumber) {
      this.mobile = this.phoneNumber;
    }
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  // ===============================
  // Phone Number Step
  // ===============================

  validatePhoneNumber(): boolean {
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(this.mobile);
  }

  formatPhoneNumber(): void {
    // Remove any non-digit characters
    this.mobile = this.mobile.replace(/\D/g, '');
    
    // Ensure it starts with 09
    if (this.mobile.length > 0 && !this.mobile.startsWith('09')) {
      if (this.mobile.startsWith('9')) {
        this.mobile = '0' + this.mobile;
      }
    }
    
    // Limit to 11 digits
    if (this.mobile.length > 11) {
      this.mobile = this.mobile.substring(0, 11);
    }
  }

  sendOtp(): void {
    if (!this.validatePhoneNumber()) {
      this.error = 'شماره موبایل وارد شده صحیح نمی‌باشد';
      return;
    }

    this.loading = true;
    this.error = null;

    const payload = {
      mobile: this.mobile,
      purpose: this.purpose
    };

    this.http.post<OtpResponse>(`${environment.apiUrl}/api/auth/send-otp/`, payload)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.requestId = response.request_id || '';
            this.currentStep = 'otp';
            this.startCountdown();
            this.success = response.message || 'کد تأیید با موفقیت ارسال شد';
            
            // Focus first OTP input
            setTimeout(() => {
              const firstInput = document.getElementById('otp-0');
              firstInput?.focus();
            }, 100);
          } else {
            this.error = response.message || 'خطا در ارسال کد تأیید';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در ارسال OTP:', error);
          this.error = error.error?.message || 'خطا در ارسال کد تأیید. لطفاً دوباره تلاش کنید.';
          this.loading = false;
        }
      });
  }

  // ===============================
  // OTP Verification Step
  // ===============================

  onOtpInput(index: number, event: any): void {
    const value = event.target.value;
    
    // Only allow digits
    if (!/^\d*$/.test(value)) {
      event.target.value = this.otpInputs[index];
      return;
    }

    this.otpInputs[index] = value;
    this.otpCode = this.otpInputs.join('');

    // Move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-verify when all inputs are filled
    if (this.otpCode.length === 6) {
      setTimeout(() => this.verifyOtp(), 100);
    }
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    // Handle backspace
    if (event.key === 'Backspace' && !this.otpInputs[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
    
    // Handle paste
    if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').substring(0, 6);
        if (digits.length === 6) {
          for (let i = 0; i < 6; i++) {
            this.otpInputs[i] = digits[i] || '';
            const input = document.getElementById(`otp-${i}`) as HTMLInputElement;
            if (input) input.value = digits[i] || '';
          }
          this.otpCode = digits;
          this.verifyOtp();
        }
      });
    }
  }

  verifyOtp(): void {
    if (this.otpCode.length !== 6) {
      this.error = 'کد تأیید باید ۶ رقم باشد';
      return;
    }

    this.loading = true;
    this.error = null;

    const payload = {
      mobile: this.mobile,
      otp_code: this.otpCode,
      request_id: this.requestId,
      purpose: this.purpose
    };

    this.http.post<OtpResponse>(`${environment.apiUrl}/api/auth/verify-otp/`, payload)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.success = response.message || 'ورود موفق';
            
            // Store token if provided
            if (response.token) {
              localStorage.setItem('auth_token', response.token);
            }
            
            // Emit success event
            this.onSuccess.emit({
              user: response.user,
              token: response.token,
              mobile: this.mobile
            });
            
            // Close modal after short delay
            setTimeout(() => {
              this.closeModal();
            }, 1500);
          } else {
            this.error = response.message || 'کد تأیید اشتباه است';
            this.clearOtpInputs();
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در تأیید OTP:', error);
          this.error = error.error?.message || 'کد تأیید اشتباه است';
          this.clearOtpInputs();
          this.loading = false;
        }
      });
  }

  // ===============================
  // Helper Methods
  // ===============================

  startCountdown(): void {
    this.countdown = 120; // 2 minutes
    this.canResend = false;
    
    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.canResend = true;
        clearInterval(this.timer);
      }
    }, 1000);
  }

  resendOtp(): void {
    if (!this.canResend) return;
    
    this.clearOtpInputs();
    this.sendOtp();
  }

  clearOtpInputs(): void {
    this.otpInputs = ['', '', '', '', '', ''];
    this.otpCode = '';
    
    // Clear input values
    for (let i = 0; i < 6; i++) {
      const input = document.getElementById(`otp-${i}`) as HTMLInputElement;
      if (input) input.value = '';
    }
    
    // Focus first input
    setTimeout(() => {
      const firstInput = document.getElementById('otp-0');
      firstInput?.focus();
    }, 100);
  }

  formatCountdown(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  goBackToPhone(): void {
    this.currentStep = 'phone';
    this.clearOtpInputs();
    this.error = null;
    this.success = null;
    
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  closeModal(): void {
    this.currentStep = 'phone';
    this.mobile = '';
    this.clearOtpInputs();
    this.error = null;
    this.success = null;
    this.requestId = '';
    
    if (this.timer) {
      clearInterval(this.timer);
      this.canResend = true;
      this.countdown = 0;
    }
    
    this.onClose.emit();
  }

  getPurposeTitle(): string {
    switch (this.purpose) {
      case 'login':
        return 'ورود به فروشگاه';
      case 'register':
        return 'ثبت‌نام در فروشگاه';
      case 'verify':
        return 'تأیید شماره موبایل';
      default:
        return 'احراز هویت';
    }
  }

  getPurposeDescription(): string {
    switch (this.purpose) {
      case 'login':
        return 'برای ورود به پنل مدیریت فروشگاه، شماره موبایل خود را وارد کنید';
      case 'register':
        return 'برای ایجاد حساب کاربری جدید، شماره موبایل خود را وارد کنید';
      case 'verify':
        return 'برای تأیید شماره موبایل، کد ارسال شده را وارد کنید';
      default:
        return 'شماره موبایل خود را وارد کنید';
    }
  }
}