import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

interface Pagination {
  page: number;
  per_page: number;
  total: number;
  pages: number;
}

@Component({
  selector: 'app-store-products',
  templateUrl: './store-products.component.html',
  styleUrls: ['./store-products.component.css']
})
export class StoreProductsComponent implements OnInit {
  storeDomain!: string;
  products: Product[] = [];
  categories: Category[] = [];
  pagination: Pagination | null = null;
  loading = true;
  
  // Filters
  selectedCategory: string = '';
  searchQuery: string = '';
  sortBy: string = 'newest';
  currentPage: number = 1;
  
  sortOptions = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'price_low', label: 'قیمت: کم به زیاد' },
    { value: 'price_high', label: 'قیمت: زیاد به کم' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeDomain = params['domain'];
      this.loadCategories();
      this.loadProducts();
    });
    
    // Load initial filters from URL
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || '';
      this.searchQuery = params['search'] || '';
      this.sortBy = params['sort'] || 'newest';
      this.currentPage = parseInt(params['page']) || 1;
    });
  }

  loadCategories(): void {
    this.http.get(`${environment.apiUrl}/api/public/stores/${this.storeDomain}/categories/`)
      .subscribe({
        next: (categories: any) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('خطا در بارگذاری دسته‌بندی‌ها:', error);
        }
      });
  }

  loadProducts(): void {
    this.loading = true;
    
    const params: any = {
      page: this.currentPage,
      sort: this.sortBy
    };
    
    if (this.selectedCategory) {
      params.category = this.selectedCategory;
    }
    
    if (this.searchQuery) {
      params.search = this.searchQuery;
    }
    
    this.http.get(`${environment.apiUrl}/api/public/stores/${this.storeDomain}/products/`, { params })
      .subscribe({
        next: (data: any) => {
          this.products = data.products;
          this.pagination = data.pagination;
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در بارگذاری محصولات:', error);
          this.loading = false;
        }
      });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.updateUrl();
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateUrl();
    this.loadProducts();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateUrl(): void {
    const queryParams: any = {};
    
    if (this.selectedCategory) queryParams.category = this.selectedCategory;
    if (this.searchQuery) queryParams.search = this.searchQuery;
    if (this.sortBy !== 'newest') queryParams.sort = this.sortBy;
    if (this.currentPage > 1) queryParams.page = this.currentPage;
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.searchQuery = '';
    this.sortBy = 'newest';
    this.currentPage = 1;
    this.updateUrl();
    this.loadProducts();
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

  getPageNumbers(): number[] {
    if (!this.pagination) return [];
    
    const pages = [];
    const total = this.pagination.pages;
    const current = this.pagination.page;
    
    // Show 5 pages around current
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}