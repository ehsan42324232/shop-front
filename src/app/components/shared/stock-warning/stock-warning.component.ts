import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stock-warning',
  template: `
    <div *ngIf="shouldShowWarning()" class="stock-warning-container">
      <!-- Low Stock Warning -->
      <div *ngIf="isLowStock() && !isLastItem()" class="stock-warning low-stock">
        <i class="fas fa-exclamation-triangle"></i>
        <span>کمبود موجودی! تنها {{ stockQuantity }} عدد باقی مانده</span>
      </div>
      
      <!-- Last Item Warning -->
      <div *ngIf="isLastItem()" class="stock-warning last-item">
        <i class="fas fa-fire text-red-500 animate-pulse"></i>
        <span class="font-bold text-red-600">آخرین موجودی! تنها ۱ عدد باقی مانده</span>
      </div>
      
      <!-- Out of Stock -->
      <div *ngIf="isOutOfStock()" class="stock-warning out-of-stock">
        <i class="fas fa-times-circle"></i>
        <span>اتمام موجودی</span>
      </div>
      
      <!-- High Demand Indicator -->
      <div *ngIf="isHighDemand()" class="stock-warning high-demand">
        <i class="fas fa-trending-up"></i>
        <span>محصول پرطرفدار - {{ recentOrderCount }} نفر اخیراً خریداری کرده‌اند</span>
      </div>
    </div>
  `,
  styles: [`
    .stock-warning-container {
      margin: 12px 0;
    }
    
    .stock-warning {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      margin-bottom: 6px;
      font-weight: 500;
    }
    
    .low-stock {
      background-color: #fef3c7;
      color: #92400e;
      border: 1px solid #fcd34d;
    }
    
    .last-item {
      background-color: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
      animation: pulse-border 2s infinite;
    }
    
    .out-of-stock {
      background-color: #f3f4f6;
      color: #6b7280;
      border: 1px solid #d1d5db;
    }
    
    .high-demand {
      background-color: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    
    @keyframes pulse-border {
      0%, 100% {
        border-color: #fca5a5;
      }
      50% {
        border-color: #ef4444;
      }
    }
    
    .fas {
      font-size: 16px;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
  `]
})
export class StockWarningComponent {
  @Input() stockQuantity: number = 0;
  @Input() lowStockThreshold: number = 5;
  @Input() trackInventory: boolean = true;
  @Input() allowBackorders: boolean = false;
  @Input() recentOrderCount: number = 0;
  @Input() isPopular: boolean = false;
  
  shouldShowWarning(): boolean {
    return this.trackInventory && (
      this.isOutOfStock() || 
      this.isLowStock() || 
      this.isLastItem() ||
      this.isHighDemand()
    );
  }
  
  isOutOfStock(): boolean {
    return this.stockQuantity <= 0 && !this.allowBackorders;
  }
  
  isLowStock(): boolean {
    return this.stockQuantity > 0 && this.stockQuantity <= this.lowStockThreshold;
  }
  
  isLastItem(): boolean {
    return this.stockQuantity === 1;
  }
  
  isHighDemand(): boolean {
    return this.isPopular && this.recentOrderCount > 10 && this.stockQuantity > 0;
  }
  
  getStockStatusClass(): string {
    if (this.isOutOfStock()) return 'out-of-stock';
    if (this.isLastItem()) return 'last-item';
    if (this.isLowStock()) return 'low-stock';
    if (this.isHighDemand()) return 'high-demand';
    return 'in-stock';
  }
  
  getUrgencyLevel(): 'low' | 'medium' | 'high' | 'critical' {
    if (this.isOutOfStock()) return 'critical';
    if (this.isLastItem()) return 'critical';
    if (this.stockQuantity <= 2) return 'high';
    if (this.isLowStock()) return 'medium';
    return 'low';
  }
}
