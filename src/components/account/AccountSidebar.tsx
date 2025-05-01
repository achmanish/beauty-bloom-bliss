
import { UserRound, Package, Heart, Home, CreditCard, LogOut } from "lucide-react";

interface AccountSidebarProps {
  firstName: string;
  email: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  fetchOrders: () => void;
  fetchWishlist: () => void;
  fetchAddresses: () => void;
  fetchPaymentMethods: () => void;
  isLoadingOrders: boolean;
  isLoadingWishlist: boolean;
  isLoadingAddresses: boolean;
  isLoadingPayments: boolean;
  ordersCount: number;
  wishlistCount: number;
  addressesCount: number;
  paymentsCount: number;
}

const AccountSidebar = ({
  firstName,
  email,
  activeTab,
  setActiveTab,
  onLogout,
  fetchOrders,
  fetchWishlist,
  fetchAddresses,
  fetchPaymentMethods,
  isLoadingOrders,
  isLoadingWishlist,
  isLoadingAddresses,
  isLoadingPayments,
  ordersCount,
  wishlistCount,
  addressesCount,
  paymentsCount,
}: AccountSidebarProps) => {
  return (
    <div className="col-span-1">
      <div className="bg-cream p-6 rounded-lg sticky top-24">
        <div className="mb-6">
          <h2 className="font-playfair text-xl mb-2">Welcome, {firstName || "User"}!</h2>
          <p className="text-sm text-gray-600">{email}</p>
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
            onClick={() => {
              setActiveTab("orders");
              if (!isLoadingOrders && ordersCount === 0) {
                fetchOrders();
              }
            }}
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
            onClick={() => {
              setActiveTab("wishlist");
              if (!isLoadingWishlist && wishlistCount === 0) {
                fetchWishlist();
              }
            }}
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
            onClick={() => {
              setActiveTab("addresses");
              if (!isLoadingAddresses && addressesCount === 0) {
                fetchAddresses();
              }
            }}
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
            onClick={() => {
              setActiveTab("payment");
              if (!isLoadingPayments && paymentsCount === 0) {
                fetchPaymentMethods();
              }
            }}
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
            onClick={onLogout}
            className="flex items-center space-x-2 p-2 hover:bg-rose-light text-gray-700 hover:text-burgundy rounded-md w-full transition-colors mt-6"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AccountSidebar;
