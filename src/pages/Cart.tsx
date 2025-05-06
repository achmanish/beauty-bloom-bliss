
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const Cart = () => {
  // Replace cartItems with cart from useCart
  const { cart, updateQuantity, removeFromCart, clearCart, isLoading, syncCart, cartTotal } = useCart();
  const { isLoggedIn } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  
  const shipping = cartTotal > 100 ? 0 : 10;
  const total = cartTotal + shipping - discount;
  
  // Check network status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial offline status
    setIsOffline(!window.navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === "welcome10") {
      setDiscount(cartTotal * 0.1);
      toast.success("Promo code applied: 10% off");
    } else {
      toast.error("Invalid promo code");
    }
  };
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast.success("Item removed from cart");
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-playfair text-3xl md:text-4xl text-burgundy mb-8">Your Shopping Cart</h1>
        
        {isOffline && isLoggedIn && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center">
                <WifiOff className="h-4 w-4 mr-2" />
                <span>You're currently offline. Your changes will be synchronized when you're back online.</span>
                {navigator.onLine && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-4" 
                    onClick={() => syncCart()}
                  >
                    <Wifi className="h-4 w-4 mr-2" /> Sync Now
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your cart...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-playfair mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products">
              <Button className="bg-burgundy hover:bg-burgundy-light text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg">
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-cream text-gray-600 font-medium rounded-t-lg">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>
                
                {cart.map((item) => (
                  <div key={item.id} className="border-b last:border-b-0">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                      {/* Product */}
                      <div className="col-span-6 flex items-center">
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 mr-4">
                          <img 
                            src={item.product?.image_url} 
                            alt={item.product?.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-burgundy mb-1">{item.product?.name}</h3>
                          {item.product?.size && (
                            <p className="text-sm text-gray-500">Size: {item.product.size}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="md:col-span-2 md:text-center flex justify-between md:block">
                        <span className="md:hidden">Price:</span>
                        <span>${item.product?.price?.toFixed(2) || '0.00'}</span>
                      </div>
                      
                      {/* Quantity */}
                      <div className="md:col-span-2 md:text-center flex justify-between md:block">
                        <span className="md:hidden">Quantity:</span>
                        <div className="flex items-center justify-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-4 py-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Total and Remove button */}
                      <div className="md:col-span-2 md:text-center flex justify-between items-center w-full">
                        <span className="md:hidden">Total:</span>
                        <span className="font-medium">
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </span>
                        <Button 
                          onClick={() => handleRemoveItem(item.product_id)}
                          className="ml-4 text-gray-400 hover:text-red-500 px-2 py-1 hover:bg-red-50 rounded"
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Continue Shopping */}
                <div className="pt-6 pb-4 flex justify-between">
                  <Link to="/products" className="text-burgundy hover:underline flex items-center" onClick={() => window.scrollTo(0, 0)}>
                    ← Continue Shopping
                  </Link>
                  <Button 
                    variant="outline" 
                    className="border-red-300 text-red-500 hover:bg-red-50"
                    onClick={() => {
                      if (confirm("Are you sure you want to clear your cart?")) {
                        clearCart();
                        toast.success("Cart cleared");
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-cream p-6 rounded-lg sticky top-24">
                <h2 className="font-playfair text-xl mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span className="text-burgundy">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-grow"
                    />
                    <Button 
                      onClick={applyPromoCode}
                      variant="outline"
                      className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Try "WELCOME10" for 10% off</p>
                </div>
                
                {/* Checkout Button */}
                <Link to="/checkout" onClick={() => window.scrollTo(0, 0)}>
                  <Button className="w-full bg-burgundy hover:bg-burgundy-light text-white">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                {/* Secure Checkout */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Secure Checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
