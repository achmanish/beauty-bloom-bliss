
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Plus, CreditCard } from "lucide-react";

interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'Credit Card' | 'PayPal';
  last_four?: string;
  expiry_date?: string;
  card_name?: string;
  email?: string;
  is_default: boolean;
  created_at: string;
}

interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[];
  isLoadingPayments: boolean;
  onSetDefaultPayment: (paymentId: string) => Promise<void>;
  onRemovePayment: (paymentId: string) => Promise<void>;
}

const PaymentMethodList = ({
  paymentMethods,
  isLoadingPayments,
  onSetDefaultPayment,
  onRemovePayment
}: PaymentMethodListProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Payment Methods</h2>
        
        <Button className="bg-burgundy hover:bg-burgundy-light">
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {isLoadingPayments ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading your payment methods...</p>
        </div>
      ) : paymentMethods.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border p-8">
          <CreditCard className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No payment methods</h3>
          <p className="text-gray-500 mb-4">Add a payment method for faster checkout</p>
          <Button className="bg-burgundy hover:bg-burgundy-light">
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.map((payment) => (
            <Card key={payment.id} className={`${payment.is_default ? 'border-burgundy' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">
                    {payment.type === 'Credit Card' 
                      ? `${payment.card_name} ••••${payment.last_four}` 
                      : `PayPal: ${payment.email}`}
                  </h3>
                  {payment.is_default && (
                    <span className="bg-burgundy text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <Check className="w-3 h-3 mr-1" />
                      Default
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="text-sm text-gray-600">
                  {payment.type === 'Credit Card' && (
                    <div className="flex items-center">
                      <span className="mr-2">
                        {payment.type === 'Credit Card' && 
                          <CreditCard className="h-4 w-4" />}
                      </span>
                      <span>
                        {payment.expiry_date && (
                          <span>Expires {payment.expiry_date}</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-4">
                {!payment.is_default && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => onSetDefaultPayment(payment.id)}
                  >
                    Set as Default
                  </Button>
                )}
                {payment.is_default ? (
                  <div className="w-20"></div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs text-red-500 hover:text-red-700"
                    onClick={() => onRemovePayment(payment.id)}
                  >
                    Remove
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodList;
