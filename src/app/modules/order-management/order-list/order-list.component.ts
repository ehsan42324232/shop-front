import { Component } from '@angular/core';

@Component({
  selector: 'app-order-list',
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Order Management</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Orders</h2>
        <p class="text-gray-600">View and manage your store orders here.</p>
      </div>
    </div>
  `,
  styles: []
})
export class OrderListComponent { }