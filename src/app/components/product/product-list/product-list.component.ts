import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { BasketService } from '../../../services/basket.service';
import { Product, ApiResponse } from '../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Filters -->
      <div class="mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <select class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  (change)="onCategoryChange($event)">
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </option>
          </select>
          
          <select class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  (change)="onSortChange($event)">
            <option value="">Sort By</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-created_at">Newest First</option>
            <option value="title">Name A-Z</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let product of products" 
             class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          
          <!-- Product Image -->
          <div class="relative h-48 bg-gray-200 cursor-pointer" 
               (click)="router.navigate(['/products', product.id])">
            <img *ngIf="product.media && product.media.length > 0" 
                 [src]="product.media[0].file" 
                 [alt]="product.title"
                 class="w-full h-full object-cover">
            <div *ngIf="!product.media || product.media.length === 0" 
                 class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            
            <!-- Stock Badge -->
            <div *ngIf="product.stock <= 0" 
                 class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Out of Stock
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600" 
                (click)="router.navigate(['/products', product.id])">
              {{ product.title }}
            </h3>
            
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">
              {{ product.description }}
            </p>
            
            <!-- Rating -->
            <div class="flex items-center mb-3">
              <div class="flex items-center">
                <span *ngFor="let i of [1,2,3,4,5]" 
                      class="text-lg"
                      [class.text-yellow-400]="i <= product.average_rating"
                      [class.text-gray-300]="i > product.average_rating">
                  ★
                </span>
              </div>
              <span class="ml-2 text-sm text-gray-500">
                ({{ product.rating_count }} reviews)
              </span>
            </div>
            
            <!-- Price and Actions -->
            <div class="flex items-center justify-between">
              <span class="text-xl font-bold text-blue-600">
                \${{ product.price }}
              </span>
              
              <button 
                (click)="addToBasket(product)"
                [disabled]="product.stock <= 0"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
                {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="products.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m14 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m14 0H6m14 0l-3-3m3 3l-3 3M6 13l3-3m-3 3l3 3"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>

      <!-- Pagination -->
      <div *ngIf="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button *ngIf="currentPage > 1" 
                  (click)="loadPage(currentPage - 1)"
                  class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
            Previous
          </button>
          
          <span *ngFor="let page of getPageNumbers()" 
                class="px-3 py-2 text-sm cursor-pointer"
                [class.bg-blue-600]="page === currentPage"
                [class.text-white]="page === currentPage"
                [class.text-gray-500]="page !== currentPage"
                [class.hover:text-gray-700]="page !== currentPage"
                (click)="loadPage(page)">
            {{ page }}
          </span>
          
          <button *ngIf="currentPage < totalPages" 
                  (click)="loadPage(currentPage + 1)"
                  class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
            Next
          </button>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: any[] = [];
  currentPage = 1;
  totalPages = 1;
  totalProducts = 0;
  filters: any = {};

  constructor(
    private productService: ProductService,
    private basketService: BasketService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filters = { ...params };
      this.currentPage = parseInt(params['page']) || 1;
      this.loadProducts();
    });
    this.loadCategories();
  }

  loadProducts(): void {
    const params = {
      ...this.filters,
      page: this.currentPage
    };
    
    this.productService.getProducts(params).subscribe({
      next: (response: ApiResponse<Product>) => {
        this.products = response.results;
        this.totalProducts = response.count;
        this.totalPages = Math.ceil(response.count / 20); // Assuming 20 items per page
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  loadCategories(): void {
    // Load categories if needed
  }

  onCategoryChange(event: any): void {
    const categoryId = event.target.value;
    this.updateFilters({ category: categoryId || undefined });
  }

  onSortChange(event: any): void {
    const sortBy = event.target.value;
    this.updateFilters({ ordering: sortBy || undefined });
  }

  updateFilters(newFilters: any): void {
    this.filters = { ...this.filters, ...newFilters };
    this.currentPage = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...this.filters, page: this.currentPage },
      queryParamsHandling: 'merge'
    });
  }

  loadPage(page: number): void {
    this.currentPage = page;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...this.filters, page: this.currentPage },
      queryParamsHandling: 'merge'
    });
  }

  getPageNumbers(): number[] {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  addToBasket(product: Product): void {
    this.basketService.addToBasket(product.id).subscribe({
      next: () => {
        // Could show a toast notification here
        console.log('Product added to basket');
      },
      error: (error) => {
        console.error('Error adding to basket:', error);
      }
    });
  }
}
