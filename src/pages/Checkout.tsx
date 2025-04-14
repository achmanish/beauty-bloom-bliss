
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Form validation schema
const checkoutSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  address: z.string().min(5, { message: "Please enter a valid address" }),
  city: z.string().min(2, { message: "Please enter a valid city" }),
  state: z.string().min(2, { message: "Please enter a valid state/province" }),
  zipCode: z.string().min(4, { message: "Please enter a valid zip/postal code" }),
  country: z.string().min(2, { message: "Please select a country" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  paymentMethod: z.enum(["credit-card", "paypal"]),
  saveInfo: z.boolean().optional(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  }),
});

// Mock cart items
const cartItems = [
  {
    id: 1,
    name: "Rose Glow Serum",
    price: 89,
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80",
    quantity: 2,
    size: "30ml"
  },
  {
    id: 2,
    name: "Hydrating Cream",
    price: 65,
    image: "https://images.unsplash.com/photo-1570194065650-d707c41c4754?auto=format&fit=crop&w=800&q=80",
    quantity: 1,
    size: "50ml"
  }
];

type FormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  
  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shippingCost = shippingMethod === "express" ? 12 : (subtotal > 100 ? 0 : 5);
  const taxes = Math.round(subtotal * 0.08);
  const total = subtotal + shippingCost + taxes - discount;
  
  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: "",
      paymentMethod: "credit-card",
      saveInfo: true,
      terms: false,
    },
  });
  
  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "welcome10") {
      setCouponApplied(true);
      toast.success("Coupon applied: 10% off");
    } else {
      toast.error("Invalid coupon code");
    }
  };
  
  const handleSubmit = (values: FormValues) => {
    console.log(values);
    
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
    } else {
      // Process payment and submit order
      toast.success("Order placed successfully!", {
        description: "Thank you for your purchase. Your order is being processed."
      });
      
      // Redirect to confirmation page
      setTimeout(() => {
        window.location.href = "/order-confirmation";
      }, 2000);
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-playfair text-3xl md:text-4xl text-burgundy mb-2">Checkout</h1>
        
        {/* Checkout Steps */}
        <div className="flex items-center mb-10">
          <div className={`flex items-center ${step >= 1 ? 'text-burgundy' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-burgundy bg-rose' : 'border-gray-300'}`}>
              1
            </div>
            <span className="ml-2 font-medium">Shipping</span>
          </div>
          <div className={`w-12 h-1 mx-2 ${step >= 2 ? 'bg-burgundy' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-burgundy' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-burgundy bg-rose' : 'border-gray-300'}`}>
              2
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
          <div className="w-12 h-1 mx-2 bg-gray-300"></div>
          <div className="flex items-center text-gray-400">
            <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-300">
              3
            </div>
            <span className="ml-2 font-medium">Confirmation</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                {step === 1 && (
                  <>
                    <div className="bg-white p-6 rounded-lg border">
                      <h2 className="font-playfair text-xl mb-6">Contact Information</h2>
                      
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Your email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="For delivery questions" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg border">
                      <h2 className="font-playfair text-xl mb-6">Shipping Address</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="First name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Street address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="State or province" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP/Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="ZIP or postal code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                  {...field}
                                >
                                  <option value="United States">United States</option>
                                  <option value="Canada">Canada</option>
                                  <option value="United Kingdom">United Kingdom</option>
                                  <option value="Australia">Australia</option>
                                  <option value="France">France</option>
                                  <option value="Germany">Germany</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg border">
                      <h2 className="font-playfair text-xl mb-6">Shipping Method</h2>
                      
                      <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                        <div className="flex items-center justify-between p-4 rounded-lg border mb-3">
                          <div className="flex items-center">
                            <RadioGroupItem value="standard" id="standard" className="mr-3" />
                            <div>
                              <Label htmlFor="standard" className="font-medium">Standard Shipping</Label>
                              <p className="text-sm text-gray-500">4-7 business days</p>
                            </div>
                          </div>
                          <div className="font-medium">
                            {subtotal > 100 ? "Free" : "$5.00"}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                          <div className="flex items-center">
                            <RadioGroupItem value="express" id="express" className="mr-3" />
                            <div>
                              <Label htmlFor="express" className="font-medium">Express Shipping</Label>
                              <p className="text-sm text-gray-500">2-3 business days</p>
                            </div>
                          </div>
                          <div className="font-medium">$12.00</div>
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}
                
                {step === 2 && (
                  <>
                    <div className="bg-white p-6 rounded-lg border">
                      <h2 className="font-playfair text-xl mb-6">Payment Method</h2>
                      
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <div className="flex items-center p-4 rounded-lg border mb-3">
                                  <RadioGroupItem value="credit-card" id="credit-card" className="mr-3" />
                                  <Label htmlFor="credit-card" className="font-medium">Credit Card</Label>
                                </div>
                                
                                <div className="flex items-center p-4 rounded-lg border">
                                  <RadioGroupItem value="paypal" id="paypal" className="mr-3" />
                                  <Label htmlFor="paypal" className="font-medium">PayPal</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {form.watch("paymentMethod") === "credit-card" && (
                      <div className="bg-white p-6 rounded-lg border">
                        <h2 className="font-playfair text-xl mb-6">Card Details</h2>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cardName">Name on Card</Label>
                            <Input id="cardName" placeholder="Full name on card" />
                          </div>
                          
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="Card number" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input id="expiry" placeholder="MM/YY" />
                            </div>
                            
                            <div>
                              <Label htmlFor="cvc">CVC</Label>
                              <Input id="cvc" placeholder="CVC" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-white p-6 rounded-lg border">
                      <h2 className="font-playfair text-xl mb-6">Billing Address</h2>
                      
                      <div className="flex items-center mb-4">
                        <input type="checkbox" id="sameAddress" className="mr-2" checked />
                        <Label htmlFor="sameAddress">Same as shipping address</Label>
                      </div>
                    </div>
                    
                    <div>
                      <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-start">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 mt-1 mr-2"
                                  checked={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <div>
                                <Label>
                                  I agree to the{" "}
                                  <Link to="/terms" className="text-burgundy hover:underline">
                                    Terms of Service
                                  </Link>
                                  {" "}and{" "}
                                  <Link to="/privacy" className="text-burgundy hover:underline">
                                    Privacy Policy
                                  </Link>
                                </Label>
                                <FormMessage />
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
                
                <div className="flex justify-between">
                  {step === 2 && (
                    <Button 
                      type="button" 
                      variant="outline"
                      className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                      onClick={() => setStep(1)}
                    >
                      Back to Shipping
                    </Button>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="bg-burgundy hover:bg-burgundy-light text-white ml-auto"
                  >
                    {step === 1 ? "Continue to Payment" : "Complete Order"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-cream p-6 rounded-lg sticky top-24">
              <h2 className="font-playfair text-xl mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="font-medium">${item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Coupon Code */}
              {!couponApplied && (
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-grow"
                    />
                    <Button 
                      onClick={applyCoupon}
                      variant="outline"
                      className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Try "WELCOME10" for 10% off</p>
                </div>
              )}
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span className="text-burgundy">${total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Return Policy */}
              <div className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                <p className="mb-2">
                  <span className="font-medium">Free Returns:</span> All products can be returned within 
                  30 days of delivery for a full refund.
                </p>
                <p>
                  <span className="font-medium">Secure Checkout:</span> Your personal data is encrypted 
                  and securely processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
