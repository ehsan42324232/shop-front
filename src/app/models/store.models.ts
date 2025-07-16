// Enhanced Store models for multi-tenant platform

export interface Store {
  id: number;
  name: string;
  description: string;
  domain: string;
  logo?: string;
  banner?: string;
  theme_settings: StoreTheme;
  owner: StoreOwner;
  created_at: string;
  is_active: boolean;
  subscription_plan: string;
  settings: StoreSettings;
  stats: StoreStats;
}

export interface StoreOwner {
  id: number;
  user_id: number;
  store_id: number;
  role: 'owner' | 'admin' | 'manager';
  permissions: string[];
  created_at: string;
}

export interface StoreTheme {
  primary_color: string;
  secondary_color: string;
  font_family: string;
  layout: string;
  custom_css?: string;
}

export interface StoreSettings {
  currency: string;
  tax_rate: number;
  shipping_methods: ShippingMethod[];
  payment_methods: PaymentMethod[];
  business_hours: BusinessHours;
  return_policy: string;
  terms_of_service: string;
}

export interface StoreStats {
  total_products: number;
  total_orders: number;
  total_revenue: number;
  active_customers: number;
  conversion_rate: number;
}

export interface ShippingMethod {
  id: number;
  name: string;
  description: string;
  price: number;
  estimated_days: number;
  is_active: boolean;
}

export interface PaymentMethod {
  id: number;
  name: string;
  provider: string;
  config: any;
  is_active: boolean;
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  is_open: boolean;
  open_time?: string;
  close_time?: string;
}
