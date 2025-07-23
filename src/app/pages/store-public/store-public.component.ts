import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Product {
  id: number;
  name: string;
  price: string;
  compare_price?: string;
  images: string[];
  category?: string;
  is_on_sale: boolean;
  discount_percentage: number;
}

interface Category {
  id: number;
  name: string;
  image?: string;
}

interface Store {
  name: string;
  description: string;
  logo?: string;
}

@Component({
  selector: 'app-store-public',
  templateUrl: './store-public.component.html',
  styleUrls: ['./store-public.component.css']
})
export class StorePublicComponent implements OnInit {
  storeDomain!: string;
  store: Store | null = null;
  featuredProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeDomain = params['domain'];
      this.loadStoreData();
    });
  }

  loadStoreData(): void {
    this.http.get(`${environment.apiUrl}/api/public/stores/${this.storeDomain}/`)
      .subscribe({
        next: (data: any) => {
          this.store = data.store;
          this.featuredProducts = data.featured_products;
          this.categories = data.categories;
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در بارگذاری فروشگاه:', error);
          this.error = 'فروشگاه یافت نشد';
          this.loading = false;
        }
      });
  }

  addToCart(productId: number): void {
    this.http.post(`${environment.apiUrl}/api/public/stores/${this.storeDomain}/cart/add/`, {
      product_instance_id: productId,
      quantity: 1
    }).subscribe({
      next: (response: any) => {
        alert(response.message || 'محصول به سبد خرید اضافه شد');
      },
      error: (error) => {
        alert('خطا در افزودن به سبد خرید');
      }
    });
  }

  formatPrice(price: string): string {
    return parseInt(price).toLocaleString('fa-IR') + ' تومان';
  }
}