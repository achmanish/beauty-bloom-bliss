
import { Check, Package, Truck, Calendar } from "lucide-react";

interface OrderProgressProps {
  orderDate: string;
  expectedDelivery: string;
}

const OrderProgress = ({ orderDate, expectedDelivery }: OrderProgressProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between max-w-3xl mx-auto mb-4">
        <div className="text-center">
          <div className="bg-burgundy text-white rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
            <Check className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium">Order Placed</p>
          <p className="text-xs text-gray-500">{orderDate}</p>
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
          <p className="text-xs text-gray-500">Estimated: {expectedDelivery}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderProgress;
