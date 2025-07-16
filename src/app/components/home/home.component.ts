import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center mb-8">Welcome to ShopPlatform</h1>
      <div class="text-center">
        <p class="text-xl text-gray-600 mb-6">Your one-stop shop for everything!</p>
        <div class="space-x-4">
          <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Browse Products
          </button>
          <button class="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">
            Learn More
          </button>
        </div>
      </div>
      
      <!-- Debug Info -->
      <div class="mt-12 p-4 bg-gray-100 rounded">
        <h3 class="font-bold mb-2">Debug Information:</h3>
        <p>✅ Angular app is running correctly</p>
        <p>✅ Header component is loaded</p>
        <p>✅ Routing is working</p>
        <p>✅ This home component is loading</p>
      </div>
    </div>
  `
})
export class HomeComponent {
  constructor() {}
}
