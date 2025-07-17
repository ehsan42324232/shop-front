export interface ProductAttribute {
  id: string;
  store: string;
  name: string;
  slug: string;
  attribute_type: 'text' | 'number' | 'boolean' | 'choice' | 'color' | 'date';
  is_required: boolean;
  is_filterable: boolean;
  is_searchable: boolean;
  choices: string[];
  unit?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductAttributeRequest {
  name: string;
  attribute_type: string;
  is_required?: boolean;
  is_filterable?: boolean;
  is_searchable?: boolean;
  choices?: string[];
  unit?: string;
  sort_order?: number;
  store?: string;
}

export interface UpdateProductAttributeRequest extends CreateProductAttributeRequest {
  id: string;
}
