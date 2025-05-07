
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

interface OrderActionsProps {
  onViewOrderDetails: () => void;
}

const OrderActions = ({ onViewOrderDetails }: OrderActionsProps) => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
        <Button 
          variant="outline" 
          className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white transition-colors"
          onClick={onViewOrderDetails}
        >
          View Order Details
        </Button>
        <Link to="/products">
          <Button className="bg-burgundy hover:bg-burgundy-light text-white transition-colors w-full sm:w-auto">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderActions;
