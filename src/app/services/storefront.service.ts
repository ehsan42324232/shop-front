import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { ProductAttribute } from '../models/product-attribute.model';
import { DomainService } from './domain.service';

export interface StorefrontProduct extends Product {
  // Additional storefront-specific fields
  in_stock: boolean;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface ProductSearchResult {
  results: StorefrontProduct[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ProductSearchParams {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  featured?: boolean;
  attributes?: { [key: string]: string };
  ordering?: string;
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorefrontService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private domainService: DomainService
  ) {
    this.apiUrl = this.domainService.getStoreApiUrl();
  }

  /**
   * Get store information
   */
  getStoreInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/storefront/info`);
  }

  /**
   * Get store categories
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/storefront/categories`);
  }

  /**
   * Get category tree
   */
  getCategoryTree(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/storefront/category_tree`);
  }

  /**
   * Search products with filters
   */
  searchProducts(params: ProductSearchParams = {}): Observable<ProductSearchResult> {
    let httpParams = new HttpParams();

    // Add search parameters
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.category) {
      httpParams = httpParams.set('category', params.category);
    }
    if (params.min_price !== undefined) {
      httpParams = httpParams.set('min_price', params.min_price.toString());
    }
    if (params.max_price !== undefined) {
      httpParams = httpParams.set('max_price', params.max_price.toString());
    }
    if (params.in_stock !== undefined) {
      httpParams = httpParams.set('in_stock', params.in_stock.toString());
    }
    if (params.featured !== undefined) {
      httpParams = httpParams.set('featured', params.featured.toString());
    }
    if (params.ordering) {
      httpParams = httpParams.set('ordering', params.ordering);
    }
    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.page_size) {
      httpParams = httpParams.set('page_size', params.page_size.toString());
    }

    // Add attribute filters
    if (params.attributes) {
      Object.keys(params.attributes).forEach(key => {
        if (params.attributes![key]) {
          httpParams = httpParams.set(`attr_${key}`, params.attributes![key]);
        }
      });
    }

    return this.http.get<ProductSearchResult>(`${this.apiUrl}/storefront/products`, { params: httpParams });
  }

  /**
   * Get product details
   */
  getProductDetails(id?: string, slug?: string): Observable<StorefrontProduct> {
    let httpParams = new HttpParams();
    
    if (id) {
      httpParams = httpParams.set('id', id);
    } else if (slug) {
      httpParams = httpParams.set('slug', slug);
    }

    return this.http.get<StorefrontProduct>(`${this.apiUrl}/storefront/product_detail`, { params: httpParams });
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(limit: number = 10): Observable<StorefrontProduct[]> {
    const httpParams = new HttpParams().set('limit', limit.toString());
    return this.http.get<StorefrontProduct[]>(`${this.apiUrl}/storefront/featured_products`, { params: httpParams });
  }

  /**
   * Get filterable attributes
   */
  getAttributes(): Observable<ProductAttribute[]> {
    return this.http.get<ProductAttribute[]>(`${this.apiUrl}/storefront/attributes`);
  }

  /**
   * Get search suggestions
   */
  getSearchSuggestions(query: string): Observable<string[]> {
    const httpParams = new HttpParams().set('q', query);
    return this.http.get<string[]>(`${this.apiUrl}/storefront/search_suggestions`, { params: httpParams });
  }

  /**
   * Get products by category
   */
  getProductsByCategory(categoryId: string, params: ProductSearchParams = {}): Observable<ProductSearchResult> {
    return this.searchProducts({ ...params, category: categoryId });
  }

  /**
   * Get products by attribute
   */
  getProductsByAttribute(attributeName: string, attributeValue: string, params: ProductSearchParams = {}): Observable<ProductSearchResult> {
    const attributes = { [attributeName]: attributeValue };
    return this.searchProducts({ ...params, attributes });
  }

  /**
   * Get products in price range
   */
  getProductsByPriceRange(minPrice: number, maxPrice: number, params: ProductSearchParams = {}): Observable<ProductSearchResult> {
    return this.searchProducts({ ...params, min_price: minPrice, max_price: maxPrice });
  }

  /**
   * Get new arrivals
   */
  getNewArrivals(limit: number = 10): Observable<StorefrontProduct[]> {
    return this.searchProducts({ 
      ordering: '-created_at', 
      page_size: limit 
    }).pipe(
      map(result => result.results)
    );
  }

  /**
   * Get best sellers (you would need to implement view counts or sales data)
   */
  getBestSellers(limit: number = 10): Observable<StorefrontProduct[]> {
    return this.searchProducts({ 
      ordering: '-created_at', // This would be '-sales_count' if you have sales data
      page_size: limit 
    }).pipe(
      map(result => result.results)
    );
  }

  /**
   * Get on sale products
   */
  getOnSaleProducts(limit: number = 10): Observable<StorefrontProduct[]> {
    return this.searchProducts({ 
      page_size: limit 
    }).pipe(
      map(result => result.results.filter(product => product.is_on_sale))
    );
  }

  /**
   * Get related products (products in same category)
   */
  getRelatedProducts(productId: string, categoryId: string, limit: number = 6): Observable<StorefrontProduct[]> {
    return this.searchProducts({ 
      category: categoryId, 
      page_size: limit + 1 // Get one extra to exclude current product
    }).pipe(
      map(result => result.results.filter(product => product.id !== productId).slice(0, limit))
    );
  }

  /**
   * Search products with autocomplete
   */
  searchWithAutocomplete(query: string): Observable<{
    products: StorefrontProduct[];
    suggestions: string[];
  }> {
    const productsRequest = this.searchProducts({ 
      search: query, 
      page_size: 5 
    });
    const suggestionsRequest = this.getSearchSuggestions(query);

    return combineLatest([productsRequest, suggestionsRequest]).pipe(
      map(([productsResult, suggestions]) => ({
        products: productsResult.results,
        suggestions
      }))
    );
  }
}

// Import map operator
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
