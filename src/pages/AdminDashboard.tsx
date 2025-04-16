
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  LayoutDashboard, 
  ShoppingBag, 
  CreditCard, 
  Package, 
  Users, 
  Settings 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import StatsCards from "@/components/admin/StatsCards";
import OrdersTab from "@/components/admin/OrdersTab";
import PaymentsTab from "@/components/admin/PaymentsTab";
import ProductsTab from "@/components/admin/ProductsTab";
import { Order, Product, Payment } from "@/types/admin";
import { Separator } from "@/components/ui/separator";

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
    navigate("/admin-login");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r border-gray-200 z-10">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-burgundy flex items-center">
            <LayoutDashboard className="h-6 w-6 mr-2" />
            Admin Panel
          </h2>
        </div>
        <Separator />
        <div className="flex-1 flex flex-col pt-6">
          <nav className="flex-1 px-4 space-y-1">
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${activeTab === "orders" ? "bg-gray-100" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingBag className="h-5 w-5 mr-3 text-gray-500" />
              Orders
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${activeTab === "payments" ? "bg-gray-100" : ""}`}
              onClick={() => setActiveTab("payments")}
            >
              <CreditCard className="h-5 w-5 mr-3 text-gray-500" />
              Payments
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${activeTab === "products" ? "bg-gray-100" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              <Package className="h-5 w-5 mr-3 text-gray-500" />
              Products
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              disabled
            >
              <Users className="h-5 w-5 mr-3 text-gray-500" />
              Customers
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              disabled
            >
              <Settings className="h-5 w-5 mr-3 text-gray-500" />
              Settings
            </Button>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-burgundy text-white flex items-center justify-center">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 truncate">{user?.email || 'Admin'}</p>
              <p className="text-xs text-gray-500">Store Admin</p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleLogout} 
            className="flex items-center w-full text-sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-burgundy flex items-center">
            <LayoutDashboard className="h-5 w-5 mr-2" />
            Admin Panel
          </h2>
          <Button variant="outline" onClick={handleLogout} size="sm">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-8 mt-12 md:mt-0">
          {/* Page Header for desktop */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
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
                <TabsList className="w-full">
                  <TabsTrigger 
                    value="orders" 
                    className={`flex-1 ${activeTab === "orders" ? "bg-gray-100" : ""}`}
                    onClick={() => setActiveTab("orders")}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payments" 
                    className={`flex-1 ${activeTab === "payments" ? "bg-gray-100" : ""}`}
                    onClick={() => setActiveTab("payments")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="products" 
                    className={`flex-1 ${activeTab === "products" ? "bg-gray-100" : ""}`}
                    onClick={() => setActiveTab("products")}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Products
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="orders" className="mt-6 space-y-4">
                  <OrdersTab orders={orders} products={products} />
                </TabsContent>
                
                <TabsContent value="payments" className="mt-6 space-y-4">
                  <PaymentsTab payments={payments} />
                </TabsContent>
                
                <TabsContent value="products" className="mt-6 space-y-4">
                  <ProductsTab products={products} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
