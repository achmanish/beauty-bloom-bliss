import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from '@/components/LanguageSelector';
import PaymentOptions from '@/components/checkout/PaymentOptions';
import { Loader2 } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'details' | 'payment'>('details');
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to complete your purchase.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!cart.length) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items before checkout.",
        variant: "destructive",
      });
      navigate('/products');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create a new order
      const shippingAddress = `${formData.name}, ${formData.address}, ${formData.city}, ${formData.zipCode}`;
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: cartTotal,
          shipping_address: shippingAddress,
          status: 'pending'
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_time: item.product.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      setOrderId(orderData.id);
      setCurrentStep('payment');
      
      toast({
        title: "Order Created",
        description: "Please complete payment to finalize your order.",
      });
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast({
        title: "Checkout Error",
        description: error.message || "There was an error processing your order.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentComplete = () => {
    // Update order status to paid
    if (orderId) {
      supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId)
        .then(() => {
          // Clear cart and redirect to confirmation
          clearCart()
            .then(() => {
              navigate('/order-confirmation', { 
                state: { 
                  orderId,
                  total: cartTotal
                } 
              });
            })
            .catch(error => {
              console.error("Error clearing cart:", error);
              navigate('/order-confirmation', { 
                state: { 
                  orderId,
                  total: cartTotal
                } 
              });
            });
        })
        .catch(error => {
          console.error("Error updating order:", error);
        });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{translate('emptyCart')}</h1>
          <Button onClick={() => navigate('/products')} className="bg-burgundy hover:bg-burgundy-light">
            {translate('continueShopping')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{translate('checkout')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {currentStep === 'details' ? (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">{translate('shippingDetails')}</h2>
                
                <form onSubmit={handleSubmitDetails} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium">
                        {translate('fullName')}*
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full p-2 border rounded-md"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium">
                        {translate('email')}*
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full p-2 border rounded-md"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium">
                      {translate('phone')}*
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="w-full p-2 border rounded-md"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="address" className="block text-sm font-medium">
                      {translate('address')}*
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      required
                      className="w-full p-2 border rounded-md"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="city" className="block text-sm font-medium">
                        {translate('city')}*
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        className="w-full p-2 border rounded-md"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="zipCode" className="block text-sm font-medium">
                        {translate('zipCode')}*
                      </label>
                      <input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        required
                        className="w-full p-2 border rounded-md"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="notes" className="block text-sm font-medium">
                      {translate('orderNotes')}
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      className="w-full p-2 border rounded-md"
                      value={formData.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6 bg-burgundy hover:bg-burgundy-light"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {translate('processing')}
                      </>
                    ) : (
                      translate('continueToPayment')
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">{translate('payment')}</h2>
                {orderId && (
                  <PaymentOptions 
                    orderId={orderId} 
                    amount={cartTotal} 
                    onPaymentComplete={handlePaymentComplete} 
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">{translate('orderSummary')}</h2>
              
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      ₹{(Number(item.product.price) * item.quantity).toLocaleString('ne-NP')}
                    </p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <p className="font-medium">{translate('subtotal')}</p>
                  <p className="font-medium">₹{cartTotal.toLocaleString('ne-NP')}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="font-medium">{translate('shipping')}</p>
                  <p className="font-medium">{translate('free')}</p>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">{translate('totalAmount')}</p>
                  <p className="font-bold text-lg">₹{cartTotal.toLocaleString('ne-NP')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
