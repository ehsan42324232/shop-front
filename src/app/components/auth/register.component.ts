
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="p-6 max-w-sm mx-auto">
      <h2 class="text-xl font-bold mb-4">ثبت‌نام</h2>
      <form (ngSubmit)="onRegister()">
        <input [(ngModel)]="username" name="username" class="border w-full p-2 rounded mb-2" placeholder="نام کاربری" required />
        <input [(ngModel)]="password" name="password" type="password" class="border w-full p-2 rounded mb-4" placeholder="رمز عبور" required />
        <button type="submit" class="w-full bg-green-600 text-white p-2 rounded">ثبت‌نام</button>
      </form>
    </div>
  `
})
export class RegisterComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService) {}

  onRegister(): void {
    this.authService.register(this.username, this.password).subscribe(() => {
      alert('ثبت‌نام انجام شد');
    });
  }
}
