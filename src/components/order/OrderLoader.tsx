
import { OrderDetails } from "@/utils/orderUtils";

interface OrderLoaderProps {
  loading: boolean;
  orderDetails: OrderDetails | null;
  onViewOrderDetails: () => void;
}

const OrderLoader = ({ loading, orderDetails, onViewOrderDetails }: OrderLoaderProps) => {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy"></div>
      </div>
    );
  }
  
  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-playfair text-3xl text-burgundy mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">
          We couldn't find the order details you're looking for.
        </p>
      </div>
    );
  }
  
  return null;
};

export default OrderLoader;
