import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface ProductAttribute {
  id: number;
  name: string;
  type: string;
  is_required: boolean;
  choices: string[];
  unit?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category?: string;
  base_price?: string;
  images: string[];
  videos: string[];
}

interface AttributeValue {
  attribute_id: number;
  value: any;
}

@Component({
  selector: 'app-product-instance-form',
  templateUrl: './product-instance-form.component.html',
  styleUrls: ['./product-instance-form.component.css']
})
export class ProductInstanceFormComponent implements OnInit {
  @Input() productId!: number;
  @Input() storeId!: number;
  @Input() editMode = false;
  @Input() instanceData: any = null;
  @Output() onSaved = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  product: Product | null = null;
  attributes: ProductAttribute[] = [];
  loading = true;
  saving = false;
  error: string | null = null;

  // Form data
  formData = {
    price: '',
    compare_price: '',
    cost_price: '',
    stock_quantity: 0,
    low_stock_threshold: 1,
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    is_active: true,
    is_default: false,
    create_another: false,
    attributes: [] as AttributeValue[]
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProductData();
    if (this.editMode && this.instanceData) {
      this.populateFormData();
    }
  }

  loadProductData(): void {
    this.http.get(`${environment.apiUrl}/api/products/${this.productId}/for-instances/`)
      .subscribe({
        next: (response: any) => {
          this.product = response.product;
          this.attributes = response.attributes;
          this.initializeAttributeValues();
          this.loading = false;
          
          // Set base price if available
          if (this.product?.base_price && !this.editMode) {
            this.formData.price = this.product.base_price;
          }
        },
        error: (error) => {
          console.error('خطا در بارگذاری اطلاعات محصول:', error);
          this.error = 'خطا در بارگذاری اطلاعات محصول';
          this.loading = false;
        }
      });
  }

  initializeAttributeValues(): void {
    this.formData.attributes = this.attributes.map(attr => ({
      attribute_id: attr.id,
      value: this.getDefaultAttributeValue(attr)
    }));
  }

  getDefaultAttributeValue(attr: ProductAttribute): any {
    switch (attr.type) {
      case 'boolean':
        return false;
      case 'number':
        return 0;
      case 'choice':
        return attr.choices.length > 0 ? attr.choices[0] : '';
      case 'color':
        return '#000000';
      default:
        return '';
    }
  }

  populateFormData(): void {
    if (!this.instanceData) return;

    this.formData = {
      price: this.instanceData.price,
      compare_price: this.instanceData.compare_price || '',
      cost_price: this.instanceData.cost_price || '',
      stock_quantity: this.instanceData.stock_quantity,
      low_stock_threshold: this.instanceData.low_stock_threshold,
      weight: this.instanceData.weight || '',
      dimensions: this.instanceData.dimensions || { length: '', width: '', height: '' },
      is_active: this.instanceData.is_active,
      is_default: this.instanceData.is_default,
      create_another: false,
      attributes: this.instanceData.attributes?.map((attr: any) => ({
        attribute_id: attr.attribute.id,
        value: attr.value
      })) || []
    };
  }

  getAttributeValue(attributeId: number): any {
    const attr = this.formData.attributes.find(a => a.attribute_id === attributeId);
    return attr ? attr.value : '';
  }

  setAttributeValue(attributeId: number, value: any): void {
    const attrIndex = this.formData.attributes.findIndex(a => a.attribute_id === attributeId);
    if (attrIndex >= 0) {
      this.formData.attributes[attrIndex].value = value;
    } else {
      this.formData.attributes.push({ attribute_id: attributeId, value });
    }
  }

  onSubmit(): void {
    if (this.saving) return;

    // Validate required fields
    if (!this.formData.price) {
      alert('قیمت محصول الزامی است');
      return;
    }

    // Validate required attributes
    for (const attr of this.attributes) {
      if (attr.is_required) {
        const value = this.getAttributeValue(attr.id);
        if (!value && value !== 0 && value !== false) {
          alert(`${attr.name} الزامی است`);
          return;
        }
      }
    }

    this.saving = true;

    const payload = {
      ...this.formData,
      product_id: this.productId
    };

    const request = this.editMode
      ? this.http.put(`${environment.apiUrl}/api/product-instances/${this.instanceData.id}/`, payload)
      : this.http.post(`${environment.apiUrl}/api/product-instances/`, payload);

    request.subscribe({
      next: (response: any) => {
        this.saving = false;
        this.onSaved.emit(response);
        
        // If create another is checked, reset form but keep some values
        if (this.formData.create_another && !this.editMode) {
          this.resetFormForAnother();
        }
      },
      error: (error) => {
        console.error('خطا در ذخیره نمونه محصول:', error);
        alert('خطا در ذخیره نمونه محصول. لطفاً دوباره تلاش کنید.');
        this.saving = false;
      }
    });
  }

  resetFormForAnother(): void {
    // Keep price and some basic info, reset attributes to allow new combinations
    const currentPrice = this.formData.price;
    const currentComparePrice = this.formData.compare_price;
    const currentCostPrice = this.formData.cost_price;
    
    this.initializeAttributeValues();
    
    this.formData.price = currentPrice;
    this.formData.compare_price = currentComparePrice;
    this.formData.cost_price = currentCostPrice;
    this.formData.stock_quantity = 0;
    this.formData.is_default = false;
  }

  onCancel(): void {
    this.onCancel.emit();
  }

  // Helper methods for different attribute types
  isColorAttribute(attr: ProductAttribute): boolean {
    return attr.type === 'color';
  }

  isChoiceAttribute(attr: ProductAttribute): boolean {
    return attr.type === 'choice';
  }

  isBooleanAttribute(attr: ProductAttribute): boolean {
    return attr.type === 'boolean';
  }

  isNumberAttribute(attr: ProductAttribute): boolean {
    return attr.type === 'number';
  }

  isTextAttribute(attr: ProductAttribute): boolean {
    return attr.type === 'text' || attr.type === 'description';
  }

  formatPrice(price: string): string {
    if (!price) return '';
    return parseInt(price).toLocaleString('fa-IR') + ' تومان';
  }

  calculateDiscount(): number {
    const price = parseFloat(this.formData.price);
    const comparePrice = parseFloat(this.formData.compare_price);
    
    if (comparePrice && price < comparePrice) {
      return Math.round(((comparePrice - price) / comparePrice) * 100);
    }
    
    return 0;
  }

  isOnSale(): boolean {
    return this.calculateDiscount() > 0;
  }
}