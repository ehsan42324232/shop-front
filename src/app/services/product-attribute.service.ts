import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  ProductAttribute, 
  CreateProductAttributeRequest, 
  UpdateProductAttributeRequest 
} from '../models/product-attribute.model';

@Injectable({
  providedIn: 'root'
})
export class ProductAttributeService {
  private apiUrl = `${environment.apiUrl}/product-attributes`;

  constructor(private http: HttpClient) {}

  getAttributes(storeId?: string): Observable<ProductAttribute[]> {
    let params = new HttpParams();
    if (storeId) {
      params = params.set('store', storeId);
    }
    return this.http.get<ProductAttribute[]>(this.apiUrl, { params });
  }

  getAttribute(id: string): Observable<ProductAttribute> {
    return this.http.get<ProductAttribute>(`${this.apiUrl}/${id}`);
  }

  createAttribute(attribute: CreateProductAttributeRequest): Observable<ProductAttribute> {
    return this.http.post<ProductAttribute>(this.apiUrl, attribute);
  }

  updateAttribute(id: string, attribute: UpdateProductAttributeRequest): Observable<ProductAttribute> {
    return this.http.put<ProductAttribute>(`${this.apiUrl}/${id}`, attribute);
  }

  deleteAttribute(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStoreAttributes(storeId: string): Observable<ProductAttribute[]> {
    return this.http.get<ProductAttribute[]>(`${environment.apiUrl}/stores/${storeId}/attributes`);
  }
}
