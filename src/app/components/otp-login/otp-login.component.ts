import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, OTPRequest, OTPVerification } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-otp-login',
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.css']
})
export class OTPLoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Form state
  phoneForm: FormGroup;
  otpForm: FormGroup;
  
  // UI state
  currentStep: 'phone' | 'otp' = 'phone';
  loading = false;
  error = '';
  success = '';
  
  // OTP specific state
  otpSent = false;
  currentPhone = '';
  resendCountdown = 0;
  resendInterval: any;
  
  // Constants
  readonly RESEND_COUNTDOWN_SECONDS = 120; // 2 minutes
  readonly OTP_LENGTH = 5;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    // Check if user is already authenticated
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.redirectAfterLogin();
        }
      });
    
    // Pre-fill phone from query params if available
    const phone = this.route.snapshot.queryParams['phone'];
    if (phone) {
      this.phoneForm.patchValue({ phone });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
  }

  private initializeForms(): void {
    this.phoneForm = this.fb.group({
      phone: ['', [Validators.required, this.iranianPhoneValidator]]
    });

    this.otpForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]]
    });
  }

  // Custom validator for Iranian phone numbers
  private iranianPhoneValidator = (control: any) => {
    const phone = control.value;
    if (!phone) return null;
    
    const isValid = this.authService.isValidPhoneNumber(phone);
    return isValid ? null : { invalidPhone: true };
  };

  // Handle phone form submission
  onPhoneSubmit(): void {
    if (this.phoneForm.invalid || this.loading) return;

    const phoneData: OTPRequest = {
      phone: this.phoneForm.value.phone
    };

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.requestOTP(phoneData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.currentPhone = phoneData.phone;
            this.currentStep = 'otp';
            this.otpSent = true;
            this.success = response.message || 'کد تایید ارسال شد';
            this.startResendCountdown();
          } else {
            this.error = response.message || 'خطا در ارسال کد تایید';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message || 'خطا در ارسال کد تایید';
        }
      });
  }

  // Handle OTP form submission
  onOTPSubmit(): void {
    if (this.otpForm.invalid || this.loading) return;

    const verificationData: OTPVerification = {
      phone: this.currentPhone,
      code: this.otpForm.value.code
    };

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.verifyOTP(verificationData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.success = 'ورود موفقیت‌آمیز بود';
            setTimeout(() => {
              this.redirectAfterLogin();
            }, 1000);
          } else {
            this.error = response.message || 'کد تایید نادرست است';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message || 'کد تایید نادرست است';
        }
      });
  }

  // Resend OTP
  resendOTP(): void {
    if (this.resendCountdown > 0 || this.loading) return;

    const phoneData: OTPRequest = {
      phone: this.currentPhone
    };

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.requestOTP(phoneData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.success = 'کد تایید مجدداً ارسال شد';
            this.startResendCountdown();
            this.otpForm.reset();
          } else {
            this.error = response.message || 'خطا در ارسال مجدد کد تایید';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message || 'خطا در ارسال مجدد کد تایید';
        }
      });
  }

  // Start resend countdown timer
  private startResendCountdown(): void {
    this.resendCountdown = this.RESEND_COUNTDOWN_SECONDS;
    
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
    
    this.resendInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(this.resendInterval);
      }
    }, 1000);
  }

  // Go back to phone input step
  goBackToPhone(): void {
    this.currentStep = 'phone';
    this.otpSent = false;
    this.otpForm.reset();
    this.error = '';
    this.success = '';
    
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendCountdown = 0;
    }
  }

  // Navigate to registration
  goToRegister(): void {
    this.router.navigate(['/auth/register'], {
      queryParams: { phone: this.phoneForm.value.phone }
    });
  }

  // Format countdown time
  getFormattedCountdown(): string {
    const minutes = Math.floor(this.resendCountdown / 60);
    const seconds = this.resendCountdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Format phone number for display
  getFormattedPhone(): string {
    const phone = this.currentPhone;
    if (!phone) return '';
    
    // Format Iranian phone numbers for display
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('98') && digits.length === 12) {
      // +989xxxxxxxxx -> 09xx xxx xxxx
      const mobile = '0' + digits.substring(2);
      return `${mobile.substring(0, 4)} ${mobile.substring(4, 7)} ${mobile.substring(7)}`;
    }
    
    return phone;
  }

  // Handle OTP input formatting
  onOTPInput(event: any): void {
    let value = event.target.value.replace(/\D/g, ''); // Only digits
    if (value.length > this.OTP_LENGTH) {
      value = value.substring(0, this.OTP_LENGTH);
    }
    
    this.otpForm.patchValue({ code: value });
    
    // Auto-submit when OTP is complete
    if (value.length === this.OTP_LENGTH) {
      setTimeout(() => {
        this.onOTPSubmit();
      }, 500);
    }
  }

  // Handle phone input formatting
  onPhoneInput(event: any): void {
    let value = event.target.value.replace(/\D/g, ''); // Only digits
    
    // Format as 09xx xxx xxxx
    if (value.startsWith('0')) {
      if (value.length > 11) {
        value = value.substring(0, 11);
      }
      
      if (value.length > 4) {
        value = value.substring(0, 4) + ' ' + value.substring(4);
      }
      if (value.length > 8) {
        value = value.substring(0, 8) + ' ' + value.substring(8);
      }
    }
    
    this.phoneForm.patchValue({ phone: value });
  }

  // Clear error/success messages
  clearMessages(): void {
    this.error = '';
    this.success = '';
  }

  // Redirect after successful login
  private redirectAfterLogin(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    const user = this.authService.getCurrentUserValue();
    
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else if (user?.is_store_owner) {
      this.router.navigate(['/dashboard']);
    } else if (user?.is_customer) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/']);
    }
  }

  // Get appropriate form control
  get phoneControl() {
    return this.phoneForm.get('phone');
  }

  get otpControl() {
    return this.otpForm.get('code');
  }

  // Check if forms are valid
  get isPhoneFormValid(): boolean {
    return this.phoneForm.valid;
  }

  get isOTPFormValid(): boolean {
    return this.otpForm.valid;
  }

  // Check if resend is available
  get canResend(): boolean {
    return this.resendCountdown <= 0 && !this.loading;
  }
}
