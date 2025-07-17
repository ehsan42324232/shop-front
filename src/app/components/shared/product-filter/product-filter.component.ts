import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProductAttribute } from '../../models/product-attribute.model';
import { Category } from '../../models/category.model';
import { ProductAttributeService } from '../../services/product-attribute.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit {
  @Input() storeId: string | null = null;
  @Output() filterChange = new EventEmitter<any>();

  categories: Category[] = [];
  attributes: ProductAttribute[] = [];
  
  filters = {
    category: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    inStock: null as boolean | null,
    search: '',
    attributes: {} as { [key: string]: string }
  };

  showFilters = false;
  priceRange = { min: 0, max: 1000 };

  constructor(
    private attributeService: ProductAttributeService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadAttributes();
  }

  loadCategories() {
    this.categoryService.getCategories(this.storeId).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadAttributes() {
    this.attributeService.getAttributes(this.storeId).subscribe({
      next: (attributes) => {
        this.attributes = attributes.filter(attr => attr.is_filterable);
      },
      error: (error) => {
        console.error('Error loading attributes:', error);
      }
    });
  }

  onFilterChange() {
    this.filterChange.emit(this.filters);
  }

  onCategoryChange(event: any) {
    this.filters.category = event.target.value;
    this.onFilterChange();
  }

  onPriceChange() {
    this.onFilterChange();
  }

  onStockChange(event: any) {
    const value = event.target.value;
    this.filters.inStock = value === 'true' ? true : value === 'false' ? false : null;
    this.onFilterChange();
  }

  onSearchChange(event: any) {
    this.filters.search = event.target.value;
    this.onFilterChange();
  }

  onAttributeChange(attributeId: string, value: string) {
    if (value) {
      this.filters.attributes[attributeId] = value;
    } else {
      delete this.filters.attributes[attributeId];
    }
    this.onFilterChange();
  }

  clearFilters() {
    this.filters = {
      category: '',
      minPrice: null,
      maxPrice: null,
      inStock: null,
      search: '',
      attributes: {}
    };
    this.onFilterChange();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  getAttributeChoices(attribute: ProductAttribute): string[] {
    return attribute.choices || [];
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filters.category ||
      this.filters.minPrice !== null ||
      this.filters.maxPrice !== null ||
      this.filters.inStock !== null ||
      this.filters.search ||
      Object.keys(this.filters.attributes).length > 0
    );
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.filters.category) count++;
    if (this.filters.minPrice !== null) count++;
    if (this.filters.maxPrice !== null) count++;
    if (this.filters.inStock !== null) count++;
    if (this.filters.search) count++;
    count += Object.keys(this.filters.attributes).length;
    return count;
  }
}
