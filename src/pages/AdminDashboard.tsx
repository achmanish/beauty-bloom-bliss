
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Download, Eye, ArrowUpDown, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

// Mock orders data
const orders = [
  {
    id: "#ORD-9385",
    customer: "Rahul Sharma",
    email: "rahul.s@example.com",
    date: "2023-03-22",
    status: "completed",
    total: 5997,
    items: [
      { id: 1, name: "Vitamin C Face Serum", quantity: 1, price: 599 },
      { id: 23, name: "Onion Hair Serum", quantity: 2, price: 449 },
      { id: 62, name: "Vitamin C & SPF 50 Sunscreen", quantity: 1, price: 599 }
    ],
    paymentMethod: "Razorpay",
    paymentStatus: "paid"
  },
  {
    id: "#ORD-6295",
    customer: "Priya Patel",
    email: "priyap@example.com",
    date: "2023-03-21",
    status: "processing",
    total: 1547,
    items: [
      { id: 7, name: "Rice Water Shampoo", quantity: 1, price: 349 },
      { id: 14, name: "Onion Conditioner", quantity: 1, price: 349 },
      { id: 20, name: "Tea Tree & Neem Face Serum", quantity: 1, price: 599 }
    ],
    paymentMethod: "Credit Card",
    paymentStatus: "paid"
  },
  {
    id: "#ORD-7845",
    customer: "Ananya Singh",
    email: "ananya@example.com",
    date: "2023-03-20",
    status: "shipped",
    total: 1797,
    items: [
      { id: 3, name: "Onion Hair Oil", quantity: 1, price: 399 },
      { id: 16, name: "Onion Hair Mask", quantity: 1, price: 499 },
      { id: 23, name: "Onion Hair Serum", quantity: 2, price: 449 }
    ],
    paymentMethod: "UPI",
    paymentStatus: "paid"
  },
  {
    id: "#ORD-2354",
    customer: "Arvind Kumar",
    email: "arvind.k@example.com",
    date: "2023-03-19",
    status: "cancelled",
    total: 897,
    items: [
      { id: 2, name: "Ubtan Face Wash", quantity: 1, price: 259 },
      { id: 5, name: "Aloe Vera Gel", quantity: 1, price: 299 },
      { id: 27, name: "Tea Tree Face Toner", quantity: 1, price: 349 }
    ],
    paymentMethod: "COD",
    paymentStatus: "refunded"
  },
  {
    id: "#ORD-1122",
    customer: "Neha Verma",
    email: "nehav@example.com",
    date: "2023-03-18",
    status: "completed",
    total: 2396,
    items: [
      { id: 10, name: "Ubtan Face Mask", quantity: 1, price: 499 },
      { id: 20, name: "Tea Tree & Neem Face Serum", quantity: 1, price: 599 },
      { id: 28, name: "Vitamin C Day Cream", quantity: 1, price: 499 },
      { id: 37, name: "Vitamin C Night Cream", quantity: 1, price: 549 }
    ],
    paymentMethod: "Credit Card",
    paymentStatus: "paid"
  },
  {
    id: "#ORD-5662",
    customer: "Vikram Mehra",
    email: "vikram@example.com",
    date: "2023-03-17",
    status: "pending",
    total: 998,
    items: [
      { id: 5, name: "Aloe Vera Gel", quantity: 1, price: 299 },
      { id: 11, name: "Tea Tree Body Wash", quantity: 1, price: 299 },
      { id: 12, name: "Vitamin C Body Lotion", quantity: 1, price: 399 }
    ],
    paymentMethod: "COD",
    paymentStatus: "pending"
  },
  {
    id: "#ORD-8975",
    customer: "Divya Joshi",
    email: "divya.j@example.com",
    date: "2023-03-16",
    status: "shipped",
    total: 1798,
    items: [
      { id: 1, name: "Vitamin C Face Serum", quantity: 1, price: 599 },
      { id: 19, name: "Aloe Vera Sunscreen SPF 50", quantity: 1, price: 399 },
      { id: 62, name: "Vitamin C & SPF 50 Sunscreen", quantity: 1, price: 599 },
      { id: 41, name: "Vitamin C Lip Balm", quantity: 1, price: 199 }
    ],
    paymentMethod: "UPI",
    paymentStatus: "paid"
  },
  {
    id: "#ORD-3201",
    customer: "Ravi Gupta",
    email: "ravi.g@example.com",
    date: "2023-03-15",
    status: "completed",
    total: 2694,
    items: [
      { id: 60, name: "Tea Tree & Neem Anti-Acne Kit", quantity: 1, price: 999 },
      { id: 67, name: "Vitamin C & Niacinamide Serum", quantity: 1, price: 699 },
      { id: 70, name: "Tea Tree & Salicylic Acid Spot Gel", quantity: 1, price: 349 },
      { id: 45, name: "Tea Tree Face Scrub", quantity: 1, price: 349 },
      { id: 27, name: "Tea Tree Face Toner", quantity: 1, price: 349 }
    ],
    paymentMethod: "Credit Card",
    paymentStatus: "paid"
  }
];

// Mock payment data
const payments = [
  {
    id: "PAY-9385",
    orderId: "#ORD-9385",
    customer: "Rahul Sharma",
    date: "2023-03-22",
    amount: 5997,
    method: "Razorpay",
    status: "successful",
    transactionId: "razp_12356789"
  },
  {
    id: "PAY-6295",
    orderId: "#ORD-6295",
    customer: "Priya Patel",
    date: "2023-03-21",
    amount: 1547,
    method: "Credit Card",
    status: "successful",
    transactionId: "cc_98765432"
  },
  {
    id: "PAY-7845",
    orderId: "#ORD-7845",
    customer: "Ananya Singh",
    date: "2023-03-20",
    amount: 1797,
    method: "UPI",
    status: "successful",
    transactionId: "upi_87654321"
  },
  {
    id: "PAY-2354",
    orderId: "#ORD-2354",
    customer: "Arvind Kumar",
    date: "2023-03-19",
    amount: 897,
    method: "COD",
    status: "refunded",
    transactionId: "cod_76543210"
  },
  {
    id: "PAY-1122",
    orderId: "#ORD-1122",
    customer: "Neha Verma",
    date: "2023-03-18",
    amount: 2396,
    method: "Credit Card",
    status: "successful",
    transactionId: "cc_65432109"
  },
  {
    id: "PAY-5662",
    orderId: "#ORD-5662",
    customer: "Vikram Mehra",
    date: "2023-03-17",
    amount: 998,
    method: "COD",
    status: "pending",
    transactionId: "cod_54321098"
  },
  {
    id: "PAY-8975",
    orderId: "#ORD-8975",
    customer: "Divya Joshi",
    date: "2023-03-16",
    amount: 1798,
    method: "UPI",
    status: "successful",
    transactionId: "upi_43210987"
  },
  {
    id: "PAY-3201",
    orderId: "#ORD-3201",
    customer: "Ravi Gupta",
    date: "2023-03-15",
    amount: 2694,
    method: "Credit Card",
    status: "successful",
    transactionId: "cc_32109876"
  }
];

const AdminDashboard = () => {
  const [searchOrder, setSearchOrder] = useState("");
  const [searchPayment, setSearchPayment] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchOrder.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchOrder.toLowerCase()) || 
                         order.email.toLowerCase().includes(searchOrder.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter payments based on search and payment status
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchPayment.toLowerCase()) || 
                         payment.customer.toLowerCase().includes(searchPayment.toLowerCase()) || 
                         payment.orderId.toLowerCase().includes(searchPayment.toLowerCase());
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
        <h1 className="text-3xl font-bold text-burgundy mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Orders</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{orders.length}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Revenue</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed Orders</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{orders.filter(order => order.status === "completed").length}</p>
              <p className="text-sm text-green-600">+15% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Payments</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{payments.filter(payment => payment.status === "pending").length}</p>
              <p className="text-sm text-red-600">-5% from last month</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
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
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-gray-500">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>₹{order.total}</TableCell>
                      <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
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
                    <TableHead>Customer</TableHead>
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
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.orderId}</TableCell>
                      <TableCell>{payment.customer}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>₹{payment.amount}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1">
                          <span>{getPaymentIcon(payment.method)}</span>
                          <span>{payment.method}</span>
                        </span>
                      </TableCell>
                      <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {payment.transactionId}
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
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
