
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

interface OrderTotalProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const OrderTotalCard = ({ subtotal, shipping, tax, total }: OrderTotalProps) => {
  return (
    <Card className="bg-cream sticky top-24">
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Order Total</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{subtotal.toLocaleString('ne-NP')}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString('ne-NP')}`}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span>₹{tax.toLocaleString('ne-NP')}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span className="text-burgundy">₹{total.toLocaleString('ne-NP')}</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 bg-white p-3 rounded-lg">
          <p>
            Need help? <Link to="/contact" className="text-burgundy hover:underline">Contact our support team</Link> or call us at (977) 01-4000123.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTotalCard;
