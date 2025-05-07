
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderItem } from "./OrderItemsList";
import OrderItemsList from "./OrderItemsList";

interface OrderSummaryProps {
  items: OrderItem[];
}

const OrderSummary = ({ items }: OrderSummaryProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="font-playfair text-2xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <OrderItemsList items={items} />
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
