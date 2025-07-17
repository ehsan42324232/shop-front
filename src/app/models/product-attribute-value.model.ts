export interface ProductAttributeValue {
  id: string;
  attribute: string;
  attribute_name: string;
  attribute_type: string;
  attribute_choices: string[];
  attribute_unit?: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface SetProductAttributeRequest {
  attribute_id: string;
  value: string;
}
