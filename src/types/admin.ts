
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
