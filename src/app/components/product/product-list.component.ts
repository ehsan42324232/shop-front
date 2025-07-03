
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="grid grid-cols-2 gap-4 p-4">
      <div *ngFor="let product of products" class="border rounded-lg p-4 shadow">
        <img [src]="product.media?.[0]?.url" alt="{{ product.title }}" class="h-48 object-cover w-full mb-2" />
        <h2 class="text-lg font-semibold">{{ product.title }}</h2>
        <p class="text-sm text-gray-500">{{ product.description }}</p>
        <p class="mt-2 font-bold text-green-700">{{ product.price }} تومان</p>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }
}
