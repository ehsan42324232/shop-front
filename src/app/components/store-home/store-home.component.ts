import { Component, OnInit } from '@angular/core';
import { StorefrontService, StorefrontProduct } from '../../services/storefront.service';
import { DomainService, StoreConfig } from '../../services/domain.service';
import { Category } from '../../models/category.model';
import { ProductAttribute } from '../../models/product-attribute.model';

@Component({
  selector: 'app-store-home',
  templateUrl: './store-home.component.html',
  styleUrls: ['./store-home.component.css']
})
export class StoreHomeComponent implements OnInit {
  storeConfig: StoreConfig | null = null;
  featuredProducts: StorefrontProduct[] = [];
  newArrivals: StorefrontProduct[] = [];
  categories: Category[] = [];
  attributes: ProductAttribute[] = [];
  loading = true;
  error: string | null = null;

  // Hero section
  heroTitle = '';
  heroSubtitle = '';
  heroImage = '';
  showHero = true;

  // Feature flags
  showFeaturedProducts = true;
  showNewArrivals = true;
  showCategories = true;
  showAttributes = false;

  constructor(
    private storefrontService: StorefrontService,
    private domainService: DomainService
  ) {}

  ngOnInit() {
    this.loadStoreData();
  }

  loadStoreData() {
    this.loading = true;
    this.storeConfig = this.domainService.getCurrentStoreConfig();
    
    if (this.storeConfig) {
      this.setupStoreContent();
      this.loadStoreContent();
    } else {
      this.error = 'Store configuration not found';
      this.loading = false;
    }
  }

  setupStoreContent() {
    if (!this.storeConfig) return;

    // Set up hero section
    this.heroTitle = this.storeConfig.store.name;
    this.heroSubtitle = this.storeConfig.store.description || 'Welcome to our store';
    this.heroImage = this.storeConfig.store.logo || '/assets/default-hero.jpg';

    // Configure features based on store settings
    this.showFeaturedProducts = this.storeConfig.features.featured_products_enabled;
    this.showCategories = this.storeConfig.features.categories_enabled;
    this.showAttributes = this.storeConfig.features.attributes_enabled;
  }

  loadStoreContent() {
    const promises: Promise<any>[] = [];

    // Load featured products
    if (this.showFeaturedProducts) {
      promises.push(
        this.storefrontService.getFeaturedProducts(8).toPromise()
          .then(products => {
            this.featuredProducts = products || [];
          })
          .catch(error => {
            console.error('Error loading featured products:', error);
            this.featuredProducts = [];
          })
      );
    }

    // Load new arrivals
    if (this.showNewArrivals) {
      promises.push(
        this.storefrontService.getNewArrivals(8).toPromise()
          .then(products => {
            this.newArrivals = products || [];
          })
          .catch(error => {
            console.error('Error loading new arrivals:', error);
            this.newArrivals = [];
          })
      );
    }

    // Load categories
    if (this.showCategories) {
      promises.push(
        this.storefrontService.getCategories().toPromise()
          .then(categories => {
            this.categories = categories || [];
          })
          .catch(error => {
            console.error('Error loading categories:', error);
            this.categories = [];
          })
      );
    }

    // Load attributes for filtering
    if (this.showAttributes) {
      promises.push(
        this.storefrontService.getAttributes().toPromise()
          .then(attributes => {
            this.attributes = attributes || [];
          })
          .catch(error => {
            console.error('Error loading attributes:', error);
            this.attributes = [];
          })
      );
    }

    // Wait for all data to load
    Promise.all(promises).finally(() => {
      this.loading = false;
    });
  }

  onCategoryClick(category: Category) {
    // Navigate to category page
    window.location.href = `/category/${category.slug}`;
  }

  onProductClick(product: StorefrontProduct) {
    // Navigate to product page
    window.location.href = `/product/${product.slug}`;
  }

  onSearchSubmit(searchTerm: string) {
    // Navigate to search results
    window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
  }

  addToCart(product: StorefrontProduct) {
    // Add product to cart
    console.log('Adding to cart:', product);
    // You would implement the actual cart functionality here
  }

  getProductImageUrl(product: StorefrontProduct): string {
    return product.primary_image?.image || '/assets/default-product.jpg';
  }

  getCategoryImageUrl(category: Category): string {
    return category.image || '/assets/default-category.jpg';
  }

  formatPrice(price: number): string {
    const currency = this.storeConfig?.store.currency || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  getStoreContactInfo(): string {
    if (!this.storeConfig) return '';
    
    const parts = [];
    if (this.storeConfig.store.email) parts.push(this.storeConfig.store.email);
    if (this.storeConfig.store.phone) parts.push(this.storeConfig.store.phone);
    
    return parts.join(' | ');
  }

  getStoreAddress(): string {
    return this.storeConfig?.store.address || '';
  }

  isProductOnSale(product: StorefrontProduct): boolean {
    return product.is_on_sale || false;
  }

  getDiscountPercentage(product: StorefrontProduct): number {
    return product.discount_percentage || 0;
  }

  isOutOfStock(product: StorefrontProduct): boolean {
    return product.stock_status === 'out_of_stock';
  }

  isLowStock(product: StorefrontProduct): boolean {
    return product.stock_status === 'low_stock';
  }
}
