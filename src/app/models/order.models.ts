// Enhanced Order models with delivery and payment

export interface Order {
  id: number;
  order_number: string;
  user: User;
  store: Store;
  items: OrderItem[];
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
  shipping_address: Address;
  billing_address: Address;
  shipping_method: ShippingMethod;
  payment_method: PaymentMethod;
  delivery_date?: string;
  delivery_time_slot?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  tracking_number?: string;
  estimated_delivery: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  unit_price: number;
  total_price: number;
  attributes: { [key: string]: any };
}

export interface Address {
  id?: number;
  type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 
  | 'pending' 
  | 'authorized' 
  | 'captured' 
  | 'failed' 
  | 'cancelled' 
  | 'refunded';

export type FulfillmentStatus = 
  | 'unfulfilled' 
  | 'partial' 
  | 'fulfilled' 
  | 'cancelled';

export interface DeliveryOption {
  id: number;
  name: string;
  description: string;
  price: number;
  estimated_days: number;
  available_time_slots: TimeSlot[];
  is_available: boolean;
}

export interface TimeSlot {
  id: string;
  label: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  additional_fee?: number;
}

export interface CheckoutRequest {
  items: { product_id: number; quantity: number; variant_id?: number }[];
  shipping_address: Address;
  billing_address: Address;
  shipping_method_id: number;
  payment_method_id: number;
  delivery_date?: string;
  delivery_time_slot?: string;
  notes?: string;
  coupon_code?: string;
}
