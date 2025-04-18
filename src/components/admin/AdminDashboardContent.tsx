import { useState } from "react";
import StatsCards from "@/components/admin/StatsCards";
import OrdersTab from "@/components/admin/OrdersTab";
import PaymentsTab from "@/components/admin/PaymentsTab";
import ProductsTab from "@/components/admin/ProductsTab";
import CategoriesTab from "@/components/admin/CategoriesTab";
import CouponsTab from "@/components/admin/CouponsTab";
import FlashSalesTab from "@/components/admin/FlashSalesTab";
import { Order, Product, Payment, Category, Coupon, FlashSale } from "@/types/admin";
import { LogOut, RefreshCw } from "lucide-react";
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
  categories: Category[];
  coupons: Coupon[];
  flashSales: FlashSale[];
  handleLogout: () => void;
  refreshData?: () => void;
}

const AdminDashboardContent = ({
  loading,
  stats,
  activeTab,
  setActiveTab,
  orders,
  products,
  payments,
  categories = [],
  coupons = [],
  flashSales = [],
  handleLogout,
  refreshData
}: AdminDashboardContentProps) => {
  
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrdersTab orders={orders} products={products} />;
      case "payments":
        return <PaymentsTab payments={payments} />;
      case "products":
        return <ProductsTab products={products} refreshData={refreshData} />;
      case "categories":
        return <CategoriesTab categories={categories} refreshData={refreshData} />;
      case "coupons":
        return <CouponsTab coupons={coupons} refreshData={refreshData} />;
      case "flash-sales":
        return <FlashSalesTab flashSales={flashSales} refreshData={refreshData} />;
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
      <div className="hidden md:flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-2">
          {refreshData && (
            <Button 
              variant="outline" 
              onClick={refreshData} 
              className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
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
          
          <div className="block md:hidden mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="coupons">Coupons</TabsTrigger>
                <TabsTrigger value="flash-sales">Flash Sales</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="mt-6 space-y-4">
            {renderActiveTabContent()}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardContent;
