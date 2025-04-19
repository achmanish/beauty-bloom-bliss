
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string | null;
  category_id: string | null;
  stock: number;
  description?: string | null;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  transaction_id: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  max_uses: number | null;
  current_uses: number;
  created_at: string;
}

export interface FlashSale {
  id: string;
  name: string;
  discount_percent: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  created_at: string;
}

export type UserRole = 'admin' | 'manager' | 'staff';

export interface UserRoleEntry {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  role?: UserRole;
  first_name?: string;
  last_name?: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  created_at: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface UserPaymentMethod {
  id: string;
  user_id: string;
  type: 'Credit Card' | 'PayPal';
  last_four?: string;
  expiry_date?: string;
  card_name?: string;
  email?: string;
  is_default: boolean;
  created_at: string;
}
