
import { 
  LogOut, 
  LayoutDashboard, 
  ShoppingBag, 
  CreditCard, 
  Package, 
  Users, 
  Settings,
  Tags,
  Ticket,
  Zap,
  Star,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

const AdminSidebar = ({ activeTab, setActiveTab, user, onLogout }: AdminSidebarProps) => {
  return (
    <>
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
              variant={activeTab === "orders" ? "default" : "ghost"} 
              className={`w-full justify-start transition-all duration-200 ${
                activeTab === "orders" 
                  ? "bg-burgundy text-white hover:bg-burgundy/90" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingBag className="h-5 w-5 mr-3" />
              Orders
            </Button>
            <Button 
              variant={activeTab === "payments" ? "default" : "ghost"} 
              className={`w-full justify-start transition-all duration-200 ${
                activeTab === "payments" 
                  ? "bg-burgundy text-white hover:bg-burgundy/90" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("payments")}
            >
              <CreditCard className="h-5 w-5 mr-3" />
              Payments
            </Button>
            <Button 
              variant={activeTab === "products" ? "default" : "ghost"} 
              className={`w-full justify-start transition-all duration-200 ${
                activeTab === "products" 
                  ? "bg-burgundy text-white hover:bg-burgundy/90" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("products")}
            >
              <Package className="h-5 w-5 mr-3" />
              Products
            </Button>
            <Button 
              variant={activeTab === "categories" ? "default" : "ghost"} 
              className={`w-full justify-start transition-all duration-200 ${
                activeTab === "categories" 
                  ? "bg-burgundy text-white hover:bg-burgundy/90" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("categories")}
            >
              <Tags className="h-5 w-5 mr-3" />
              Categories
            </Button>
            <Button 
              variant={activeTab === "coupons" ? "default" : "ghost"} 
              className={`w-full justify-start transition-all duration-200 ${
                activeTab === "coupons" 
                  ? "bg-burgundy text-white hover:bg-burgundy/90" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("coupons")}
            >
              <Ticket className="h-5 w-5 mr-3" />
              Coupons
            </Button>
            <Button 
              variant={activeTab === "flash-sales" ? "default" : "ghost"} 
              className={`w-full justify-start transition-all duration-200 ${
                activeTab === "flash-sales" 
                  ? "bg-burgundy text-white hover:bg-burgundy/90" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("flash-sales")}
            >
              <Zap className="h-5 w-5 mr-3" />
              Flash Sales
            </Button>
            <Button 
              variant={activeTab === "reviews" ? "default" : "ghost"} 
              className={`w-full justify-start transition-all duration-200 ${
                activeTab === "reviews" 
                  ? "bg-burgundy text-white hover:bg-burgundy/90" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              <Star className="h-5 w-5 mr-3" />
              Reviews
            </Button>
            <Button 
              variant={activeTab === "newsletter" ? "default" : "ghost"} 
              className={`w-full justify-start transition-all duration-200 ${
                activeTab === "newsletter" 
                  ? "bg-burgundy text-white hover:bg-burgundy/90" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("newsletter")}
            >
              <Mail className="h-5 w-5 mr-3" />
              Newsletter
            </Button>
            <Button 
              variant={activeTab === "customers" ? "default" : "ghost"} 
              className={`w-full justify-start transition-all duration-200 ${
                activeTab === "customers" 
                  ? "bg-burgundy text-white hover:bg-burgundy/90" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("customers")}
            >
              <Users className="h-5 w-5 mr-3" />
              Customers
            </Button>
            <Button 
              variant={activeTab === "settings" ? "default" : "ghost"} 
              className={`w-full justify-start transition-all duration-200 ${
                activeTab === "settings" 
                  ? "bg-burgundy text-white hover:bg-burgundy/90" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-5 w-5 mr-3" />
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
            onClick={onLogout} 
            className="flex items-center w-full text-sm hover:bg-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
