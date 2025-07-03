
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  template: `
    <div *ngIf="product" class="p-4">
      <img [src]="product.media?.[0]?.url" alt="{{ product.title }}" class="h-64 w-full object-cover rounded mb-4" />
      <h1 class="text-xl font-bold">{{ product.title }}</h1>
      <p class="text-sm text-gray-600 my-2">{{ product.description }}</p>
      <p class="font-semibold text-green-700">{{ product.price }} تومان</p>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: any;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe(data => {
      this.product = data;
    });
  }
}
