
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PaymentService } from '@/services/PaymentService';
import { Loader2, CreditCard, Banknote } from 'lucide-react';
import { useLanguage } from '../LanguageSelector';

// Add these translations to your LanguageSelector.tsx translations object
const paymentTranslations = {
  selectPaymentMethod: { en: 'Select Payment Method', ne: 'भुक्तानी विधि चयन गर्नुहोस्' },
  khalti: { en: 'Khalti', ne: 'खल्ती' },
  esewa: { en: 'eSewa', ne: 'इसेवा' },
  cod: { en: 'Cash on Delivery', ne: 'डेलिभरीमा नगद' },
  payNow: { en: 'Pay Now', ne: 'अहिले भुक्तानी गर्नुहोस्' },
  completePurchase: { en: 'Complete Purchase', ne: 'खरीद पूरा गर्नुहोस्' },
  processingPayment: { en: 'Processing Payment...', ne: 'भुक्तानी प्रक्रिया गरिंदै...' }
};

interface PaymentOptionsProps {
  orderId: string;
  amount: number;
  onPaymentComplete: () => void;
}

const PaymentOptions = ({ orderId, amount, onPaymentComplete }: PaymentOptionsProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'esewa' | 'khalti' | 'cod' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { translate } = useLanguage();

  // Initiate Khalti payment
  const initiateKhaltiPayment = async () => {
    setIsProcessing(true);
    try {
      // Mock successful payment
      // In a real app, this would be handled by the Khalti SDK
      const mockResponse = {
        idx: `mock-transaction-${Date.now()}`,
        token: `mock-token-${Date.now()}`,
        amount: amount
      };
      
      // Verify payment with our backend
      await PaymentService.verifyKhaltiPayment(mockResponse.token, amount);
      
      // Record payment in database
      await PaymentService.createPaymentRecord({
        orderId,
        amount,
        paymentMethod: 'khalti',
        paymentData: mockResponse
      });
      
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      
      onPaymentComplete();
    } catch (error) {
      console.error("Khalti payment error:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Initiate eSewa payment
  const initiateEsewaPayment = async () => {
    setIsProcessing(true);
    try {
      // Mock successful payment
      // In a real app, this would be handled by redirecting to eSewa
      const mockResponse = {
        pid: orderId,
        rid: `mock-receipt-${Date.now()}`,
        amt: amount
      };
      
      // Verify payment with our backend
      await PaymentService.verifyEsewaPayment(mockResponse.pid, mockResponse.amt, mockResponse.rid);
      
      // Record payment in database
      await PaymentService.createPaymentRecord({
        orderId,
        amount,
        paymentMethod: 'esewa',
        paymentData: mockResponse
      });
      
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      
      onPaymentComplete();
    } catch (error) {
      console.error("eSewa payment error:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Process Cash on Delivery
  const processCashOnDelivery = async () => {
    setIsProcessing(true);
    try {
      // Record COD payment in database
      await PaymentService.createPaymentRecord({
        orderId,
        amount,
        paymentMethod: 'cod',
        paymentData: { type: 'cod', timestamp: Date.now() }
      });
      
      toast({
        title: "Order Confirmed",
        description: "Your cash on delivery order has been confirmed.",
      });
      
      onPaymentComplete();
    } catch (error) {
      console.error("COD processing error:", error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayNow = async () => {
    if (!selectedMethod) {
      toast({
        title: "Select Payment Method",
        description: "Please select a payment method to continue.",
        variant: "destructive",
      });
      return;
    }

    if (selectedMethod === 'khalti') {
      await initiateKhaltiPayment();
    } else if (selectedMethod === 'esewa') {
      await initiateEsewaPayment();
    } else if (selectedMethod === 'cod') {
      await processCashOnDelivery();
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{translate('selectPaymentMethod')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedMethod === 'khalti' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
          }`}
          onClick={() => setSelectedMethod('khalti')}
        >
          <div className="flex items-center justify-center h-12 mb-2">
            <div className="text-purple-600 font-bold text-lg">{translate('khalti')}</div>
          </div>
          <p className="text-xs text-center text-gray-600">Fast digital payment via Khalti wallet</p>
        </div>

        <div
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedMethod === 'esewa' ? 'border-green-500 bg-green-50' : 'border-gray-200'
          }`}
          onClick={() => setSelectedMethod('esewa')}
        >
          <div className="flex items-center justify-center h-12 mb-2">
            <div className="text-green-600 font-bold text-lg">{translate('esewa')}</div>
          </div>
          <p className="text-xs text-center text-gray-600">Digital wallet by eSewa</p>
        </div>
        
        <div
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedMethod === 'cod' ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
          }`}
          onClick={() => setSelectedMethod('cod')}
        >
          <div className="flex items-center justify-center h-12 mb-2">
            <div className="flex items-center text-amber-600 font-bold text-lg">
              <Banknote className="h-5 w-5 mr-2" />
              {translate('cod')}
            </div>
          </div>
          <p className="text-xs text-center text-gray-600">Pay with cash when your order arrives</p>
        </div>
      </div>

      <Button
        className="w-full"
        disabled={!selectedMethod || isProcessing}
        onClick={handlePayNow}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {translate('processingPayment')}
          </>
        ) : selectedMethod === 'cod' ? translate('completePurchase') : translate('payNow')}
      </Button>
      
      {selectedMethod && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
          {selectedMethod === 'khalti' && (
            <p>You'll be redirected to Khalti to complete your payment securely.</p>
          )}
          {selectedMethod === 'esewa' && (
            <p>You'll be redirected to eSewa to complete your payment securely.</p>
          )}
          {selectedMethod === 'cod' && (
            <p>Your order will be delivered to your address. Please keep the exact amount ready for payment upon delivery.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentOptions;
