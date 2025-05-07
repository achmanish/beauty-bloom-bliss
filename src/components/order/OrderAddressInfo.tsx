
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface OrderAddressInfoProps {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  orderDate: string;
}

const OrderAddressInfo = ({ shippingAddress, paymentMethod, orderDate }: OrderAddressInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <h3 className="font-medium text-lg">Shipping Address</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="mb-1">{shippingAddress.name}</p>
          <p className="mb-1">{shippingAddress.address}</p>
          <p className="mb-1">
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
          </p>
          <p>{shippingAddress.country}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <h3 className="font-medium text-lg">Payment Information</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="mb-1">Payment Method: {paymentMethod}</p>
          <p>Order Date: {orderDate}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderAddressInfo;
