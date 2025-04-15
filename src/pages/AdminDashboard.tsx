import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Download, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string | null;
  stock: number;
}

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  transaction_id: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  // Auth-related state
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Data-related state
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingPayments: 0,
  });

  // UI state
  const [searchOrder, setSearchOrder] = useState("");
  const [searchPayment, setSearchPayment] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch orders with order items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `);

      if (ordersError) throw ordersError;
      
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select();

      if (productsError) throw productsError;

      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select();

      if (paymentsError) throw paymentsError;

      // Update state with fetched data
      setOrders(ordersData || []);
      setProducts(productsData || []);
      setPayments(paymentsData || []);

      // Calculate stats
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

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      toast({
        title: "Order updated",
        description: `Order ${orderId} status changed to ${status}`,
      });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Update failed",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchOrder.toLowerCase()) || 
                         (order.user_id && order.user_id.toLowerCase().includes(searchOrder.toLowerCase()));
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter payments based on search and payment status
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchPayment.toLowerCase()) || 
                         (payment.order_id && payment.order_id.toLowerCase().includes(searchPayment.toLowerCase()));
    const matchesStatus = paymentFilter === "all" || payment.status === paymentFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-purple-500">Shipped</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
      case "successful":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "refunded":
        return <Badge className="bg-blue-500">Refunded</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "Credit Card":
        return "💳";
      case "UPI":
        return "📱";
      case "Razorpay":
        return "🔐";
      case "COD":
        return "💰";
      default:
        return "💲";
    }
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Orders</CardTitle>
                  <CardDescription>All Time</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.totalOrders}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Revenue</CardTitle>
                  <CardDescription>All Time</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Completed Orders</CardTitle>
                  <CardDescription>All Time</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.completedOrders}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pending Payments</CardTitle>
                  <CardDescription>All Time</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.pendingPayments}</p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex-1 w-full md:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search orders..."
                        className="pl-10 w-full"
                        value={searchOrder}
                        onChange={(e) => setSearchOrder(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-md border bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.user_id ? order.user_id.substring(0, 8) : 'Guest'}</p>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>₹{Number(order.total_amount).toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </SheetTrigger>
                              <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                                <SheetHeader>
                                  <SheetTitle>Order Details</SheetTitle>
                                  <SheetDescription>
                                    Order ID: {order.id.substring(0, 8)}
                                  </SheetDescription>
                                </SheetHeader>
                                <div className="py-4">
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-medium">Status</h3>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Select 
                                          defaultValue={order.status}
                                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h3 className="font-medium">Order Items</h3>
                                      <div className="mt-1 space-y-2">
                                        {order.order_items && order.order_items.map((item: any) => (
                                          <div key={item.id} className="flex justify-between border-b pb-2">
                                            <div>
                                              <p>{products.find(p => p.id === item.product_id)?.name || 'Unknown Product'}</p>
                                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p>₹{Number(item.price_at_time).toLocaleString()}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h3 className="font-medium">Shipping Address</h3>
                                      <p className="mt-1 text-gray-700">{order.shipping_address || 'No address provided'}</p>
                                    </div>
                                    
                                    <div className="flex justify-between pt-2 border-t">
                                      <p className="font-medium">Total Amount:</p>
                                      <p className="font-bold">₹{Number(order.total_amount).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>
                              </SheetContent>
                            </Sheet>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {filteredOrders.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-gray-500">No orders found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="payments" className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex-1 w-full md:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search payments..."
                        className="pl-10 w-full"
                        value={searchPayment}
                        onChange={(e) => setSearchPayment(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="successful">Successful</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-md border bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Payment ID</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Transaction ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id.substring(0, 8)}</TableCell>
                          <TableCell>{payment.order_id ? payment.order_id.substring(0, 8) : 'N/A'}</TableCell>
                          <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>₹{Number(payment.amount).toLocaleString()}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1">
                              <span>{getPaymentIcon(payment.payment_method || 'Unknown')}</span>
                              <span>{payment.payment_method || 'Unknown'}</span>
                            </span>
                          </TableCell>
                          <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            {payment.transaction_id || 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {filteredPayments.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-gray-500">No payments found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="products" className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Product Management</h2>
                  <Button>Add New Product</Button>
                </div>
                
                <div className="rounded-md border bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category || 'Uncategorized'}</TableCell>
                          <TableCell>₹{Number(product.price).toLocaleString()}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {products.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-gray-500">No products found</p>
                    </div>
                  )}
                </div>
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
