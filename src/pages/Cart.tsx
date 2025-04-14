
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock cart items
const initialCartItems = [
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

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping - discount;
  
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };
  
  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === "welcome10") {
      setDiscount(subtotal * 0.1);
      toast.success("Promo code applied: 10% off");
    } else {
      toast.error("Invalid promo code");
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-playfair text-3xl md:text-4xl text-burgundy mb-8">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
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
                
                {cartItems.map((item) => (
                  <div key={item.id} className="border-b last:border-b-0">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                      {/* Product */}
                      <div className="col-span-6 flex items-center">
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 mr-4">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-burgundy mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-500">Size: {item.size}</p>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-sm text-red-500 flex items-center mt-2 md:hidden"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="md:col-span-2 md:text-center flex justify-between md:block">
                        <span className="md:hidden">Price:</span>
                        <span>${item.price}</span>
                      </div>
                      
                      {/* Quantity */}
                      <div className="md:col-span-2 md:text-center flex justify-between md:block">
                        <span className="md:hidden">Quantity:</span>
                        <div className="flex items-center justify-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-4 py-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="md:col-span-2 md:text-center flex justify-between md:block">
                        <span className="md:hidden">Total:</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      {/* Remove button (desktop) */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 hidden md:block justify-self-end"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Continue Shopping */}
                <div className="pt-6 pb-4">
                  <Link to="/products" className="text-burgundy hover:underline flex items-center">
                    ← Continue Shopping
                  </Link>
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
                    <span>${subtotal.toFixed(2)}</span>
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
                <Link to="/checkout">
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
