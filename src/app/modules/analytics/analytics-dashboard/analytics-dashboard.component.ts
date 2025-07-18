import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics-dashboard',
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Sales Overview</h3>
          <p class="text-gray-600">Track your sales performance.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Customer Insights</h3>
          <p class="text-gray-600">Understand your customers better.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Product Performance</h3>
          <p class="text-gray-600">Analyze product metrics.</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AnalyticsDashboardComponent { }