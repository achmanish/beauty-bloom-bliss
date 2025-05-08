
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OrderConfirmationLayout from "@/components/order/OrderConfirmationLayout";
import OrderConfirmationHero from "@/components/order/OrderConfirmationHero";
import OrderProgress from "@/components/order/OrderProgress";
import OrderActions from "@/components/order/OrderActions";
import OrderSummary from "@/components/order/OrderSummary";
import OrderAddressInfo from "@/components/order/OrderAddressInfo";
import OrderTotalCard from "@/components/order/OrderTotalCard";
import OrderLoader from "@/components/order/OrderLoader";
import RelatedProducts from "@/components/order/RelatedProducts";
import { useOrderDetails } from "@/hooks/useOrderDetails";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract orderId from location state or fall back to mock data
  const orderId = location.state?.orderId ? String(location.state.orderId) : undefined;
  
  // Use our custom hook to fetch and manage order details
  const { orderDetails, loading } = useOrderDetails({ orderId });
  
  const handleViewOrderDetails = () => {
    navigate('/account', { state: { activeTab: 'orders' } });
  };
  
  // Show loading or error state if needed
  const loaderComponent = (
    <OrderLoader 
      loading={loading} 
      orderDetails={orderDetails} 
      onViewOrderDetails={handleViewOrderDetails} 
    />
  );
  
  if (loading || !orderDetails) {
    return (
      <OrderConfirmationLayout>
        {loaderComponent}
        {!loading && !orderDetails && (
          <Button 
            onClick={() => navigate('/products')}
            className="bg-burgundy hover:bg-burgundy-light text-white"
          >
            Continue Shopping
          </Button>
        )}
      </OrderConfirmationLayout>
    );
  }
  
  return (
    <OrderConfirmationLayout>
      <OrderConfirmationHero orderNumber={orderDetails.orderNumber} />
      
      <div className="container mx-auto px-4 py-10">
        {/* Order Progress */}
        <div className="mb-12">
          <OrderProgress 
            orderDate={orderDetails.date} 
            expectedDelivery={orderDetails.expectedDelivery}
          />
          
          <OrderActions onViewOrderDetails={handleViewOrderDetails} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <OrderSummary items={orderDetails.items} />
            
            <OrderAddressInfo 
              shippingAddress={orderDetails.shippingAddress} 
              paymentMethod={orderDetails.paymentMethod}
              orderDate={orderDetails.date}
            />
          </div>
          
          {/* Price Breakdown */}
          <div className="lg:col-span-1">
            <OrderTotalCard 
              subtotal={orderDetails.subtotal}
              shipping={orderDetails.shipping}
              tax={orderDetails.tax}
              total={orderDetails.total}
            />
          </div>
        </div>
        
        {/* You May Also Like */}
        <RelatedProducts />
      </div>
    </OrderConfirmationLayout>
  );
};

export default OrderConfirmation;
