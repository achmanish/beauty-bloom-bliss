
import { useState, useEffect, createContext, useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import StatsCards from "@/components/admin/StatsCards";
import OrdersTab from "@/components/admin/OrdersTab";
import PaymentsTab from "@/components/admin/PaymentsTab";
import ProductsTab from "@/components/admin/ProductsTab";
import { Order, Product, Payment } from "@/types/admin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileHeader from "@/components/admin/AdminMobileHeader";

// Create a context for cart updates
export const CartContext = createContext({
  cartCount: 0,
  updateCartCount: (count: number) => {},
});

// Hook to use cart context
export const useCartContext = () => useContext(CartContext);

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  
  // Cart state for real-time updates
  const [cartCount, setCartCount] = useState(() => {
    // Initialize from localStorage if available
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        return JSON.parse(savedCart).length;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  });

  // Function to update cart count
  const updateCartCount = (count: number) => {
    setCartCount(count);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `);

      if (ordersError) throw ordersError;
      
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select();

      if (productsError) throw productsError;

      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select();

      if (paymentsError) throw paymentsError;

      setOrders(ordersData || []);
      setProducts(productsData || []);
      setPayments(paymentsData || []);

      const totalRevenue = paymentsData?.reduce((sum, payment) => 
        payment.status === 'successful' ? sum + Number(payment.amount) : sum, 0) || 0;
      
      setStats({
        totalOrders: ordersData?.length || 0,
        totalRevenue,
        completedOrders: ordersData?.filter(order => order.status === 'completed').length || 0,
        pendingPayments: paymentsData?.filter(payment => payment.status === 'pending').length || 0,
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Listen for localStorage changes to update cart count
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        try {
          setCartCount(JSON.parse(savedCart).length);
        } catch (e) {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin-login");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Tabs that will be shown based on the active tab
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrdersTab orders={orders} products={products} />;
      case "payments":
        return <PaymentsTab payments={payments} />;
      case "products":
        return <ProductsTab products={products} />;
      case "customers":
        return (
          <div className="p-6 bg-white rounded-md border">
            <p className="text-center text-gray-500">Customers management coming soon</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-6 bg-white rounded-md border">
            <p className="text-center text-gray-500">Settings panel coming soon</p>
          </div>
        );
      default:
        return <OrdersTab orders={orders} products={products} />;
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Admin Sidebar Component */}
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user} 
          onLogout={handleLogout} 
        />
        
        {/* Mobile Header Component */}
        <AdminMobileHeader onLogout={handleLogout} />
        
        {/* Main Content */}
        <div className="flex-1 md:ml-64 pt-4 md:pt-0">
          <div className="container mx-auto px-4 py-8 mt-12 md:mt-0">
            {/* Page Header for desktop */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy"></div>
                  <p className="mt-4 text-gray-600">Loading dashboard data...</p>
                </div>
              </div>
            ) : (
              <>
                <StatsCards stats={stats} />
                
                {/* Mobile Tabs */}
                <div className="block md:hidden mb-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full">
                      <TabsTrigger value="orders" className="flex-1">
                        <span className="flex items-center">Orders</span>
                      </TabsTrigger>
                      <TabsTrigger value="payments" className="flex-1">
                        <span className="flex items-center">Payments</span>
                      </TabsTrigger>
                      <TabsTrigger value="products" className="flex-1">
                        <span className="flex items-center">Products</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                {/* Tab Content */}
                <div className="mt-6 space-y-4">
                  {renderActiveTabContent()}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </CartContext.Provider>
  );
};

export default AdminDashboard;
