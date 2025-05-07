
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Package, Truck, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Products from "@/components/Products";

// Define interfaces to type our data
interface OrderItem {
  id: string; // Changed from number to string to match Supabase UUID
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface OrderDetails {
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
          id: item.id.toString(), // Convert to string to match the OrderItem interface
          name: item.products.name,
          price: parseFloat(item.price_at_time),
          quantity: item.quantity,
          size: '30ml', // Default size as it's not stored in DB
          image: item.products.image_url || 'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80'
        }));
        
        const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; // Assuming 8% tax
        const total = parseFloat(orderData.total_amount.toString()); // Convert to string and back to number to ensure it's a number
        
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
        
        // Calculate expected delivery (5-7 days from order date)
        const deliveryDate = new Date(orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 5);
        const deliveryEndDate = new Date(orderDate);
        deliveryEndDate.setDate(deliveryEndDate.getDate() + 7);
        
        const expectedDelivery = `${deliveryDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric'
        })} - ${deliveryEndDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}`;
        
        setOrderDetails({
          orderNumber: orderId.substring(0, 8),
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
  
  // Mock order details for development or fallback
  const getMockOrderDetails = (): OrderDetails => {
    return {
      orderNumber: "ORD-65432",
      date: "April 15, 2023",
      expectedDelivery: "April 20-23, 2023",
      items: [
        {
          id: "1", // Changed from number to string to match the interface
          name: "Rose Glow Serum",
          price: 89,
          quantity: 2,
          size: "30ml",
          image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80"
        },
        {
          id: "2", // Changed from number to string to match the interface
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy"></div>
      </div>
    );
  }
  
  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
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
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="bg-cream py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-burgundy text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl text-burgundy mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            Your order has been received and is now being processed.
            You will receive a confirmation email shortly.
          </p>
          <p className="font-medium">
            Order Number: <span className="text-burgundy">{orderDetails.orderNumber}</span>
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-10">
        {/* Order Progress */}
        <div className="mb-12">
          <div className="flex justify-between max-w-3xl mx-auto mb-4">
            <div className="text-center">
              <div className="bg-burgundy text-white rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                <Check className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Order Placed</p>
              <p className="text-xs text-gray-500">{orderDetails.date}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-burgundy text-white rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                <Package className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Processing</p>
              <p className="text-xs text-gray-500">In progress</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-200 text-gray-400 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                <Truck className="h-6 w-6" />
              </div>
              <p className="text-sm text-gray-400">Shipped</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-200 text-gray-400 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-6 w-6" />
              </div>
              <p className="text-sm text-gray-400">Delivered</p>
              <p className="text-xs text-gray-500">Estimated: {orderDetails.expectedDelivery}</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="flex space-x-4 mt-6">
              <Button 
                variant="outline" 
                className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                onClick={handleViewOrderDetails}
              >
                View Order Details
              </Button>
              <Link to="/products">
                <Button className="bg-burgundy hover:bg-burgundy-light text-white">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg border mb-6">
              <h2 className="font-playfair text-2xl mb-6">Order Summary</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-cream text-burgundy">
                    <tr>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-center">Quantity</th>
                      <th className="px-4 py-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-4">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-500">Size: {item.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">{item.quantity}</td>
                        <td className="px-4 py-4 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-medium text-lg mb-4">Shipping Address</h3>
                <p className="mb-1">{orderDetails.shippingAddress.name}</p>
                <p className="mb-1">{orderDetails.shippingAddress.address}</p>
                <p className="mb-1">
                  {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}
                </p>
                <p>{orderDetails.shippingAddress.country}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-medium text-lg mb-4">Payment Information</h3>
                <p className="mb-1">Payment Method: {orderDetails.paymentMethod}</p>
                <p>Order Date: {orderDetails.date}</p>
              </div>
            </div>
          </div>
          
          {/* Price Breakdown */}
          <div className="lg:col-span-1">
            <div className="bg-cream p-6 rounded-lg sticky top-24">
              <h2 className="font-playfair text-xl mb-6">Order Total</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${orderDetails.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{orderDetails.shipping === 0 ? "Free" : `$${orderDetails.shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${orderDetails.tax.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span className="text-burgundy">${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                <p>
                  Need help? <Link to="/contact" className="text-burgundy hover:underline">Contact our support team</Link> or call us at (800) 123-4567.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* You May Also Like */}
        <section className="py-16">
          <h2 className="font-playfair text-3xl text-center mb-8 text-burgundy">You May Also Like</h2>
          <Products />
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
