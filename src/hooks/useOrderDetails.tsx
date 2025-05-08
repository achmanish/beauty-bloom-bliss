
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OrderDetails, getMockOrderDetails, calculateExpectedDelivery } from "@/utils/orderUtils";

// Helper function to normalize image paths
export const normalizeImagePath = (imagePath: string) => {
  if (!imagePath) return 'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80';
  
  // If the path is already a URL, return it as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // For local paths, ensure they are formatted correctly
  if (imagePath.startsWith('public/')) {
    return imagePath.replace('public/', '/');
  }
  
  return imagePath;
};

interface UseOrderDetailsProps {
  orderId?: string;
}

export const useOrderDetails = ({ orderId }: UseOrderDetailsProps) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        // If no orderId, use mock data (for development purposes)
        setOrderDetails(getMockOrderDetails());
        setLoading(false);
        return;
      }
      
      try {
        // Fetch the order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
        
        if (orderError || !orderData) {
          console.error("Error fetching order:", orderError);
          setOrderDetails(getMockOrderDetails());
          setLoading(false);
          return;
        }
        
        // Fetch the order items
        const { data: orderItemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*, products(*)')
          .eq('order_id', orderId);
        
        if (itemsError) {
          console.error("Error fetching order items:", itemsError);
          setOrderDetails(getMockOrderDetails());
          setLoading(false);
          return;
        }
        
        // Get payment info
        const { data: paymentData } = await supabase
          .from('payments')
          .select('*')
          .eq('order_id', orderId)
          .maybeSingle();
          
        // Format the order details
        const items = orderItemsData.map(item => ({
          id: String(item.id), // Convert to string to match the OrderItem interface
          name: item.products.name,
          price: parseFloat(item.price_at_time),
          quantity: item.quantity,
          size: '30ml', // Default size as it's not stored in DB
          image: normalizeImagePath(item.products.image_url || 'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80')
        }));
        
        const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; // Assuming 8% tax
        const total = parseFloat(String(orderData.total_amount)); // Convert to string and back to number to ensure it's a number
        
        // Parse shipping address (stored as a string in format "name, address, city, zipCode")
        const addressParts = (orderData.shipping_address || "").split(',');
        const shippingAddress = {
          name: addressParts[0]?.trim() || 'N/A',
          address: addressParts[1]?.trim() || 'N/A',
          city: addressParts[2]?.trim() || 'N/A',
          state: 'N/A',
          zip: addressParts[3]?.trim() || 'N/A',
          country: 'United States'
        };
        
        // Format the date
        const orderDate = new Date(orderData.created_at);
        const formattedDate = orderDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        // Calculate expected delivery
        const expectedDelivery = calculateExpectedDelivery(orderDate);
        
        setOrderDetails({
          orderNumber: String(orderId), // Convert orderId to string - This fixes the TypeScript error
          date: formattedDate,
          expectedDelivery,
          items,
          subtotal,
          shipping: 0, // Free shipping
          tax,
          total,
          shippingAddress,
          paymentMethod: paymentData?.payment_method || 'Credit Card'
        });
        
      } catch (error) {
        console.error("Error fetching order details:", error);
        setOrderDetails(getMockOrderDetails());
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);

  return { orderDetails, loading };
};
