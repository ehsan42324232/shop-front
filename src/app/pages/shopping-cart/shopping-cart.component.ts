import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface CartItem {
  id: number;
  product_instance: {
    id: number;
    sku: string;
    name: string;
    price: string;
    images: string[];
    stock_quantity: number;
  };
  quantity: number;
  unit_price: string;
  total_price: string;
}

interface Cart {
  cart_id: number;
  items: CartItem[];
  total_items: number;
  total_price: string;
}

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  storeDomain!: string;
  cart: Cart | null = null;
  loading = true;
  updating: { [key: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeDomain = params['domain'];
      this.loadCart();
    });
  }

  loadCart(): void {
    this.loading = true;
    this.http.get<Cart>(`${environment.apiUrl}/api/public/stores/${this.storeDomain}/cart/`)
      .subscribe({
        next: (cart) => {
          this.cart = cart;
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در بارگذاری سبد خرید:', error);
          this.loading = false;
        }
      });
  }

  updateQuantity(itemId: number, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(itemId);
      return;
    }

    this.updating[itemId] = true;

    this.http.put(`${environment.apiUrl}/api/public/stores/${this.storeDomain}/cart/items/${itemId}/`, {
      quantity: newQuantity
    }).subscribe({
      next: (response: any) => {
        this.loadCart(); // Reload to get updated totals
        this.updating[itemId] = false;
      },
      error: (error) => {
        console.error('خطا در به‌روزرسانی سبد خرید:', error);
        alert('خطا در به‌روزرسانی سبد خرید');
        this.updating[itemId] = false;
      }
    });
  }

  removeItem(itemId: number): void {
    if (!confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      return;
    }

    this.updating[itemId] = true;

    this.http.delete(`${environment.apiUrl}/api/public/stores/${this.storeDomain}/cart/items/${itemId}/remove/`)
      .subscribe({
        next: (response: any) => {
          this.loadCart();
          this.updating[itemId] = false;
        },
        error: (error) => {
          console.error('خطا در حذف محصول:', error);
          alert('خطا در حذف محصول');
          this.updating[itemId] = false;
        }
      });
  }

  clearCart(): void {
    if (!confirm('آیا از خالی کردن کامل سبد خرید اطمینان دارید؟')) {
      return;
    }

    this.http.post(`${environment.apiUrl}/api/public/stores/${this.storeDomain}/cart/clear/`, {})
      .subscribe({
        next: (response: any) => {
          this.loadCart();
        },
        error: (error) => {
          console.error('خطا در خالی کردن سبد خرید:', error);
          alert('خطا در خالی کردن سبد خرید');
        }
      });
  }

  proceedToCheckout(): void {
    if (!this.cart || this.cart.items.length === 0) {
      alert('سبد خرید شما خالی است');
      return;
    }

    // Navigate to checkout page
    this.router.navigate(['/stores', this.storeDomain, 'checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/stores', this.storeDomain, 'products']);
  }

  formatPrice(price: string): string {
    return parseInt(price).toLocaleString('fa-IR') + ' تومان';
  }

  getImageUrl(item: CartItem): string {
    return item.product_instance.images.length > 0 
      ? item.product_instance.images[0] 
      : '/assets/placeholder-product.png';
  }

  isUpdating(itemId: number): boolean {
    return !!this.updating[itemId];
  }

  canIncreaseQuantity(item: CartItem): boolean {
    return item.quantity < item.product_instance.stock_quantity;
  }

  getMaxQuantity(item: CartItem): number {
    return item.product_instance.stock_quantity;
  }
}