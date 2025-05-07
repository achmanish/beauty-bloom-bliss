
import { OrderItem } from "@/components/order/OrderItemsList";

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderDetails {
  orderNumber: string;
  date: string;
  expectedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export const getMockOrderDetails = (): OrderDetails => {
  return {
    orderNumber: "ORD-65432",
    date: "April 15, 2023",
    expectedDelivery: "April 20-23, 2023",
    items: [
      {
        id: "1",
        name: "Rose Glow Serum",
        price: 89,
        quantity: 2,
        size: "30ml",
        image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "2",
        name: "Hydrating Cream",
        price: 65,
        quantity: 1,
        size: "50ml",
        image: "https://images.unsplash.com/photo-1570194065650-d707c41c4754?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 243,
    shipping: 0,
    tax: 19.44,
    total: 262.44,
    shippingAddress: {
      name: "Emma Wilson",
      address: "123 Beauty Street",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "United States"
    },
    paymentMethod: "Credit Card (ending in 4242)"
  };
};

export const calculateExpectedDelivery = (orderDate: Date): string => {
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const deliveryEndDate = new Date(orderDate);
  deliveryEndDate.setDate(deliveryEndDate.getDate() + 7);
  
  return `${deliveryDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  })} - ${deliveryEndDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })}`;
};
