
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatsCards from "@/components/admin/StatsCards";
import OrdersTab from "@/components/admin/OrdersTab";
import PaymentsTab from "@/components/admin/PaymentsTab";
import ProductsTab from "@/components/admin/ProductsTab";
import { Order, Product, Payment } from "@/types/admin";

const AdminDashboard = () => {
  const { signOut } = useAuth();
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
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg">Loading data...</p>
          </div>
        ) : (
          <>
            <StatsCards stats={stats} />
            
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders">
                <OrdersTab orders={orders} products={products} />
              </TabsContent>
              
              <TabsContent value="payments">
                <PaymentsTab payments={payments} />
              </TabsContent>
              
              <TabsContent value="products">
                <ProductsTab products={products} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
