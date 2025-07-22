import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

// Custom Validators
function passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }
  return null;
}

function strongPasswordValidator(control: AbstractControl): {[key: string]: any} | null {
  const password = control.value;
  if (!password) return null;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumeric = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isValidLength = password.length >= 8;
  
  const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isValidLength;
  
  if (!passwordValid) {
    return {
      'strongPassword': {
        hasUpperCase,
        hasLowerCase,
        hasNumeric,
        hasSpecialChar,
        isValidLength
      }
    };
  }
  return null;
}

@Component({
  selector: 'app-register',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <!-- Background Animation -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>

        <!-- Register Form -->
        <div class="relative backdrop-blur-sm bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-1">Create Account</h2>
            <p class="text-gray-300 text-sm">Join ShopSphere today</p>
          </div>

          <!-- Form -->
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <!-- Name Fields -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <!-- First Name -->
              <div>
                <label class="block text-xs font-medium text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  formControlName="firstName"
                  class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm text-sm"
                  placeholder="First name"
                  [class.border-red-500]="isFieldInvalid('firstName')"
                />
              </div>

              <!-- Last Name -->
              <div>
                <label class="block text-xs font-medium text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  formControlName="lastName"
                  class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm text-sm"
                  placeholder="Last name"
                  [class.border-red-500]="isFieldInvalid('lastName')"
                />
              </div>
            </div>

            <!-- Username -->
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                formControlName="username"
                class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm text-sm"
                placeholder="Choose a username"
                [class.border-red-500]="isFieldInvalid('username')"
              />
              <div *ngIf="isFieldInvalid('username')" class="text-red-400 text-xs mt-1">
                {{ getFieldError('username') }}
              </div>
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm text-sm"
                placeholder="Enter your email"
                [class.border-red-500]="isFieldInvalid('email')"
              />
              <div *ngIf="isFieldInvalid('email')" class="text-red-400 text-xs mt-1">
                {{ getFieldError('email') }}
              </div>
            </div>

            <!-- Password -->
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-300 mb-1">
                Password
              </label>
              <div class="relative">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  class="w-full px-3 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm text-sm"
                  placeholder="Create a strong password"
                  [class.border-red-500]="isFieldInvalid('password')"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  (click)="togglePassword()"
                >
                  <svg *ngIf="!showPassword" class="w-4 h-4 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg *ngIf="showPassword" class="w-4 h-4 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Password Strength Indicator -->
              <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.value" class="mt-2">
                <div class="flex space-x-1 mb-1">
                  <div class="h-1 flex-1 rounded" [class]="getPasswordStrengthClass(0)"></div>
                  <div class="h-1 flex-1 rounded" [class]="getPasswordStrengthClass(1)"></div>
                  <div class="h-1 flex-1 rounded" [class]="getPasswordStrengthClass(2)"></div>
                  <div class="h-1 flex-1 rounded" [class]="getPasswordStrengthClass(3)"></div>
                </div>
                <div class="text-xs text-gray-400">
                  Password strength: {{ getPasswordStrengthText() }}
                </div>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                [type]="showConfirmPassword ? 'text' : 'password'"
                formControlName="confirmPassword"
                class="w-full px-3 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm text-sm"
                placeholder="Confirm your password"
                [class.border-red-500]="isFieldInvalid('confirmPassword') || registerForm.errors?.['passwordMismatch']"
              />
              <div *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched" class="text-red-400 text-xs mt-1">
                Passwords do not match
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="mb-6">
              <label class="flex items-start">
                <input 
                  type="checkbox" 
                  formControlName="agreeToTerms"
                  class="w-4 h-4 text-cyan-600 bg-white/10 border-white/20 rounded focus:ring-cyan-500 focus:ring-2 mt-0.5 mr-3"
                />
                <span class="text-xs text-gray-300 leading-relaxed">
                  I agree to the 
                  <a href="/terms" target="_blank" class="text-cyan-400 hover:text-cyan-300 underline">Terms of Service</a> 
                  and 
                  <a href="/privacy" target="_blank" class="text-cyan-400 hover:text-cyan-300 underline">Privacy Policy</a>
                </span>
              </label>
              <div *ngIf="registerForm.get('agreeToTerms')?.invalid && registerForm.get('agreeToTerms')?.touched" class="text-red-400 text-xs mt-1">
                You must agree to the terms and conditions
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" 
                 class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {{ errorMessage }}
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage" 
                 class="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
              {{ successMessage }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="registerForm.invalid || loading"
              class="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-cyan-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!loading">Create Account</span>
              <span *ngIf="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            </button>
          </form>

          <!-- Sign In Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-300 text-sm">
              Already have an account? 
              <a routerLink="/auth/login" class="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Sign in here
              </a>
            </p>
          </div>

          <!-- Back to Home -->
          <div class="mt-3 text-center">
            <a routerLink="/" class="text-gray-400 hover:text-gray-300 text-xs transition-colors">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob { animation: blob 7s infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
  `]
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  passwordRequirements = {
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumeric: false,
    hasSpecialChar: false,
    isValidLength: false
  };
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    // Check if already authenticated
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        if (isAuth) {
          this.router.navigate(['/dashboard']);
        }
      });

    // Subscribe to loading state
    this.authService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    // Watch password changes for strength indicator
    this.registerForm.get('password')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(password => {
        this.updatePasswordRequirements(password);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.loading) {
      const formData = this.registerForm.value;
      
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        confirm_password: formData.confirmPassword
      };

      this.errorMessage = '';
      this.successMessage = '';

      this.authService.register(registerData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            this.successMessage = 'Account created successfully! Please check your email for verification.';
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/auth/login'], {
                queryParams: { 
                  message: encodeURIComponent('Registration successful! Please login with your credentials.')
                }
              });
            }, 2000);
          },
          error: (error) => {
            console.error('Registration failed:', error);
            this.errorMessage = error.message || 'Registration failed. Please try again.';
            
            // Handle specific field errors
            if (error.originalError?.error) {
              const fieldErrors = error.originalError.error;
              
              if (fieldErrors.username) {
                this.registerForm.get('username')?.setErrors({ server: fieldErrors.username[0] });
              }
              if (fieldErrors.email) {
                this.registerForm.get('email')?.setErrors({ server: fieldErrors.email[0] });
              }
            }
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.registerForm);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private updatePasswordRequirements(password: string): void {
    if (!password) {
      this.passwordRequirements = {
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumeric: false,
        hasSpecialChar: false,
        isValidLength: false
      };
      return;
    }

    this.passwordRequirements = {
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumeric: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      isValidLength: password.length >= 8
    };
  }

  getPasswordStrength(): number {
    const requirements = Object.values(this.passwordRequirements);
    return requirements.filter(req => req).length;
  }

  getPasswordStrengthClass(index: number): string {
    const strength = this.getPasswordStrength();
    if (index < strength) {
      if (strength <= 2) return 'bg-red-500';
      if (strength <= 3) return 'bg-yellow-500';
      if (strength <= 4) return 'bg-blue-500';
      return 'bg-green-500';
    }
    return 'bg-gray-600';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  }

  // Utility methods
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['pattern']) {
        return 'Username can only contain letters, numbers, and underscores';
      }
      if (field.errors['server']) {
        return field.errors['server'];
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First name',
      lastName: 'Last name',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password'
    };
    return labels[fieldName] || fieldName;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
