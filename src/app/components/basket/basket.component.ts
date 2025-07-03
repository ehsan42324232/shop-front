
import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-basket',
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">سبد خرید</h2>
      <div *ngFor="let item of basketItems" class="border-b py-2">
        <p>{{ item.product.title }} - {{ item.product.price }} تومان</p>
        <p class="text-sm text-gray-500">تعداد: {{ item.quantity }}</p>
      </div>
      <button class="mt-4 px-4 py-2 bg-green-600 text-white rounded" (click)="checkout()">پرداخت</button>
    </div>
  `
})
export class BasketComponent implements OnInit {
  basketItems: any[] = [];

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.basketService.getBasket().subscribe(data => {
      this.basketItems = data.items;
    });
  }

  checkout(): void {
    this.basketService.checkout().subscribe(response => {
      alert('پرداخت با موفقیت انجام شد');
    });
  }
}
