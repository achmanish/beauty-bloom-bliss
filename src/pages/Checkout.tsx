
import { useState, useEffect } from 'react';
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
import PhoneInput from '@/components/checkout/PhoneInput';
import ShippingOptions from '@/components/checkout/ShippingOptions';
import { Loader2, AlertTriangle, CheckCircle, InfoIcon } from 'lucide-react';
import { isApprovedEmailProvider, getAllowedEmailProviders } from '@/utils/formValidation';
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes: string;
}

// Shipping options with different delivery times and prices
const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Delivery to your address',
    price: 0,
    estimatedDelivery: 'Estimated delivery in 3-5 days'
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Fast delivery to your address',
    price: 200,
    estimatedDelivery: 'Estimated delivery in 1-2 days'
  },
  {
    id: 'premium',
    name: 'Premium Delivery',
    description: 'Same-day delivery (for Kathmandu Valley only)',
    price: 400,
    estimatedDelivery: 'Delivered today if ordered before 2PM'
  }
];

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'details' | 'payment'>('details');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [emailError, setEmailError] = useState("");
  const [shippingOption, setShippingOption] = useState('standard');
  
  // Get the selected shipping option
  const selectedShipping = SHIPPING_OPTIONS.find(option => option.id === shippingOption) || SHIPPING_OPTIONS[0];
  
  // Calculate total with shipping
  const totalWithShipping = cartTotal + selectedShipping.price;
  
  // Initialize form with default values
  const form = useForm<CheckoutFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '+977 ',
      address: '',
      city: '',
      zipCode: '',
      notes: '',
    },
  });

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user?.email) {
      form.setValue('email', user.email);
      validateEmail(user.email);
    }
  }, [user]);

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    
    if (!isApprovedEmailProvider(email)) {
      setEmailError(`Only ${getAllowedEmailProviders()} email addresses are allowed`);
      return false;
    }
    
    setEmailError("");
    return true;
  };

  const handlePhoneChange = (value: string) => {
    form.setValue('phone', value);
  };
  
  const handleShippingOptionChange = (id: string) => {
    setShippingOption(id);
  };

  const handleSubmitDetails = async (data: CheckoutFormData) => {
    // Validate email again as a final check
    if (!validateEmail(data.email)) {
      return;
    }
    
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
      // Get the selected shipping option
      const shipping = SHIPPING_OPTIONS.find(option => option.id === shippingOption) || SHIPPING_OPTIONS[0];
      
      // Create a new order
      const shippingAddress = `${data.name}, ${data.address}, ${data.city}, ${data.zipCode}`;
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalWithShipping,
          shipping_address: shippingAddress,
          shipping_method: shipping.name,
          shipping_cost: shipping.price,
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
      
      // Convert orderId to string to avoid type error
      setOrderId(String(orderData.id));
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

  const handlePaymentComplete = async () => {
    // Update order status to paid
    if (orderId) {
      try {
        // First update the order status to paid
        await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', orderId);
        
        // After successful order update, clear the cart
        await clearCart();
        
        // After cart is cleared, navigate to confirmation page
        navigate('/order-confirmation', { 
          state: { 
            orderId,
            total: totalWithShipping
          } 
        });
      } catch (error) {
        // Handle any errors that occur in the Promise chain
        console.error("Error in payment completion:", error);
        toast({
          title: "Error",
          description: "There was an error completing your order.",
          variant: "destructive",
        });
      }
    }
  };

  // Helper function to normalize image paths
  const normalizeImagePath = (imagePath: string) => {
    if (!imagePath) return '/placeholder.svg';
    
    // If the path is already a URL, return it as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // For local paths, ensure they are formatted correctly
    if (imagePath.startsWith('public/')) {
      return imagePath.replace('public/', '/');
    }
    
    return imagePath;
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
            <>
              <Card className="shadow-md">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <span className="bg-burgundy text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">1</span>
                    {translate('shippingDetails')}
                  </h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmitDetails)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormItem>
                          <FormLabel>
                            {translate('fullName')}*
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...form.register('name', { required: true })}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                        
                        <div className="space-y-2">
                          <FormItem className="space-y-1">
                            <FormLabel>
                              {translate('email')}*
                            </FormLabel>
                            <Input
                              type="email" 
                              placeholder="yourname@example.com"
                              {...form.register('email')}
                              onChange={(e) => {
                                form.setValue('email', e.target.value);
                                validateEmail(e.target.value);
                              }}
                              className={emailError ? "border-red-500" : ""}
                            />
                            {emailError ? (
                              <div className="text-red-500 text-sm mt-1 flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                {emailError}
                              </div>
                            ) : form.watch('email') && !emailError ? (
                              <div className="text-green-600 text-sm mt-1 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Valid email
                              </div>
                            ) : null}
                            <div className="text-xs text-gray-500">
                              Only Gmail, Yahoo, Microsoft or Apple email addresses are allowed
                            </div>
                          </FormItem>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium mb-1">
                          {translate('phone')}*
                        </label>
                        <PhoneInput 
                          value={form.watch('phone')}
                          onChange={handlePhoneChange}
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <FormLabel htmlFor="address" className="block text-sm font-medium">
                          {translate('address')}*
                        </FormLabel>
                        <Input
                          id="address"
                          placeholder="Street address, apartment, suite"
                          {...form.register('address', { required: true })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <FormLabel htmlFor="city" className="block text-sm font-medium">
                            {translate('city')}*
                          </FormLabel>
                          <Input
                            id="city"
                            placeholder="City name"
                            {...form.register('city', { required: true })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <FormLabel htmlFor="zipCode" className="block text-sm font-medium">
                            {translate('zipCode')}*
                          </FormLabel>
                          <Input
                            id="zipCode"
                            placeholder="Postal/ZIP code"
                            {...form.register('zipCode', { required: true })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <FormLabel htmlFor="notes" className="block text-sm font-medium">
                          {translate('orderNotes')}
                        </FormLabel>
                        <textarea
                          id="notes"
                          rows={3}
                          className="w-full p-2 border rounded-md"
                          placeholder="Special instructions for delivery"
                          {...form.register('notes')}
                        />
                      </div>
                      
                      <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-start gap-3">
                        <InfoIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-amber-800">Cash on Delivery Available</p>
                          <p className="text-amber-700">We offer cash on delivery for orders within Nepal. You can pay when your order arrives.</p>
                        </div>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card className="shadow-md">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <span className="bg-burgundy text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">2</span>
                    {translate('deliveryOptions')}
                  </h2>
                  
                  <ShippingOptions 
                    selectedOption={shippingOption}
                    onSelect={handleShippingOptionChange}
                    options={SHIPPING_OPTIONS}
                  />
                  
                  <Button 
                    onClick={form.handleSubmit(handleSubmitDetails)}
                    className="w-full mt-6 bg-burgundy hover:bg-burgundy-light"
                    disabled={isProcessing || !!emailError}
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
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-burgundy text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">3</span>
                  {translate('payment')}
                </h2>
                {orderId && (
                  <PaymentOptions 
                    orderId={orderId} 
                    amount={totalWithShipping} 
                    onPaymentComplete={handlePaymentComplete} 
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="shadow-md sticky top-4">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">{translate('orderSummary')}</h2>
              
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 mr-3">
                        <img 
                          src={normalizeImagePath(item.product?.image_url)} 
                          alt={item.product?.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
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
                  <p className="font-medium">
                    {selectedShipping.price === 0 
                      ? translate('free') 
                      : `₹${selectedShipping.price.toLocaleString('ne-NP')}`}
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">{translate('totalAmount')}</p>
                  <p className="font-bold text-lg">₹{totalWithShipping.toLocaleString('ne-NP')}</p>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm bg-green-50 p-3 rounded-md border border-green-100">
                    <p className="flex items-center text-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" /> 
                      {selectedShipping.estimatedDelivery}
                    </p>
                  </div>
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
