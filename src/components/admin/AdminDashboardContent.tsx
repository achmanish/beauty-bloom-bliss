import { useState } from "react";
import StatsCards from "@/components/admin/StatsCards";
import OrdersTab from "@/components/admin/OrdersTab";
import PaymentsTab from "@/components/admin/PaymentsTab";
import ProductsTab from "@/components/admin/ProductsTab";
import CategoriesTab from "@/components/admin/CategoriesTab";
import CouponsTab from "@/components/admin/CouponsTab";
import FlashSalesTab from "@/components/admin/FlashSalesTab";
import ReviewsTab from "@/components/admin/ReviewsTab";
import NewsletterTab from "@/components/admin/NewsletterTab";
import { Order, Product, Payment, Category, Coupon, FlashSale } from "@/types/admin";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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

// Settings Tab Component
const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Manage your store details</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-gray-500">Store settings functionality will be implemented soon.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Configure automated emails</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-gray-500">Email notification settings will be implemented soon.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Configure payment options</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-gray-500">Payment method configuration will be implemented soon.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Shipping Options</CardTitle>
            <CardDescription>Manage shipping methods and rates</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-gray-500">Shipping configuration will be implemented soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Customers Tab Component
const CustomersTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Customers</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>View and manage customer accounts</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-gray-500">Customer management functionality will be implemented soon.</p>
          <div className="mt-4">
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>View customer profiles and purchase history</li>
              <li>Manage customer groups and segments</li>
              <li>Create and manage loyalty programs</li>
              <li>Handle customer support requests</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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
      case "reviews":
        return <ReviewsTab />;
      case "newsletter":
        return <NewsletterTab />;
      case "customers":
        return <CustomersTab />;
      case "settings":
        return <SettingsTab />;
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
