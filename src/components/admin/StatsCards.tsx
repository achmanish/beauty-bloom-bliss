
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Package, ShoppingCart, CreditCard } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    completedOrders: number;
    pendingPayments: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden border-l-4 border-l-purple-600">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-purple-600" />
            Total Orders
          </CardTitle>
          <CardDescription>All Time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl md:text-3xl font-bold">{stats.totalOrders}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden border-l-4 border-l-blue-600">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Total Revenue
          </CardTitle>
          <CardDescription>All Time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl md:text-3xl font-bold">₹{stats.totalRevenue.toLocaleString('ne-NP')}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden border-l-4 border-l-green-600">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg flex items-center">
            <Package className="h-5 w-5 mr-2 text-green-600" />
            Completed Orders
          </CardTitle>
          <CardDescription>All Time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl md:text-3xl font-bold">{stats.completedOrders}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden border-l-4 border-l-orange-600">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-orange-600" />
            Pending Payments
          </CardTitle>
          <CardDescription>All Time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl md:text-3xl font-bold">{stats.pendingPayments}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
