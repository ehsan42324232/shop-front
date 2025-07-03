
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="p-6 max-w-sm mx-auto">
      <h2 class="text-xl font-bold mb-4">ورود</h2>
      <form (ngSubmit)="onLogin()">
        <input [(ngModel)]="username" name="username" class="border w-full p-2 rounded mb-2" placeholder="نام کاربری" required />
        <input [(ngModel)]="password" name="password" type="password" class="border w-full p-2 rounded mb-4" placeholder="رمز عبور" required />
        <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded">ورود</button>
      </form>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService) {}

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(() => {
      alert('با موفقیت وارد شدید');
    });
  }
}
