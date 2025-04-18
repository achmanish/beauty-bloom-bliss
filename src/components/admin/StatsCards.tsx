
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Orders</CardTitle>
          <CardDescription>All Time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl md:text-3xl font-bold">{stats.totalOrders}</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Revenue</CardTitle>
          <CardDescription>All Time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl md:text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Completed Orders</CardTitle>
          <CardDescription>All Time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl md:text-3xl font-bold">{stats.completedOrders}</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Pending Payments</CardTitle>
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
