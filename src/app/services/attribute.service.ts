import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AttributeDefinition, AttributeType, AttributeOption } from '../models/product.models';

@Injectable({ providedIn: 'root' })
export class AttributeService {
  private apiUrl = '/api/attributes/';
  private attributesSubject = new BehaviorSubject<AttributeDefinition[]>([]);
  public attributes$ = this.attributesSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('X-Store-Domain', window.location.hostname);
  }

  // Get all attribute definitions for current store
  getAttributes(): Observable<AttributeDefinition[]> {
    const headers = this.getHeaders();
    return this.http.get<AttributeDefinition[]>(this.apiUrl, { headers });
  }

  // Get single attribute definition
  getAttribute(id: number): Observable<AttributeDefinition> {
    const headers = this.getHeaders();
    return this.http.get<AttributeDefinition>(`${this.apiUrl}${id}/`, { headers });
  }

  // Create attribute definition
  createAttribute(attributeData: CreateAttributeRequest): Observable<AttributeDefinition> {
    const headers = this.getHeaders();
    return this.http.post<AttributeDefinition>(this.apiUrl, attributeData, { headers });
  }

  // Update attribute definition
  updateAttribute(id: number, attributeData: Partial<CreateAttributeRequest>): Observable<AttributeDefinition> {
    const headers = this.getHeaders();
    return this.http.put<AttributeDefinition>(`${this.apiUrl}${id}/`, attributeData, { headers });
  }

  // Delete attribute definition
  deleteAttribute(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}${id}/`, { headers });
  }

  // Get attributes by type
  getAttributesByType(type: AttributeType): Observable<AttributeDefinition[]> {
    const headers = this.getHeaders();
    return this.http.get<AttributeDefinition[]>(`${this.apiUrl}by-type/${type}/`, { headers });
  }

  // Get filterable attributes
  getFilterableAttributes(): Observable<AttributeDefinition[]> {
    const headers = this.getHeaders();
    return this.http.get<AttributeDefinition[]>(`${this.apiUrl}filterable/`, { headers });
  }

  // Get searchable attributes
  getSearchableAttributes(): Observable<AttributeDefinition[]> {
    const headers = this.getHeaders();
    return this.http.get<AttributeDefinition[]>(`${this.apiUrl}searchable/`, { headers });
  }

  // Attribute options management
  addAttributeOption(attributeId: number, option: CreateAttributeOptionRequest): Observable<AttributeOption> {
    const headers = this.getHeaders();
    return this.http.post<AttributeOption>(`${this.apiUrl}${attributeId}/options/`, option, { headers });
  }

  updateAttributeOption(attributeId: number, optionId: number, option: Partial<CreateAttributeOptionRequest>): Observable<AttributeOption> {
    const headers = this.getHeaders();
    return this.http.put<AttributeOption>(`${this.apiUrl}${attributeId}/options/${optionId}/`, option, { headers });
  }

  deleteAttributeOption(attributeId: number, optionId: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}${attributeId}/options/${optionId}/`, { headers });
  }

  // Reorder attribute options
  reorderAttributeOptions(attributeId: number, optionOrders: { id: number; sort_order: number }[]): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}${attributeId}/options/reorder/`, { options: optionOrders }, { headers });
  }

  // Bulk operations
  bulkImportAttributes(file: File): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}bulk-import/`, formData, { headers });
  }

  bulkDeleteAttributes(ids: number[]): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}bulk-delete/`, { ids }, { headers });
  }

  // Helper methods
  loadAttributes(): void {
    this.getAttributes().subscribe({
      next: (attributes) => this.attributesSubject.next(attributes),
      error: (error) => console.error('Error loading attributes:', error)
    });
  }

  // Validation helpers
  validateAttributeValue(attribute: AttributeDefinition, value: any): boolean {
    switch (attribute.type) {
      case 'text':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'select':
        return attribute.options?.some(option => option.value === value) || false;
      case 'multiselect':
        return Array.isArray(value) && value.every(v => 
          attribute.options?.some(option => option.value === v)
        );
      case 'date':
        return !isNaN(Date.parse(value));
      case 'color':
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
      default:
        return true;
    }
  }
}

export interface CreateAttributeRequest {
  name: string;
  type: AttributeType;
  is_required: boolean;
  is_filterable: boolean;
  is_searchable: boolean;
  options?: CreateAttributeOptionRequest[];
  validation_rules?: any;
}

export interface CreateAttributeOptionRequest {
  value: string;
  display_value: string;
  sort_order?: number;
}
