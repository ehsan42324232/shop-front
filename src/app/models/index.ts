// User models
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Store models
export interface Store {
  id: number;
  name: string;
  description: string;
  domain: string;
  created_at: string;
  owner: User;
  products_count: number;
}

// Category models
export interface Category {
  id: number;
  name: string;
  store: number;
  products_count: number;
}

// Product models
export interface Media {
  id: number;
  media_type: 'image' | 'video';
  file: string;
}

export interface Comment {
  id: number;
  user: User;
  text: string;
  created_at: string;
}

export interface Rating {
  id: number;
  user: User;
  score: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
  category: Category;
  media: Media[];
  average_rating: number;
  rating_count: number;
  comments?: Comment[];
  ratings?: Rating[];
}

// Basket models
export interface BasketItem {
  id: number;
  product: Product;
  product_id: number;
  quantity: number;
  total_price: number;
}

// Order models
export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price_at_order: number;
}

export interface Order {
  id: number;
  user: User;
  store: Store;
  created_at: string;
  is_paid: boolean;
  logistics_status: string;
  items: OrderItem[];
  total_amount: number;
}

// API Response models
export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  error: string;
  details?: any;
}
