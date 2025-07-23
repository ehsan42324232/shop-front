import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

interface Store {
  id: string;
  name: string;
  domain: string;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stores: Store[] = [];
  loading = true;
  user = this.authService.currentUserValue;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserStores();
  }

  loadUserStores(): void {
    this.http.get<Store[]>(`${environment.apiUrl}/api/user/stores/`)
      .subscribe({
        next: (stores) => {
          this.stores = stores;
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در بارگذاری فروشگاه‌ها:', error);
          this.loading = false;
        }
      });
  }

  logout(): void {
    this.authService.logout();
  }
}