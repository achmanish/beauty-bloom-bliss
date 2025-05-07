
import { Check } from "lucide-react";

interface OrderConfirmationHeroProps {
  orderNumber: string;
}

const OrderConfirmationHero = ({ orderNumber }: OrderConfirmationHeroProps) => {
  return (
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
          Order Number: <span className="text-burgundy">{orderNumber}</span>
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmationHero;
