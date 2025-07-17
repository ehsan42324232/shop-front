export interface BulkImportLog {
  id: string;
  store: string;
  store_name: string;
  user: string;
  user_name: string;
  filename: string;
  status: 'processing' | 'completed' | 'failed' | 'partial';
  total_rows: number;
  successful_rows: number;
  failed_rows: number;
  categories_created: number;
  products_created: number;
  products_updated: number;
  error_details: ImportError[];
  created_at: string;
  updated_at: string;
}

export interface ImportError {
  row?: number;
  error: string;
  data?: any;
}

export interface BulkImportRequest {
  file: File;
  store_id: string;
  update_existing: boolean;
  create_categories: boolean;
}
