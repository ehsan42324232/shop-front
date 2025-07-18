import { Component } from '@angular/core';

@Component({
  selector: 'app-platform-admin-dashboard',
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Platform Administration</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">User Management</h3>
          <p class="text-gray-600">Manage platform users and permissions.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Store Oversight</h3>
          <p class="text-gray-600">Monitor and manage all stores on the platform.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">System Settings</h3>
          <p class="text-gray-600">Configure platform-wide settings.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Reports</h3>
          <p class="text-gray-600">View comprehensive platform reports.</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PlatformAdminDashboardComponent { }