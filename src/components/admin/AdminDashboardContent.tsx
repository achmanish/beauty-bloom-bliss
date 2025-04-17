
import { useState } from "react";
import StatsCards from "@/components/admin/StatsCards";
import OrdersTab from "@/components/admin/OrdersTab";
import PaymentsTab from "@/components/admin/PaymentsTab";
import ProductsTab from "@/components/admin/ProductsTab";
import { Order, Product, Payment } from "@/types/admin";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminDashboardContentProps {
  loading: boolean;
  stats: {
    totalOrders: number;
    totalRevenue: number;
    completedOrders: number;
    pendingPayments: number;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  orders: Order[];
  products: Product[];
  payments: Payment[];
  handleLogout: () => void;
}

const AdminDashboardContent = ({
  loading,
  stats,
  activeTab,
  setActiveTab,
  orders,
  products,
  payments,
  handleLogout
}: AdminDashboardContentProps) => {
  
  // Render active tab content based on the selected tab
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrdersTab orders={orders} products={products} />;
      case "payments":
        return <PaymentsTab payments={payments} />;
      case "products":
        return <ProductsTab products={products} />;
      case "customers":
        return (
          <div className="p-6 bg-white rounded-md border">
            <p className="text-center text-gray-500">Customers management coming soon</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-6 bg-white rounded-md border">
            <p className="text-center text-gray-500">Settings panel coming soon</p>
          </div>
        );
      default:
        return <OrdersTab orders={orders} products={products} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-12 md:mt-0">
      {/* Page Header for desktop */}
      <div className="hidden md:flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={handleLogout} 
          className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="orders" className="flex-1">
                  <span className="flex items-center">Orders</span>
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex-1">
                  <span className="flex items-center">Payments</span>
                </TabsTrigger>
                <TabsTrigger value="products" className="flex-1">
                  <span className="flex items-center">Products</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Tab Content */}
          <div className="mt-6 space-y-4">
            {renderActiveTabContent()}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardContent;
