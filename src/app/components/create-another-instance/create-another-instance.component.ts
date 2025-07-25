import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ProductInstanceData {
  [key: string]: any;
  price: number;
  stock: number;
  sku?: string;
  description?: string;
  images?: string[];
  attributes?: { [key: string]: any };
}

@Component({
  selector: 'app-create-another-instance',
  template: `
    <div class="create-another-container" *ngIf="showCreateAnother">
      <!-- Success Message -->
      <div class="success-notification" *ngIf="lastCreatedInstance">
        <div class="success-content">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="success-message">
            <h4>محصول با موفقیت ایجاد شد!</h4>
            <p>{{lastCreatedInstance.name || 'محصول جدید'}} به فهرست محصولات اضافه شد.</p>
          </div>
        </div>
      </div>

      <!-- Create Another Prompt -->
      <div class="create-prompt">
        <div class="prompt-content">
          <div class="prompt-icon">
            <i class="fas fa-plus-circle"></i>
          </div>
          <div class="prompt-text">
            <h3>ایجاد محصول مشابه</h3>
            <p>
              آیا می‌خواهید محصول دیگری با همین مشخصات ایجاد کنید؟
              <br>
              <small class="text-gray-500">
                تمام اطلاعات فرم قبلی حفظ خواهد شد و فقط نیاز است تغییرات لازم را اعمال کنید.
              </small>
            </p>
          </div>
        </div>

        <!-- Quick Edit Options -->
        <div class="quick-edit-options" *ngIf="showQuickEdit">
          <h4 class="section-title">تغییرات سریع:</h4>
          <div class="quick-options-grid">
            <!-- Price Adjustment -->
            <div class="quick-option">
              <label class="option-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="quickOptions.adjustPrice"
                  class="option-checkbox">
                <span>تغییر قیمت</span>
              </label>
              <div class="option-input" *ngIf="quickOptions.adjustPrice">
                <input 
                  type="number" 
                  [(ngModel)]="quickOptions.newPrice"
                  [placeholder]="lastInstanceData?.price?.toString() || '0'"
                  class="price-input">
                <span class="currency">تومان</span>
              </div>
            </div>

            <!-- Stock Adjustment -->
            <div class="quick-option">
              <label class="option-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="quickOptions.adjustStock"
                  class="option-checkbox">
                <span>تغییر موجودی</span>
              </label>
              <div class="option-input" *ngIf="quickOptions.adjustStock">
                <input 
                  type="number" 
                  [(ngModel)]="quickOptions.newStock"
                  [placeholder]="lastInstanceData?.stock?.toString() || '0'"
                  class="stock-input">
                <span class="unit">عدد</span>
              </div>
            </div>

            <!-- SKU Change -->
            <div class="quick-option">
              <label class="option-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="quickOptions.changeSku"
                  class="option-checkbox">
                <span>تغییر کد محصول</span>
              </label>
              <div class="option-input" *ngIf="quickOptions.changeSku">
                <input 
                  type="text" 
                  [(ngModel)]="quickOptions.newSku"
                  [placeholder]="lastInstanceData?.sku || 'کد محصول'"
                  class="sku-input">
                <button 
                  type="button" 
                  class="generate-sku-btn"
                  (click)="generateNewSku()"
                  title="تولید کد خودکار">
                  <i class="fas fa-magic"></i>
                </button>
              </div>
            </div>

            <!-- Attribute Changes -->
            <div class="quick-option full-width" *ngIf="availableAttributes.length > 0">
              <label class="option-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="quickOptions.changeAttributes"
                  class="option-checkbox">
                <span>تغییر ویژگی‌ها</span>
              </label>
              <div class="option-input attributes-section" *ngIf="quickOptions.changeAttributes">
                <div class="attribute-item" *ngFor="let attr of availableAttributes">
                  <label class="attr-label">{{attr.display_name}}</label>
                  <div class="attr-input" [ngSwitch]="attr.type">
                    <!-- Color Attribute -->
                    <div *ngSwitchCase="'color'" class="color-attribute">
                      <div class="color-options">
                        <div 
                          *ngFor="let color of attr.options" 
                          class="color-option"
                          [class.selected]="quickOptions.newAttributes[attr.name] === color.value"
                          [style.background-color]="color.hex"
                          [title]="color.name"
                          (click)="selectAttributeValue(attr.name, color.value)">
                          <i class="fas fa-check" *ngIf="quickOptions.newAttributes[attr.name] === color.value"></i>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Select Attribute -->
                    <select 
                      *ngSwitchCase="'select'"
                      [(ngModel)]="quickOptions.newAttributes[attr.name]"
                      class="attr-select">
                      <option value="">انتخاب کنید</option>
                      <option *ngFor="let option of attr.options" [value]="option.value">
                        {{option.label}}
                      </option>
                    </select>
                    
                    <!-- Text Attribute -->
                    <input 
                      *ngSwitchDefault
                      type="text"
                      [(ngModel)]="quickOptions.newAttributes[attr.name]"
                      [placeholder]="attr.display_name"
                      class="attr-input-text">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button 
            type="button"
            class="btn btn-secondary"
            (click)="onDecline()">
            <i class="fas fa-times ml-2"></i>
            خیر، متشکرم
          </button>
          
          <button 
            type="button"
            class="btn btn-outline"
            (click)="onCreateWithSameData()">
            <i class="fas fa-copy ml-2"></i>
            ایجاد با همین اطلاعات
          </button>
          
          <button 
            type="button"
            class="btn btn-primary"
            (click)="onCreateWithChanges()"
            [disabled]="!hasQuickChanges()">
            <i class="fas fa-magic ml-2"></i>
            ایجاد با تغییرات
          </button>
        </div>
      </div>

      <!-- Bulk Creation Helper -->
      <div class="bulk-helper" *ngIf="showBulkHelper">
        <div class="bulk-content">
          <div class="bulk-icon">
            <i class="fas fa-layer-group"></i>
          </div>
          <div class="bulk-text">
            <h4>ایجاد انبوه محصولات</h4>
            <p>برای ایجاد چندین محصول با ویژگی‌های مختلف، از گزینه ایجاد انبوه استفاده کنید.</p>
          </div>
          <button 
            type="button"
            class="btn btn-info"
            (click)="onOpenBulkCreation()">
            <i class="fas fa-layer-group ml-2"></i>
            ایجاد انبوه محصولات
          </button>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="tips-section" *ngIf="showTips">
        <div class="tips-content">
          <h5>💡 نکات مفید:</h5>
          <ul class="tips-list">
            <li>برای ایجاد محصولات با رنگ‌های مختلف، از تغییرات سریع استفاده کنید</li>
            <li>کد محصول (SKU) باید برای هر محصول منحصر به فرد باشد</li>
            <li>می‌توانید چندین بار از این قابلیت استفاده کنید</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./create-another-instance.component.scss']
})
export class CreateAnotherInstanceComponent {
  @Input() showCreateAnother: boolean = false;
  @Input() lastCreatedInstance: any = null;
  @Input() lastInstanceData: ProductInstanceData | null = null;
  @Input() availableAttributes: any[] = [];
  @Input() showQuickEdit: boolean = true;
  @Input() showBulkHelper: boolean = true;
  @Input() showTips: boolean = true;
  
  @Output() createAnother = new EventEmitter<ProductInstanceData>();
  @Output() createWithChanges = new EventEmitter<ProductInstanceData>();
  @Output() declined = new EventEmitter<void>();
  @Output() openBulkCreation = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  quickOptions = {
    adjustPrice: false,
    adjustStock: false,
    changeSku: false,
    changeAttributes: false,
    newPrice: 0,
    newStock: 0,
    newSku: '',
    newAttributes: {} as { [key: string]: any }
  };

  /**
   * Handle decline action
   */
  onDecline(): void {
    this.resetQuickOptions();
    this.declined.emit();
    this.closed.emit();
  }

  /**
   * Create another instance with the same data
   */
  onCreateWithSameData(): void {
    if (this.lastInstanceData) {
      // Generate new SKU automatically to avoid duplicates
      const newData = { ...this.lastInstanceData };
      if (newData.sku) {
        newData.sku = this.generateNewSku();
      }
      this.createAnother.emit(newData);
    }
    this.resetQuickOptions();
  }

  /**
   * Create instance with quick changes applied
   */
  onCreateWithChanges(): void {
    if (!this.lastInstanceData) return;

    const newData: ProductInstanceData = { ...this.lastInstanceData };

    // Apply quick changes
    if (this.quickOptions.adjustPrice && this.quickOptions.newPrice > 0) {
      newData.price = this.quickOptions.newPrice;
    }

    if (this.quickOptions.adjustStock && this.quickOptions.newStock >= 0) {
      newData.stock = this.quickOptions.newStock;
    }

    if (this.quickOptions.changeSku && this.quickOptions.newSku.trim()) {
      newData.sku = this.quickOptions.newSku.trim();
    } else if (newData.sku) {
      // Auto-generate new SKU to avoid duplicates
      newData.sku = this.generateNewSku();
    }

    if (this.quickOptions.changeAttributes) {
      newData.attributes = {
        ...newData.attributes,
        ...this.quickOptions.newAttributes
      };
    }

    this.createWithChanges.emit(newData);
    this.resetQuickOptions();
  }

  /**
   * Open bulk creation mode
   */
  onOpenBulkCreation(): void {
    this.openBulkCreation.emit();
    this.closed.emit();
  }

  /**
   * Select attribute value
   */
  selectAttributeValue(attrName: string, value: any): void {
    this.quickOptions.newAttributes[attrName] = value;
  }

  /**
   * Generate new SKU automatically
   */
  generateNewSku(): void {
    this.quickOptions.newSku = this.generateSuggestedSku();
  }

  /**
   * Check if there are any quick changes
   */
  hasQuickChanges(): boolean {
    return (
      (this.quickOptions.adjustPrice && this.quickOptions.newPrice > 0) ||
      (this.quickOptions.adjustStock && this.quickOptions.newStock >= 0) ||
      (this.quickOptions.changeSku && this.quickOptions.newSku.trim().length > 0) ||
      (this.quickOptions.changeAttributes && Object.keys(this.quickOptions.newAttributes).length > 0)
    );
  }

  /**
   * Reset quick options to default state
   */
  private resetQuickOptions(): void {
    this.quickOptions = {
      adjustPrice: false,
      adjustStock: false,
      changeSku: false,
      changeAttributes: false,
      newPrice: 0,
      newStock: 0,
      newSku: '',
      newAttributes: {}
    };
  }

  /**
   * Generate suggested SKU based on current data
   */
  private generateSuggestedSku(): string {
    if (!this.lastInstanceData) return '';
    
    const baseSku = this.lastInstanceData.sku || 'PROD';
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    
    return `${baseSku}-${timestamp}${random}`;
  }

  /**
   * Get attribute display value
   */
  getAttributeDisplayValue(attrName: string): string {
    if (!this.lastInstanceData?.attributes) return '';
    
    const value = this.lastInstanceData.attributes[attrName];
    if (typeof value === 'object' && value?.name) {
      return value.name;
    }
    return value?.toString() || '';
  }

  /**
   * Get current attribute count for display
   */
  getAttributeChangeCount(): number {
    return Object.keys(this.quickOptions.newAttributes).filter(key => 
      this.quickOptions.newAttributes[key] !== undefined && 
      this.quickOptions.newAttributes[key] !== ''
    ).length;
  }

  /**
   * Calculate estimated time savings
   */
  getTimeSavingsMessage(): string {
    const changesCount = this.getQuickChangesCount();
    if (changesCount === 0) {
      return 'صرفه‌جویی در وقت: حدود 5 دقیقه';
    } else {
      return `صرفه‌جویی در وقت: حدود ${3 + changesCount} دقیقه`;
    }
  }

  /**
   * Get count of active quick changes
   */
  private getQuickChangesCount(): number {
    let count = 0;
    if (this.quickOptions.adjustPrice) count++;
    if (this.quickOptions.adjustStock) count++;
    if (this.quickOptions.changeSku) count++;
    if (this.quickOptions.changeAttributes) count++;
    return count;
  }
}
