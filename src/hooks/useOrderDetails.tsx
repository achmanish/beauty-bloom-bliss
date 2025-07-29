
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getMockOrderDetails, OrderDetails, calculateExpectedDelivery } from '@/utils/orderUtils';

interface UseOrderDetailsProps {
  orderId?: string;
}

export const useOrderDetails = ({ orderId }: UseOrderDetailsProps) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        if (!orderId) {
          // If no orderId is provided, use mock data
          setOrderDetails(getMockOrderDetails());
          setLoading(false);
          return;
        }

        // Convert orderId to string if it's not already
        const orderIdString = String(orderId);
        
        // Fetch order data from Supabase
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*, user:user_id(*)')
          .eq('id', orderIdString)
          .single();

        if (orderError) throw orderError;

        // Fetch order items
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('*, product:product_id(*)')
          .eq('order_id', orderIdString);

        if (itemsError) throw itemsError;

        // Format items
        const formattedItems = orderItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.price_at_time,
          quantity: item.quantity,
          image: item.product.image_url
        }));

        // Calculate subtotal
        const subtotal = formattedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );

        // Create date object from the order created_at
        const orderDate = new Date(orderData.created_at);
        
        // Format the order details
        const details: OrderDetails = {
          orderNumber: orderData.id.substring(0, 8).toUpperCase(),
          date: orderDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          expectedDelivery: calculateExpectedDelivery(orderDate),
          items: formattedItems,
          subtotal: subtotal,
          shipping: 0, // Free shipping for now
          tax: subtotal * 0.08, // 8% tax
          total: subtotal + (subtotal * 0.08), // subtotal + tax
          shippingAddress: {
            name: orderData.shipping_address.split(',')[0] || 'Customer',
            address: orderData.shipping_address.split(',')[1] || 'Address',
            city: orderData.shipping_address.split(',')[2] || 'City',
            state: orderData.shipping_address.split(',')[3] || 'State',
            zip: orderData.shipping_address.split(',')[4] || 'ZIP',
            country: 'Nepal'
          },
          paymentMethod: 'Online Payment'
        };

        setOrderDetails(details);
      } catch (error) {
        console.error("Error fetching order details:", error);
        // On error, use mock data as a fallback
        setOrderDetails(getMockOrderDetails());
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return { orderDetails, loading };
};
