import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  views: number;
  sales: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  product_count: number;
}

@Component({
  selector: 'app-store-public',
  templateUrl: './store-public.component.html',
  styleUrls: ['./store-public.component.css']
})
export class StorePublicComponent implements OnInit {
  // Store info
  storeSlug = '';
  store: any = null;
  
  // Products and categories
  recentProducts: Product[] = [];
  mostViewedProducts: Product[] = [];
  recommendedProducts: Product[] = [];
  categories: Category[] = [];
  
  // Search and filters
  searchTerm = '';
  selectedCategory = '';
  sortBy = 'recent';
  priceMin = 0;
  priceMax = 0;
  
  // State
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.extractStoreSlug();
    this.loadStoreData();
  }

  extractStoreSlug(): void {
    const hostname = window.location.hostname;
    if (hostname.includes('.')) {
      this.storeSlug = hostname.split('.')[0];
    }
  }

  loadStoreData(): void {
    this.loading = true;
    
    this.http.get(`${environment.apiUrl}/api/public/store/${this.storeSlug}/`)
      .subscribe({
        next: (response: any) => {
          this.store = response.store;
          this.loadProducts();
          this.loadCategories();
        },
        error: (error) => {
          this.error = 'فروشگاه یافت نشد';
          this.loading = false;
        }
      });
  }

  loadProducts(): void {
    const params = {
      store_slug: this.storeSlug,
      search: this.searchTerm,
      category: this.selectedCategory,
      sort: this.sortBy,
      price_min: this.priceMin.toString(),
      price_max: this.priceMax.toString()
    };

    // Load recent products
    this.http.get<Product[]>(`${environment.apiUrl}/api/public/products/recent/`, { params })
      .subscribe({
        next: (products) => {
          this.recentProducts = products;
        },
        error: (error) => console.error('خطا در بارگذاری محصولات اخیر:', error)
      });

    // Load most viewed
    this.http.get<Product[]>(`${environment.apiUrl}/api/public/products/most-viewed/`, { params })
      .subscribe({
        next: (products) => {
          this.mostViewedProducts = products;
        },
        error: (error) => console.error('خطا در بارگذاری پربازدیدترین:', error)
      });

    // Load recommended
    this.http.get<Product[]>(`${environment.apiUrl}/api/public/products/recommended/`, { params })
      .subscribe({
        next: (products) => {
          this.recommendedProducts = products;
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در بارگذاری پیشنهادی:', error);
          this.loading = false;
        }
      });
  }

  loadCategories(): void {
    this.http.get<Category[]>(`${environment.apiUrl}/api/public/categories/${this.storeSlug}/`)
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => console.error('خطا در بارگذاری دسته‌بندی‌ها:', error)
      });
  }

  onSearch(): void {
    this.loadProducts();
  }

  onFilterChange(): void {
    this.loadProducts();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  }
}