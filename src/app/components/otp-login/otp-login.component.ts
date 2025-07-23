import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject, interval, takeUntil } from 'rxjs';

@Component({
  selector: 'app-otp-login',
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.css']
})
export class OtpLoginComponent implements OnInit, OnDestroy {
  phoneNumber = '';
  otpCode = '';
  isOtpSent = false;
  isLoading = false;
  countdown = 120; // 2 minutes
  canResend = false;
  errorMessage = '';
  successMessage = '';
  
  private destroy$ = new Subject<void>();
  private countdownTimer$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Clear any existing session
    this.authService.clearSession();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopCountdown();
  }

  validatePhoneNumber(): boolean {
    // Iranian mobile number validation
    const iranMobileRegex = /^(\+98|0)?9\d{9}$/;
    return iranMobileRegex.test(this.phoneNumber.trim());
  }

  formatPhoneNumber(): string {
    // Format phone number for display
    const cleaned = this.phoneNumber.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return cleaned;
    } else if (cleaned.startsWith('98')) {
      return '0' + cleaned.substring(2);
    } else if (cleaned.length === 10) {
      return '0' + cleaned;
    }
    return cleaned;
  }

  async sendOtp(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validatePhoneNumber()) {
      this.errorMessage = 'شماره موبایل وارد شده معتبر نیست. لطفاً شماره ایرانی وارد کنید.';
      return;
    }

    this.isLoading = true;
    
    try {
      const formattedPhone = this.formatPhoneNumber();
      await this.authService.sendOtp(formattedPhone);
      
      this.isOtpSent = true;
      this.successMessage = `کد تایید به شماره ${formattedPhone} ارسال شد.`;
      this.startCountdown();
      
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'خطا در ارسال کد تایید. لطفاً دوباره تلاش کنید.';
    } finally {
      this.isLoading = false;
    }
  }

  async verifyOtp(): Promise<void> {
    this.errorMessage = '';
    
    if (!this.otpCode || this.otpCode.length !== 6) {
      this.errorMessage = 'کد تایید باید ۶ رقم باشد.';
      return;
    }

    this.isLoading = true;

    try {
      const formattedPhone = this.formatPhoneNumber();
      const response = await this.authService.verifyOtp(formattedPhone, this.otpCode);
      
      if (response.success) {
        this.successMessage = 'ورود موفقیت‌آمیز بود. در حال انتقال...';
        
        // Store authentication data
        this.authService.setAuthData(response.data);
        
        // Redirect based on user role
        setTimeout(() => {
          if (response.data.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (response.data.role === 'store_owner') {
            this.router.navigate(['/store-management']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }, 1500);
      }
      
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'کد تایید نامعتبر است. لطفاً دوباره تلاش کنید.';
    } finally {
      this.isLoading = false;
    }
  }

  async resendOtp(): Promise<void> {
    if (!this.canResend) return;
    
    this.canResend = false;
    this.countdown = 120;
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      const formattedPhone = this.formatPhoneNumber();
      await this.authService.sendOtp(formattedPhone);
      this.successMessage = 'کد تایید مجدداً ارسال شد.';
      this.startCountdown();
    } catch (error: any) {
      this.errorMessage = 'خطا در ارسال مجدد کد. لطفاً دوباره تلاش کنید.';
      this.canResend = true;
    }
  }

  private startCountdown(): void {
    this.stopCountdown();
    this.canResend = false;
    
    interval(1000)
      .pipe(takeUntil(this.countdownTimer$))
      .subscribe(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.canResend = true;
          this.stopCountdown();
        }
      });
  }

  private stopCountdown(): void {
    this.countdownTimer$.next();
    this.countdownTimer$.complete();
    this.countdownTimer$ = new Subject<void>();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  goBack(): void {
    this.isOtpSent = false;
    this.otpCode = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.stopCountdown();
  }

  // Handle OTP input for better UX
  onOtpInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    this.otpCode = value.substring(0, 6);
    
    // Auto-verify when 6 digits are entered
    if (this.otpCode.length === 6) {
      setTimeout(() => this.verifyOtp(), 500);
    }
  }

  // Handle phone number input
  onPhoneInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    this.phoneNumber = value;
  }
}