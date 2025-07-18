import { Component } from '@angular/core';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Product Management</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Products</h2>
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add Product
          </button>
        </div>
        <p class="text-gray-600">Manage your store products here.</p>
      </div>
    </div>
  `,
  styles: []
})
export class ProductListComponent { }