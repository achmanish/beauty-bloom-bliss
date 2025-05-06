
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Order, Product, Payment, Category, Coupon, FlashSale } from "@/types/admin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileHeader from "@/components/admin/AdminMobileHeader";
import AdminDashboardContent from "@/components/admin/AdminDashboardContent";
import { CartProvider } from "@/context/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger a refresh of data
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch existing data
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

      // Fetch new data
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select();

      if (categoriesError) throw categoriesError;

      const { data: couponsData, error: couponsError } = await supabase
        .from('coupons')
        .select();

      if (couponsError) throw couponsError;

      const { data: flashSalesData, error: flashSalesError } = await supabase
        .from('flash_sales')
        .select();

      if (flashSalesError) throw flashSalesError;

      setOrders(ordersData || []);
      setProducts(productsData || []);
      setPayments(paymentsData || []);
      setCategories(categoriesData || []);
      setCoupons(couponsData || []);
      setFlashSales(flashSalesData || []);

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

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  // Single logout function used by all components
  const handleLogout = async () => {
    console.log("Logging out admin user");
    await signOut();
    
    // Clear the mock session if it exists
    localStorage.removeItem("admin_authenticated");
    
    navigate("/admin-login");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Admin Sidebar Component - Hidden on mobile */}
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user} 
          onLogout={handleLogout} 
        />
        
        {/* Mobile Header Component - Visible only on mobile */}
        <AdminMobileHeader onLogout={handleLogout} />
        
        {/* Main Content */}
        <div className="flex-1 md:ml-64 pt-4 md:pt-0">
          <AdminDashboardContent
            loading={loading}
            stats={stats}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            orders={orders}
            products={products}
            payments={payments}
            categories={categories}
            coupons={coupons}
            flashSales={flashSales}
            handleLogout={handleLogout}
            refreshData={refreshData}
          />
        </div>
      </div>
    </CartProvider>
  );
};

export default AdminDashboard;
