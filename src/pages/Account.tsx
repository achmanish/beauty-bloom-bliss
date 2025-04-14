
import { useState } from "react";
import { Link } from "react-router-dom";
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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  UserRound, 
  Package, 
  Heart, 
  CreditCard, 
  LogOut,
  Home
} from "lucide-react";

const Account = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login functionality
    if (loginEmail && loginPassword) {
      setIsLoggedIn(true);
      toast.success("Successfully logged in");
    } else {
      toast.error("Please fill in all fields");
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration functionality
    if (registerEmail && registerPassword && registerName) {
      setIsLoggedIn(true);
      toast.success("Account created successfully");
    } else {
      toast.error("Please fill in all fields");
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    toast.success("Successfully logged out");
  };
  
  // Mock order data
  const orders = [
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
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-playfair text-3xl md:text-4xl text-burgundy mb-8">
          {isLoggedIn ? "My Account" : "Account"}
        </h1>
        
        {!isLoggedIn ? (
          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="login">
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar Navigation */}
            <div className="col-span-1">
              <div className="bg-cream p-6 rounded-lg sticky top-24">
                <div className="mb-6">
                  <h2 className="font-playfair text-xl mb-2">Welcome, {registerName || "User"}!</h2>
                  <p className="text-sm text-gray-600">{loginEmail || registerEmail}</p>
                </div>
                
                <nav className="space-y-2">
                  <Link 
                    to="/account" 
                    className="flex items-center space-x-2 p-2 bg-rose text-burgundy rounded-md w-full"
                  >
                    <UserRound className="w-5 h-5" />
                    <span>Account Overview</span>
                  </Link>
                  
                  <Link 
                    to="/orders" 
                    className="flex items-center space-x-2 p-2 hover:bg-rose-light text-gray-700 hover:text-burgundy rounded-md w-full transition-colors"
                  >
                    <Package className="w-5 h-5" />
                    <span>Orders</span>
                  </Link>
                  
                  <Link 
                    to="/wishlist" 
                    className="flex items-center space-x-2 p-2 hover:bg-rose-light text-gray-700 hover:text-burgundy rounded-md w-full transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Wishlist</span>
                  </Link>
                  
                  <Link 
                    to="/addresses" 
                    className="flex items-center space-x-2 p-2 hover:bg-rose-light text-gray-700 hover:text-burgundy rounded-md w-full transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    <span>Addresses</span>
                  </Link>
                  
                  <Link 
                    to="/payment-methods" 
                    className="flex items-center space-x-2 p-2 hover:bg-rose-light text-gray-700 hover:text-burgundy rounded-md w-full transition-colors"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Methods</span>
                  </Link>
                  
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
              <div className="bg-white rounded-lg border p-6 mb-8">
                <h2 className="font-playfair text-2xl mb-6">Account Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium text-lg mb-4">Account Details</h3>
                    <p className="mb-1">{registerName || "User"}</p>
                    <p className="mb-1">{loginEmail || registerEmail}</p>
                    <Link 
                      to="/account/edit" 
                      className="text-burgundy hover:underline text-sm mt-2 inline-block"
                    >
                      Edit Profile
                    </Link>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Address Book</h3>
                    <p className="text-gray-500 mb-4">You have no saved addresses.</p>
                    <Link to="/addresses">
                      <Button variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                        Add Address
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-playfair text-2xl">Recent Orders</h2>
                  <Link 
                    to="/orders" 
                    className="text-burgundy hover:underline text-sm"
                  >
                    View All
                  </Link>
                </div>
                
                {orders.length === 0 ? (
                  <p className="text-gray-500">You have no orders yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-cream text-burgundy">
                        <tr>
                          <th className="px-4 py-3 text-left">Order</th>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Total</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b">
                            <td className="px-4 py-4">{order.id}</td>
                            <td className="px-4 py-4">{order.date}</td>
                            <td className="px-4 py-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                                order.status === 'Delivered' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-4">{order.total}</td>
                            <td className="px-4 py-4">
                              <Link 
                                to={`/orders/${order.id}`} 
                                className="text-burgundy hover:underline"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Account;
