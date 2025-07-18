import { Component } from '@angular/core';

@Component({
  selector: 'app-store-dashboard',
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Store Management Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Store Overview</h2>
          <p>Manage your store settings and information.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Quick Stats</h2>
          <p>View your store performance metrics.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
          <p>Track recent store activities.</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class StoreDashboardComponent { }