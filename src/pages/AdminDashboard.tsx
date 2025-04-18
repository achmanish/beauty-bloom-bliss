
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Order, Product, Payment } from "@/types/admin";
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

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleLogout = async () => {
    await signOut();
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
            handleLogout={handleLogout}
            refreshData={refreshData}
          />
        </div>
      </div>
    </CartProvider>
  );
};

export default AdminDashboard;
