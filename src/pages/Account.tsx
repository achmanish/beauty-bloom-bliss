
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/admin";

// Import refactored components
import AccountSidebar from "@/components/account/AccountSidebar";
import AccountOverview from "@/components/account/AccountOverview";
import OrdersList from "@/components/account/OrdersList";
import WishlistItems from "@/components/account/WishlistItems";
import AddressList from "@/components/account/AddressList";
import PaymentMethodList from "@/components/account/PaymentMethodList";
import AuthForms from "@/components/account/AuthForms";

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
        .from('addresses')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Type assertion to match our interface
      setAddresses(data as Address[] || []);
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
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Type assertion to match our interface
      setPaymentMethods(data as PaymentMethod[] || []);
    } finally {
      setIsLoadingPayments(false);
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
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id);
      
      // Then set the selected one as default
      const { error } = await supabase
        .from('addresses')
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
        .from('addresses')
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
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user?.id);
      
      // Then set the selected one as default
      const { error } = await supabase
        .from('payment_methods')
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
        .from('payment_methods')
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
          
          <AuthForms activeTab={activeTab} setActiveTab={setActiveTab} />
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
          <AccountSidebar 
            firstName={firstName}
            email={email}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
            fetchOrders={fetchOrders}
            fetchWishlist={fetchWishlist}
            fetchAddresses={fetchAddresses}
            fetchPaymentMethods={fetchPaymentMethods}
            isLoadingOrders={isLoadingOrders}
            isLoadingWishlist={isLoadingWishlist}
            isLoadingAddresses={isLoadingAddresses}
            isLoadingPayments={isLoadingPayments}
            ordersCount={orders.length}
            wishlistCount={wishlistItems.length}
            addressesCount={addresses.length}
            paymentsCount={paymentMethods.length}
          />
          
          {/* Main Content */}
          <div className="col-span-1 lg:col-span-3">
            {/* Account Overview */}
            {activeTab === "account" && (
              <AccountOverview 
                firstName={firstName}
                lastName={lastName}
                email={email}
                orders={orders}
                isLoadingOrders={isLoadingOrders}
                onProfileUpdate={handleUpdateProfile}
                onPasswordChange={handleChangePassword}
                onViewOrder={handleViewOrder}
                onCancelOrder={handleCancelOrder}
                setActiveTab={setActiveTab}
                fetchOrders={fetchOrders}
                isUpdatingProfile={isUpdatingProfile}
                isChangingPassword={isChangingPassword}
                setFirstName={setFirstName}
                setLastName={setLastName}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
              />
            )}
            
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <OrdersList 
                orders={orders}
                isLoadingOrders={isLoadingOrders}
                onViewOrder={handleViewOrder}
                onCancelOrder={handleCancelOrder}
              />
            )}
            
            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <WishlistItems 
                wishlistItems={wishlistItems}
                isLoadingWishlist={isLoadingWishlist}
                onRemoveWishlistItem={handleRemoveWishlistItem}
                onAddToCart={handleAddToCart}
              />
            )}
            
            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <AddressList 
                addresses={addresses}
                isLoadingAddresses={isLoadingAddresses}
                onSetDefaultAddress={handleSetDefaultAddress}
                onRemoveAddress={handleRemoveAddress}
              />
            )}
            
            {/* Payment Methods Tab */}
            {activeTab === "payment" && (
              <PaymentMethodList 
                paymentMethods={paymentMethods}
                isLoadingPayments={isLoadingPayments}
                onSetDefaultPayment={handleSetDefaultPayment}
                onRemovePayment={handleRemovePayment}
              />
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Account;
