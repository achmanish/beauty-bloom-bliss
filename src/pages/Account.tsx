
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
import { toast } from "@/components/ui/sonner";
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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
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
  Clock
} from "lucide-react";

// Mock data types
interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  total: string;
  items: number;
}

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: string;
  inStock: boolean;
}

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'Credit Card' | 'PayPal';
  lastFour?: string;
  expiryDate?: string;
  cardName?: string;
  email?: string;
  isDefault: boolean;
}

const Account = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  
  // Mock data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "#ORD-12345",
      date: "March 15, 2023",
      status: "Delivered",
      total: "$154.00",
      items: 2
    },
    {
      id: "#ORD-12346",
      date: "April 2, 2023",
      status: "Processing",
      total: "$89.00",
      items: 1
    }
  ]);
  
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: "1",
      name: "Hydrating Face Cream",
      image: "/placeholder.svg",
      price: "$49.99",
      inStock: true
    },
    {
      id: "2",
      name: "Vitamin C Serum",
      image: "/placeholder.svg",
      price: "$39.99",
      inStock: true
    },
    {
      id: "3",
      name: "Rose Water Toner",
      image: "/placeholder.svg",
      price: "$24.99",
      inStock: false
    }
  ]);
  
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Home",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      isDefault: true
    }
  ]);
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "Credit Card",
      lastFour: "4242",
      expiryDate: "09/25",
      cardName: "John Doe",
      isDefault: true
    }
  ]);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  
  useEffect(() => {
    // If user logs out or is not logged in, we should show the login tab
    if (!isLoggedIn) {
      setActiveTab("login");
    }
  }, [isLoggedIn]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login functionality
    if (loginEmail && loginPassword) {
      toast.success("Successfully logged in");
      setActiveTab("account");
    } else {
      toast.error("Please fill in all fields");
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration functionality
    if (registerEmail && registerPassword && registerName) {
      toast.success("Account created successfully");
      setActiveTab("account");
    } else {
      toast.error("Please fill in all fields");
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    toast.success("Successfully logged out");
    navigate("/");
  };
  
  const handleViewOrder = (orderId: string) => {
    toast.info(`Viewing order details for ${orderId}`);
    // In a real app, navigate to order detail page
    // navigate(`/orders/${orderId}`);
  };
  
  const handleAddToCart = (itemId: string) => {
    toast.success("Item added to cart");
  };
  
  const handleRemoveWishlistItem = (itemId: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
    toast.success("Item removed from wishlist");
  };
  
  const handleSetDefaultAddress = (addressId: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === addressId
    })));
    toast.success("Default address updated");
  };
  
  const handleRemoveAddress = (addressId: string) => {
    setAddresses(addresses.filter(address => address.id !== addressId));
    toast.success("Address removed");
  };
  
  const handleSetDefaultPayment = (paymentId: string) => {
    setPaymentMethods(paymentMethods.map(payment => ({
      ...payment,
      isDefault: payment.id === paymentId
    })));
    toast.success("Default payment method updated");
  };
  
  const handleRemovePayment = (paymentId: string) => {
    setPaymentMethods(paymentMethods.filter(payment => payment.id !== paymentId));
    toast.success("Payment method removed");
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
                      >
                        Sign In
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
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          required
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
                      >
                        Create Account
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
                <h2 className="font-playfair text-xl mb-2">Welcome, {registerName || "User"}!</h2>
                <p className="text-sm text-gray-600">{loginEmail || registerEmail || user?.email}</p>
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
                  onClick={() => setActiveTab("orders")}
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
                  onClick={() => setActiveTab("wishlist")}
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
                  onClick={() => setActiveTab("addresses")}
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
                  onClick={() => setActiveTab("payment")}
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
                        <p className="mb-1 font-medium">{registerName || "User"}</p>
                        <p className="mb-4 text-gray-600">{loginEmail || registerEmail || user?.email}</p>
                        <Button variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                          Edit Profile
                        </Button>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg mb-4">Address Book</h3>
                        {addresses.length > 0 ? (
                          <div>
                            <div className="mb-2">
                              <p className="font-medium">Default Address:</p>
                              <p>{addresses.find(a => a.isDefault)?.street}</p>
                              <p>{addresses.find(a => a.isDefault)?.city}, {addresses.find(a => a.isDefault)?.state} {addresses.find(a => a.isDefault)?.zip}</p>
                              <p>{addresses.find(a => a.isDefault)?.country}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                              onClick={() => setActiveTab("addresses")}
                            >
                              Manage Addresses
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-500 mb-4">You have no saved addresses.</p>
                            <Button 
                              variant="outline" 
                              className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                              onClick={() => setActiveTab("addresses")}
                            >
                              Add Address
                            </Button>
                          </div>
                        )}
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
                        onClick={() => setActiveTab("orders")}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
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
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>
                                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                                    order.status === 'Delivered' 
                                      ? 'bg-green-100 text-green-800' 
                                      : order.status === 'Processing'
                                      ? 'bg-blue-100 text-blue-800'
                                      : order.status === 'Shipped'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {order.status}
                                  </span>
                                </TableCell>
                                <TableCell>{order.total}</TableCell>
                                <TableCell>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleViewOrder(order.id)}
                                    className="text-burgundy hover:text-burgundy-light hover:bg-rose-light"
                                  >
                                    <Eye className="h-4 w-4 mr-1" /> View
                                  </Button>
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
            
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View and manage your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
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
                            <TableHead>Items</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>{order.id}</TableCell>
                              <TableCell>{order.date}</TableCell>
                              <TableCell>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                                  order.status === 'Delivered' 
                                    ? 'bg-green-100 text-green-800' 
                                    : order.status === 'Processing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : order.status === 'Shipped'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {order.status}
                                </span>
                              </TableCell>
                              <TableCell>{order.total}</TableCell>
                              <TableCell>{order.items} {order.items === 1 ? 'item' : 'items'}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleViewOrder(order.id)}
                                  className="text-burgundy hover:text-burgundy-light hover:bg-rose-light"
                                >
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Wishlist</CardTitle>
                    <Link to="/wishlist">
                      <Button variant="link" className="text-burgundy p-0 h-auto">
                        View Full Wishlist <ExternalLink className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <CardDescription>Items you've saved for later</CardDescription>
                </CardHeader>
                <CardContent>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-500 mb-4">Save items you love to your wishlist</p>
                      <Button asChild className="bg-burgundy hover:bg-burgundy-light">
                        <Link to="/products">Explore Products</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="border rounded-lg shadow-sm overflow-hidden">
                          <div className="relative h-40 bg-gray-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            <button
                              onClick={() => handleRemoveWishlistItem(item.id)}
                              className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:bg-gray-100"
                            >
                              <X className="h-3 w-3 text-burgundy" />
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium mb-1 line-clamp-1">{item.name}</h3>
                            <p className="text-burgundy font-medium mb-2">{item.price}</p>
                            <div className="flex justify-between items-center">
                              <span className={item.inStock ? "text-green-600 text-sm" : "text-red-500 text-sm"}>
                                {item.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                              <Button
                                size="sm"
                                disabled={!item.inStock}
                                className="bg-burgundy hover:bg-burgundy-light text-white"
                                onClick={() => handleAddToCart(item.id)}
                              >
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                {wishlistItems.length > 0 && (
                  <CardFooter className="flex justify-center">
                    <Button asChild variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                      <Link to="/wishlist">View All Wishlist Items</Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}
            
            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <Card>
                <CardHeader>
                  <CardTitle>Address Book</CardTitle>
                  <CardDescription>Manage your shipping addresses</CardDescription>
                </CardHeader>
                <CardContent>
                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No addresses yet</h3>
                      <p className="text-gray-500 mb-4">Add a shipping address for faster checkout</p>
                      <Button className="bg-burgundy hover:bg-burgundy-light">
                        <Plus className="mr-2 h-4 w-4" /> Add New Address
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {addresses.map((address) => (
                          <div key={address.id} className={`border rounded-lg p-4 ${address.isDefault ? 'border-burgundy' : ''}`}>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <h3 className="font-medium">{address.name}</h3>
                                {address.isDefault && (
                                  <span className="ml-2 text-xs bg-rose text-burgundy px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="space-x-1">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                  </svg>
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleRemoveAddress(address.id)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  </svg>
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </div>
                            <div className="text-gray-600 mb-4">
                              <p>{address.street}</p>
                              <p>{address.city}, {address.state} {address.zip}</p>
                              <p>{address.country}</p>
                            </div>
                            {!address.isDefault && (
                              <Button 
                                variant="outline" 
                                className="w-full text-burgundy border-burgundy hover:bg-burgundy hover:text-white"
                                onClick={() => handleSetDefaultAddress(address.id)}
                              >
                                Set as Default
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button className="bg-burgundy hover:bg-burgundy-light">
                        <Plus className="mr-2 h-4 w-4" /> Add New Address
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Payment Methods Tab */}
            {activeTab === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No payment methods</h3>
                      <p className="text-gray-500 mb-4">Add a payment method for faster checkout</p>
                      <Button className="bg-burgundy hover:bg-burgundy-light">
                        <Plus className="mr-2 h-4 w-4" /> Add Payment Method
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="space-y-4 mb-6">
                        {paymentMethods.map((payment) => (
                          <div key={payment.id} className={`border rounded-lg p-4 ${payment.isDefault ? 'border-burgundy' : ''}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center mb-2">
                                  {payment.type === "Credit Card" ? (
                                    <CreditCard className="mr-2 h-5 w-5 text-burgundy" />
                                  ) : (
                                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect width="24" height="24" rx="4" fill="#0070E0" />
                                      <path d="M7.5 15.5H16.5V17H7.5V15.5Z" fill="white" />
                                      <path d="M7.5 13H16.5V14.5H7.5V13Z" fill="white" />
                                      <path d="M16.5 8.5C16.5 6.84 15.16 5.5 13.5 5.5H10.5C8.84 5.5 7.5 6.84 7.5 8.5V11H16.5V8.5Z" fill="white" />
                                    </svg>
                                  )}
                                  <h3 className="font-medium flex items-center">
                                    {payment.type === "Credit Card" ? (
                                      <>
                                        Credit Card ending in {payment.lastFour}
                                        {payment.isDefault && (
                                          <span className="ml-2 text-xs bg-rose text-burgundy px-2 py-0.5 rounded-full">
                                            Default
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        PayPal - {payment.email}
                                        {payment.isDefault && (
                                          <span className="ml-2 text-xs bg-rose text-burgundy px-2 py-0.5 rounded-full">
                                            Default
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </h3>
                                </div>
                                {payment.type === "Credit Card" && (
                                  <div className="text-gray-600">
                                    <p>{payment.cardName}</p>
                                    <p>Expires: {payment.expiryDate}</p>
                                  </div>
                                )}
                              </div>
                              <div className="space-x-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0" 
                                  onClick={() => handleRemovePayment(payment.id)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  </svg>
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </div>
                            {!payment.isDefault && (
                              <Button 
                                variant="outline" 
                                className="w-full mt-4 text-burgundy border-burgundy hover:bg-burgundy hover:text-white"
                                onClick={() => handleSetDefaultPayment(payment.id)}
                              >
                                Set as Default
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button className="bg-burgundy hover:bg-burgundy-light">
                        <Plus className="mr-2 h-4 w-4" /> Add Payment Method
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Account;
