
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Products from "@/components/Products";
import OrderConfirmationLayout from "@/components/order/OrderConfirmationLayout";
import OrderConfirmationHero from "@/components/order/OrderConfirmationHero";
import OrderProgress from "@/components/order/OrderProgress";
import OrderActions from "@/components/order/OrderActions";
import OrderSummary from "@/components/order/OrderSummary";
import OrderAddressInfo from "@/components/order/OrderAddressInfo";
import OrderTotalCard from "@/components/order/OrderTotalCard";
import { OrderDetails, getMockOrderDetails, calculateExpectedDelivery } from "@/utils/orderUtils";

// Helper function to normalize image paths
const normalizeImagePath = (imagePath: string) => {
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

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Extract orderId from location state or fall back to mock data
  const orderId = location.state?.orderId;
  
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
  
  const handleViewOrderDetails = () => {
    navigate('/account', { state: { activeTab: 'orders' } });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy"></div>
      </div>
    );
  }
  
  if (!orderDetails) {
    return (
      <OrderConfirmationLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-playfair text-3xl text-burgundy mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the order details you're looking for.
          </p>
          <Button 
            onClick={() => navigate('/products')}
            className="bg-burgundy hover:bg-burgundy-light text-white"
          >
            Continue Shopping
          </Button>
        </div>
      </OrderConfirmationLayout>
    );
  }
  
  return (
    <OrderConfirmationLayout>
      <OrderConfirmationHero orderNumber={orderDetails?.orderNumber || ''} />
      
      <div className="container mx-auto px-4 py-10">
        {/* Order Progress */}
        <div className="mb-12">
          <OrderProgress 
            orderDate={orderDetails?.date || ''} 
            expectedDelivery={orderDetails?.expectedDelivery || ''}
          />
          
          <OrderActions onViewOrderDetails={handleViewOrderDetails} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            {orderDetails && <OrderSummary items={orderDetails.items} />}
            
            {orderDetails && (
              <OrderAddressInfo 
                shippingAddress={orderDetails.shippingAddress} 
                paymentMethod={orderDetails.paymentMethod}
                orderDate={orderDetails.date}
              />
            )}
          </div>
          
          {/* Price Breakdown */}
          <div className="lg:col-span-1">
            {orderDetails && (
              <OrderTotalCard 
                subtotal={orderDetails.subtotal}
                shipping={orderDetails.shipping}
                tax={orderDetails.tax}
                total={orderDetails.total}
              />
            )}
          </div>
        </div>
        
        {/* You May Also Like */}
        <section className="py-16">
          <h2 className="font-playfair text-3xl text-center mb-8 text-burgundy">You May Also Like</h2>
          <Products />
        </section>
      </div>
    </OrderConfirmationLayout>
  );
};

export default OrderConfirmation;
