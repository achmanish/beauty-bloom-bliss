import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  UserRound, 
  Package, 
  Heart, 
  CreditCard, 
  LogOut,
  Home,
  Check,
  Plus,
  Eye,
  ExternalLink,
  MapPin,
  ShoppingBag,
  X,
  AlertCircle,
  Key,
  Save
} from "lucide-react";
import { Order } from "@/types/admin";
import type { Tables } from "@/integrations/supabase/types";

// Define types based on our actual database tables
interface WishlistItem {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

interface Address {
  id: string;
  user_id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

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

const Account = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, signOut, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  
  // User data state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  
  useEffect(() => {
    // If user logs out or is not logged in, we should show the login tab
    if (!isLoggedIn) {
      setActiveTab("login");
    } else {
      // Load user data
      loadUserData();
      
      // Load data based on active tab to minimize unnecessary API calls
      if (activeTab === "orders") {
        fetchOrders();
      } else if (activeTab === "wishlist") {
        fetchWishlist();
      } else if (activeTab === "addresses") {
        fetchAddresses();
      } else if (activeTab === "payment") {
        fetchPaymentMethods();
      }
    }
  }, [isLoggedIn, activeTab]);
  
  const loadUserData = () => {
    if (user?.user_metadata) {
      setFirstName(user.user_metadata.first_name || "");
      setLastName(user.user_metadata.last_name || "");
      setEmail(user.email || "");
    }
  };
  
  const fetchOrders = async () => {
    if (!user) return;
    
    setIsLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          status,
          total_amount,
          shipping_address,
          created_at,
          order_items (
            id,
            order_id,
            product_id,
            quantity,
            price_at_time
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load your orders");
    } finally {
      setIsLoadingOrders(false);
    }
  };
  
  const fetchWishlist = async () => {
    if (!user) return;
    
    setIsLoadingWishlist(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          user_id,
          product_id,
          created_at,
          product:products (
            id,
            name,
            price,
            image_url,
            stock
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setWishlistItems(data || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load your wishlist");
    } finally {
      setIsLoadingWishlist(false);
    }
  };
  
  const fetchAddresses = async () => {
    if (!user) return;
    
    setIsLoadingAddresses(true);
    try {
      const { data, error } = await supabase
        .from<Address>('addresses')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setAddresses(data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load your addresses");
    } finally {
      setIsLoadingAddresses(false);
    }
  };
  
  const fetchPaymentMethods = async () => {
    if (!user) return;
    
    setIsLoadingPayments(true);
    try {
      const { data, error } = await supabase
        .from<PaymentMethod>('payment_methods')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setPaymentMethods(data || []);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("Failed to load your payment methods");
    } finally {
      setIsLoadingPayments(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });
      
      if (error) throw error;
      
      toast.success("Successfully logged in");
      setActiveTab("account");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to log in");
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerEmail || !registerPassword || !registerFirstName) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsRegistering(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            first_name: registerFirstName,
            last_name: registerLastName
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Account created successfully. Please check your email for verification.");
      setActiveTab("login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsRegistering(false);
    }
  };
  
  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    
    try {
      const { error } = await updateProfile({
        firstName,
        lastName
      });
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const { error } = await changePassword(newPassword);
      
      if (error) throw error;
      
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Password change error:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    toast.success("Successfully logged out");
    navigate("/");
  };
  
  const handleViewOrder = (orderId: string) => {
    // In a real app, navigate to order detail page
    navigate(`/order/${orderId}`);
  };
  
  const handleCancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'Cancelled' })
        .eq('id', orderId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'Cancelled' } : order
      ));
      
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };
  
  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast.error("Please log in to add items to cart");
      return;
    }
    
    try {
      // In a real app, you would add to cart table
      // For now, just show success message
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };
  
  const handleRemoveWishlistItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing wishlist item:", error);
      toast.error("Failed to remove item from wishlist");
    }
  };
  
  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      // First set all addresses to non-default
      await supabase
        .from<Address>('addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id);
      
      // Then set the selected one as default
      const { error } = await supabase
        .from<Address>('addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setAddresses(addresses.map(address => ({
        ...address,
        is_default: address.id === addressId
      })));
      
      toast.success("Default address updated");
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to update default address");
    }
  };
  
  const handleRemoveAddress = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from<Address>('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setAddresses(addresses.filter(address => address.id !== addressId));
      toast.success("Address removed");
    } catch (error) {
      console.error("Error removing address:", error);
      toast.error("Failed to remove address");
    }
  };
  
  const handleSetDefaultPayment = async (paymentId: string) => {
    try {
      // First set all payment methods to non-default
      await supabase
        .from<PaymentMethod>('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user?.id);
      
      // Then set the selected one as default
      const { error } = await supabase
        .from<PaymentMethod>('payment_methods')
        .update({ is_default: true })
        .eq('id', paymentId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setPaymentMethods(paymentMethods.map(payment => ({
        ...payment,
        is_default: payment.id === paymentId
      })));
      
      toast.success("Default payment method updated");
    } catch (error) {
      console.error("Error setting default payment method:", error);
      toast.error("Failed to update default payment method");
    }
  };
  
  const handleRemovePayment = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from<PaymentMethod>('payment_methods')
        .delete()
        .eq('id', paymentId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setPaymentMethods(paymentMethods.filter(payment => payment.id !== paymentId));
      toast.success("Payment method removed");
    } catch (error) {
      console.error("Error removing payment method:", error);
      toast.error("Failed to remove payment method");
    }
  };
  
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <div className="container mx-auto px-4 py-10">
          <h1 className="font-playfair text-3xl md:text-4xl text-burgundy mb-8">
            Account
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <div className="bg-white p-8 rounded-lg border">
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center">
                          <Label htmlFor="password">Password</Label>
                          <Link to="/forgot-password" className="text-sm text-burgundy hover:underline">
                            Forgot Password?
                          </Link>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember me
                        </label>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-burgundy hover:bg-burgundy-light text-white"
                        disabled={isLoggingIn}
                      >
                        {isLoggingIn ? "Signing in..." : "Sign In"}
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>
              
              <TabsContent value="register">
                <div className="bg-white p-8 rounded-lg border">
                  <form onSubmit={handleRegister}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={registerFirstName}
                          onChange={(e) => setRegisterFirstName(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={registerLastName}
                          onChange={(e) => setRegisterLastName(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="registerEmail">Email</Label>
                        <Input 
                          id="registerEmail" 
                          type="email" 
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="registerPassword">Password</Label>
                        <Input 
                          id="registerPassword" 
                          type="password" 
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Password must be at least 8 characters long with a number and special character.
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" required />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <Link to="/terms" className="text-burgundy hover:underline">
                            Terms of Service
                          </Link>
                          {" "}and{" "}
                          <Link to="/privacy" className="text-burgundy hover:underline">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-burgundy hover:bg-burgundy-light text-white"
                        disabled={isRegistering}
                      >
                        {isRegistering ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-playfair text-3xl md:text-4xl text-burgundy mb-8">
          My Account
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar Navigation */}
          <div className="col-span-1">
            <div className="bg-cream p-6 rounded-lg sticky top-24">
              <div className="mb-6">
                <h2 className="font-playfair text-xl mb-2">Welcome, {firstName || "User"}!</h2>
                <p className="text-sm text-gray-600">{email}</p>
              </div>
              
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab("account")}
                  className={`flex items-center space-x-2 p-2 rounded-md w-full transition-colors ${
                    activeTab === "account" 
                      ? "bg-rose text-burgundy" 
                      : "hover:bg-rose-light text-gray-700 hover:text-burgundy"
                  }`}
                >
                  <UserRound className="w-5 h-5" />
                  <span>Account Overview</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab("orders");
                    if (!isLoadingOrders && orders.length === 0) {
                      fetchOrders();
                    }
                  }}
                  className={`flex items-center space-x-2 p-2 rounded-md w-full transition-colors ${
                    activeTab === "orders" 
                      ? "bg-rose text-burgundy" 
                      : "hover:bg-rose-light text-gray-700 hover:text-burgundy"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Orders</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab("wishlist");
                    if (!isLoadingWishlist && wishlistItems.length === 0) {
                      fetchWishlist();
                    }
                  }}
                  className={`flex items-center space-x-2 p-2 rounded-md w-full transition-colors ${
                    activeTab === "wishlist" 
                      ? "bg-rose text-burgundy" 
                      : "hover:bg-rose-light text-gray-700 hover:text-burgundy"
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab("addresses");
                    if (!isLoadingAddresses && addresses.length === 0) {
                      fetchAddresses();
                    }
                  }}
                  className={`flex items-center space-x-2 p-2 rounded-md w-full transition-colors ${
                    activeTab === "addresses" 
                      ? "bg-rose text-burgundy" 
                      : "hover:bg-rose-light text-gray-700 hover:text-burgundy"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Addresses</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab("payment");
                    if (!isLoadingPayments && paymentMethods.length === 0) {
                      fetchPaymentMethods();
                    }
                  }}
                  className={`flex items-center space-x-2 p-2 rounded-md w-full transition-colors ${
                    activeTab === "payment" 
                      ? "bg-rose text-burgundy" 
                      : "hover:bg-rose-light text-gray-700 hover:text-burgundy"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Methods</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 p-2 hover:bg-rose-light text-gray-700 hover:text-burgundy rounded-md w-full transition-colors mt-6"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-span-1 lg:col-span-3">
            {/* Account Overview */}
            {activeTab === "account" && (
              <div>
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Update your account information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-medium text-lg mb-4">Profile Information</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input 
                              id="firstName" 
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input 
                              id="lastName" 
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              value={email}
                              disabled
                              className="bg-gray-50"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Email cannot be changed
                            </p>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                            onClick={handleUpdateProfile}
                            disabled={isUpdatingProfile}
                          >
                            {isUpdatingProfile ? (
                              <>Saving...</>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg mb-4">Security</h3>
                        <div className="space-y-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                              >
                                <Key className="w-4 h-4 mr-2" />
                                Change Password
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Change Password</DialogTitle>
                                <DialogDescription>
                                  Update your password to a new secure one
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4 py-4">
                                <div>
                                  <Label htmlFor="newPassword">New Password</Label>
                                  <Input 
                                    id="newPassword" 
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                  <Input 
                                    id="confirmPassword" 
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                  />
                                </div>
                                
                                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                                  <div className="flex items-center text-red-500 text-sm">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Passwords don't match
                                  </div>
                                )}
                              </div>
                              
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setNewPassword("");
                                    setConfirmPassword("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleChangePassword}
                                  disabled={isChangingPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                                  className="bg-burgundy hover:bg-burgundy-light"
                                >
                                  {isChangingPassword ? "Updating..." : "Update Password"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <div className="p-4 border rounded-md bg-gray-50 mt-6">
                            <h4 className="font-medium mb-2">Account Security Tips</h4>
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start">
                                <Check className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                                Use a strong, unique password
                              </li>
                              <li className="flex items-start">
                                <Check className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                                Never share your password with others
                              </li>
                              <li className="flex items-start">
                                <Check className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                                Update your password regularly
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Orders</CardTitle>
                      <Button 
                        variant="link" 
                        className="text-burgundy p-0 h-auto"
                        onClick={() => {
                          setActiveTab("orders");
                          fetchOrders();
                        }}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingOrders ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy mx-auto"></div>
                        <p className="mt-2 text-gray-500">Loading your orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-4">When you place your first order, it will appear here</p>
                        <Button asChild className="bg-burgundy hover:bg-burgundy-light">
                          <Link to="/products">Start Shopping</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.slice(0, 2).map((order) => (
                              <TableRow key={order.id}>
                                <TableCell>#{order.id.slice(0, 8)}</TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>${order.total_amount}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleViewOrder(order.id)}
                                    >
                                      <Eye className="w-4 h-4" />
                                      <span className="sr-only">View</span>
                                    </Button>
                                    
                                    {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => handleCancelOrder(order.id)}
                                      >
                                        <X className="w-4 h-4" />
                                        <span className="sr-only">Cancel</span>
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Other tab content would go here */}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Account;
