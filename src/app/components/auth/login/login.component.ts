import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, OTPRequest, OTPVerification } from '../../services/auth.service';
import { Subject, interval } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Form state
  step: 'phone' | 'otp' = 'phone';
  isLoading = false;
  
  // Form data
  phone = '';
  otpCode = '';
  
  // Validation and messages
  phoneError = '';
  otpError = '';
  successMessage = '';
  
  // OTP countdown
  otpCountdown = 0;
  canResendOTP = true;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/platform']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Send OTP to phone number
   */
  sendOTP(): void {
    if (!this.validatePhone()) {
      return;
    }

    this.isLoading = true;
    this.phoneError = '';
    
    const cleanPhone = this.authService.cleanPhoneNumber(this.phone);
    const otpRequest: OTPRequest = {
      phone: cleanPhone,
      purpose: 'login'
    };

    this.authService.sendOTP(otpRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.step = 'otp';
            this.startOTPCountdown();
            this.successMessage = response.message;
          } else {
            this.phoneError = response.message;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.phoneError = error.message;
        }
      });
  }

  /**
   * Verify OTP code
   */
  verifyOTP(): void {
    if (!this.validateOTP()) {
      return;
    }

    this.isLoading = true;
    this.otpError = '';
    
    const cleanPhone = this.authService.cleanPhoneNumber(this.phone);
    const otpVerification: OTPVerification = {
      phone: cleanPhone,
      otp_code: this.otpCode,
      purpose: 'login'
    };

    this.authService.verifyOTP(otpVerification)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = response.message;
            // Redirect based on user type
            if (response.user?.is_store_owner) {
              this.router.navigate(['/platform']);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            this.otpError = response.message;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.otpError = error.message;
        }
      });
  }

  /**
   * Resend OTP code
   */
  resendOTP(): void {
    if (!this.canResendOTP) {
      return;
    }

    this.otpCode = '';
    this.otpError = '';
    this.sendOTP();
  }

  /**
   * Go back to phone step
   */
  goBackToPhone(): void {
    this.step = 'phone';
    this.otpCode = '';
    this.otpError = '';
    this.successMessage = '';
    this.otpCountdown = 0;
    this.canResendOTP = true;
  }

  /**
   * Navigate to register
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  /**
   * Validate phone number
   */
  private validatePhone(): boolean {
    this.phoneError = '';
    
    if (!this.phone.trim()) {
      this.phoneError = 'شماره تلفن الزامی است.';
      return false;
    }

    if (!this.authService.validateIranianPhone(this.phone)) {
      this.phoneError = 'شماره تلفن باید به فرمت 09xxxxxxxxx باشد.';
      return false;
    }

    return true;
  }

  /**
   * Validate OTP code
   */
  private validateOTP(): boolean {
    this.otpError = '';
    
    if (!this.otpCode.trim()) {
      this.otpError = 'کد تایید الزامی است.';
      return false;
    }

    if (this.otpCode.length !== 6) {
      this.otpError = 'کد تایید باید 6 رقم باشد.';
      return false;
    }

    if (!/^\d+$/.test(this.otpCode)) {
      this.otpError = 'کد تایید باید عددی باشد.';
      return false;
    }

    return true;
  }

  /**
   * Start OTP countdown timer
   */
  private startOTPCountdown(): void {
    this.otpCountdown = 120; // 2 minutes
    this.canResendOTP = false;
    
    interval(1000)
      .pipe(
        take(this.otpCountdown),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.otpCountdown--;
          if (this.otpCountdown <= 0) {
            this.canResendOTP = true;
          }
        }
      });
  }

  /**
   * Format countdown time
   */
  getCountdownText(): string {
    const minutes = Math.floor(this.otpCountdown / 60);
    const seconds = this.otpCountdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Handle phone input formatting
   */
  onPhoneInput(event: any): void {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format as user types
    if (value.length > 0) {
      if (value.startsWith('98')) {
        value = '0' + value.substring(2);
      }
      if (!value.startsWith('0')) {
        value = '0' + value;
      }
      if (value.length > 11) {
        value = value.substring(0, 11);
      }
    }
    
    this.phone = value;
    event.target.value = this.authService.formatIranianPhone(value);
  }

  /**
   * Handle OTP input (digits only)
   */
  onOTPInput(event: any): void {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 6) {
      value = value.substring(0, 6);
    }
    this.otpCode = value;
    event.target.value = value;
  }

  /**
   * Auto-submit when OTP is complete
   */
  onOTPChange(): void {
    if (this.otpCode.length === 6) {
      // Auto-verify after a short delay
      setTimeout(() => {
        if (this.otpCode.length === 6) {
          this.verifyOTP();
        }
      }, 500);
    }
  }
}
