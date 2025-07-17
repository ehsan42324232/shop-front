import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { BasketService } from '../../../services/basket.service';
import { AuthService } from '../../../services/auth.service';
import { Product, User } from '../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  template: `
    <div class="container mx-auto px-4 py-8" *ngIf="product">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Product Images -->
        <div class="space-y-4">
          <div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <img *ngIf="selectedImage" 
                 [src]="selectedImage" 
                 [alt]="product.title"
                 class="w-full h-full object-cover">
            <div *ngIf="!selectedImage" 
                 class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          
          <!-- Thumbnail Images -->
          <div *ngIf="product.media && product.media.length > 1" 
               class="flex space-x-2 overflow-x-auto">
            <img *ngFor="let media of product.media" 
                 [src]="media.file" 
                 [alt]="product.title"
                 class="w-16 h-16 object-cover rounded cursor-pointer border-2"
                 [class.border-blue-500]="selectedImage === media.file"
                 [class.border-gray-200]="selectedImage !== media.file"
                 (click)="selectedImage = media.file">
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.title }}</h1>
            <p class="text-gray-600">{{ product.description }}</p>
          </div>

          <!-- Rating -->
          <div class="flex items-center space-x-2">
            <div class="flex items-center">
              <span *ngFor="let i of [1,2,3,4,5]" 
                    class="text-xl"
                    [class.text-yellow-400]="i <= product.average_rating"
                    [class.text-gray-300]="i > product.average_rating">
                ★
              </span>
            </div>
            <span class="text-gray-500">
              {{ product.average_rating.toFixed(1) }} ({{ product.rating_count }} reviews)
            </span>
          </div>

          <!-- Price -->
          <div class="text-3xl font-bold text-blue-600">
            \\${{ product.price }}
          </div>

          <!-- Stock Status -->
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium"
                  [class.text-green-600]="product.stock > 0"
                  [class.text-red-600]="product.stock <= 0">
              {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </span>
            <span *ngIf="product.stock > 0" class="text-sm text-gray-500">
              ({{ product.stock }} available)
            </span>
          </div>

          <!-- Add to Cart -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center border border-gray-300 rounded">
              <button class="px-3 py-2 hover:bg-gray-100" 
                      (click)="decreaseQuantity()"
                      [disabled]="quantity <= 1">
                -
              </button>
              <span class="px-4 py-2">{{ quantity }}</span>
              <button class="px-3 py-2 hover:bg-gray-100" 
                      (click)="increaseQuantity()"
                      [disabled]="quantity >= product.stock">
                +
              </button>
            </div>
            <button 
              (click)="addToBasket()"
              [disabled]="product.stock <= 0"
              class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
            </button>
          </div>

          <!-- Rating Form -->
          <div *ngIf="currentUser$ | async" class="border-t pt-6">
            <h3 class="text-lg font-semibold mb-4">Rate this product</h3>
            <div class="flex items-center space-x-2 mb-4">
              <span *ngFor="let i of [1,2,3,4,5]" 
                    class="text-2xl cursor-pointer"
                    [class.text-yellow-400]="i <= userRating"
                    [class.text-gray-300]="i > userRating"
                    (click)="setRating(i)">
                ★
              </span>
            </div>
            <button *ngIf="userRating > 0" 
                    (click)="submitRating()"
                    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Submit Rating
            </button>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="mt-12 border-t pt-8">
        <h2 class="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        <!-- Add Comment Form -->
        <div *ngIf="currentUser$ | async" class="mb-8">
          <form [formGroup]="commentForm" (ngSubmit)="submitComment()" class="space-y-4">
            <textarea 
              formControlName="text"
              placeholder="Write your review..."
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            ></textarea>
            <button type="submit" 
                    [disabled]="commentForm.invalid"
                    class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              Submit Review
            </button>
          </form>
        </div>

        <!-- Comments List -->
        <div class="space-y-6">
          <div *ngFor="let comment of product.comments" 
               class="bg-gray-50 rounded-lg p-6">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {{ comment.user.username.charAt(0).toUpperCase() }}
                </div>
                <span class="font-medium">{{ comment.user.username }}</span>
              </div>
              <span class="text-sm text-gray-500">
                {{ formatDate(comment.created_at) }}
              </span>
            </div>
            <p class="text-gray-700">{{ comment.text }}</p>
          </div>
          
          <div *ngIf="!product.comments || product.comments.length === 0" 
               class="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review this product!
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  selectedImage: string = '';
  quantity = 1;
  userRating = 0;
  commentForm: FormGroup;
  currentUser$: Observable<User | null>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private basketService: BasketService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = parseInt(params['id']);
      this.loadProduct(productId);
    });
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id.toString()).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = product.media && product.media.length > 0 ? product.media[0].file : '';
      },
      error: (error) => {
        console.error('Error loading product:', error);
      }
    });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToBasket(): void {
    if (this.product) {
      this.basketService.addToBasket(this.product.id, this.quantity).subscribe({
        next: () => {
          console.log('Product added to basket');
        },
        error: (error) => {
          console.error('Error adding to basket:', error);
        }
      });
    }
  }

  setRating(rating: number): void {
    this.userRating = rating;
  }

  submitRating(): void {
    if (this.product && this.userRating > 0) {
      this.productService.addRating(this.product.id.toString(), this.userRating).subscribe({
        next: () => {
          this.loadProduct(this.product!.id);
          this.userRating = 0;
        },
        error: (error) => {
          console.error('Error submitting rating:', error);
        }
      });
    }
  }

  submitComment(): void {
    if (this.product && this.commentForm.valid) {
      const text = this.commentForm.get('text')?.value;
      this.productService.addComment(this.product.id.toString(), text).subscribe({
        next: () => {
          this.loadProduct(this.product!.id);
          this.commentForm.reset();
        },
        error: (error) => {
          console.error('Error submitting comment:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
