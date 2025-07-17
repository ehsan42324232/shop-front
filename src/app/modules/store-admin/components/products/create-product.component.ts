import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product.model';
import { ProductAttribute } from '../../../models/product-attribute.model';
import { ProductAttributeValue } from '../../../models/product-attribute-value.model';
import { Category } from '../../../models/category.model';
import { Store } from '../../../models/store.model';
import { ProductService } from '../../../services/product.service';
import { ProductAttributeService } from '../../../services/product-attribute.service';
import { CategoryService } from '../../../services/category.service';
import { StoreService } from '../../../services/store.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  product: Product | null = null;
  isEditing = false;
  loading = false;
  saving = false;
  
  store: Store | null = null;
  categories: Category[] = [];
  attributes: ProductAttribute[] = [];
  productAttributes: ProductAttributeValue[] = [];

  productForm = {
    title: '',
    description: '',
    short_description: '',
    price: 0,
    compare_price: null as number | null,
    sku: '',
    barcode: '',
    stock: 0,
    low_stock_threshold: 5,
    track_inventory: true,
    category: null as string | null,
    weight: null as number | null,
    dimensions: '',
    is_active: true,
    is_featured: false,
    is_digital: false,
    meta_title: '',
    meta_description: ''
  };

  attributeValues: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private attributeService: ProductAttributeService,
    private categoryService: CategoryService,
    private storeService: StoreService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadStore();
    this.loadCategories();
    this.loadAttributes();
    
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.isEditing = true;
      this.loadProduct(productId);
    }
  }

  loadStore() {
    this.storeService.getUserStores().subscribe({
      next: (stores) => {
        this.store = stores.length > 0 ? stores[0] : null;
      },
      error: (error) => {
        console.error('Error loading store:', error);
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadAttributes() {
    this.attributeService.getAttributes().subscribe({
      next: (attributes) => {
        this.attributes = attributes.sort((a, b) => a.sort_order - b.sort_order);
      },
      error: (error) => {
        console.error('Error loading attributes:', error);
      }
    });
  }

  loadProduct(id: string) {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.populateForm();
        this.loadProductAttributes();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
        this.toastr.error('Failed to load product');
      }
    });
  }

  populateForm() {
    if (this.product) {
      this.productForm = {
        title: this.product.title,
        description: this.product.description || '',
        short_description: this.product.short_description || '',
        price: this.product.price,
        compare_price: this.product.compare_price,
        sku: this.product.sku || '',
        barcode: this.product.barcode || '',
        stock: this.product.stock,
        low_stock_threshold: this.product.low_stock_threshold || 5,
        track_inventory: this.product.track_inventory,
        category: this.product.category || null,
        weight: this.product.weight,
        dimensions: this.product.dimensions || '',
        is_active: this.product.is_active,
        is_featured: this.product.is_featured,
        is_digital: this.product.is_digital,
        meta_title: this.product.meta_title || '',
        meta_description: this.product.meta_description || ''
      };
    }
  }

  loadProductAttributes() {
    if (this.product && this.product.attributes) {
      this.productAttributes = this.product.attributes;
      this.attributeValues = {};
      
      this.productAttributes.forEach(attr => {
        this.attributeValues[attr.attribute] = attr.value;
      });
    }
  }

  saveProduct() {
    if (!this.productForm.title.trim()) {
      this.toastr.error('Product title is required');
      return;
    }

    if (this.productForm.price <= 0) {
      this.toastr.error('Product price must be greater than 0');
      return;
    }

    this.saving = true;
    
    const productData = {
      ...this.productForm,
      store: this.store?.id
    };

    const operation = this.isEditing 
      ? this.productService.updateProduct(this.product!.id, productData)
      : this.productService.createProduct(productData);

    operation.subscribe({
      next: (savedProduct) => {
        this.product = savedProduct;
        this.saveProductAttributes();
      },
      error: (error) => {
        console.error('Error saving product:', error);
        this.saving = false;
        this.toastr.error('Failed to save product');
      }
    });
  }

  saveProductAttributes() {
    if (!this.product) {
      this.saving = false;
      return;
    }

    const attributesData = Object.entries(this.attributeValues)
      .filter(([_, value]) => value && value.trim())
      .map(([attributeId, value]) => ({
        attribute_id: attributeId,
        value: value.trim()
      }));

    if (attributesData.length === 0) {
      this.saving = false;
      this.toastr.success(this.isEditing ? 'Product updated successfully' : 'Product created successfully');
      this.router.navigate(['/store-admin/products']);
      return;
    }

    this.productService.setProductAttributes(this.product.id, attributesData).subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success(this.isEditing ? 'Product updated successfully' : 'Product created successfully');
        this.router.navigate(['/store-admin/products']);
      },
      error: (error) => {
        console.error('Error saving product attributes:', error);
        this.saving = false;
        this.toastr.error('Product saved but failed to save attributes');
      }
    });
  }

  getAttributeChoices(attribute: ProductAttribute): string[] {
    return attribute.choices || [];
  }

  isAttributeRequired(attribute: ProductAttribute): boolean {
    return attribute.is_required;
  }

  getAttributeInputType(attribute: ProductAttribute): string {
    switch (attribute.attribute_type) {
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      case 'color':
        return 'color';
      default:
        return 'text';
    }
  }

  onAttributeValueChange(attributeId: string, value: string) {
    this.attributeValues[attributeId] = value;
  }

  cancel() {
    this.router.navigate(['/store-admin/products']);
  }

  getCategoryName(categoryId: string | null): string {
    if (!categoryId) return 'None';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }
}
