import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-otp-login',
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.css']
})
export class OtpLoginComponent {
  step = 1; // 1: phone input, 2: OTP input
  phoneNumber = '';
  otpCode = '';
  loading = false;
  error = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  sendOTP(): void {
    if (!this.phoneNumber) {
      this.error = 'شماره تلفن را وارد کنید';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.sendOTP(this.phoneNumber).subscribe({
      next: (response) => {
        if (response.success) {
          this.step = 2;
          this.loading = false;
        } else {
          this.error = response.message || 'خطا در ارسال کد';
          this.loading = false;
        }
      },
      error: (error) => {
        this.error = 'خطا در ارسال کد. لطفاً دوباره تلاش کنید.';
        this.loading = false;
      }
    });
  }

  verifyOTP(): void {
    if (!this.otpCode) {
      this.error = 'کد تایید را وارد کنید';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.verifyOTP(this.phoneNumber, this.otpCode).subscribe({
      next: (response) => {
        if (response.success && response.user) {
          this.authService.login(response.user);
          this.router.navigate(['/dashboard']);
        } else {
          this.error = response.message || 'کد تایید اشتباه است';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'خطا در تایید کد. لطفاً دوباره تلاش کنید.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.step = 1;
    this.otpCode = '';
    this.error = '';
  }
}