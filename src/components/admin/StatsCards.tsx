
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Orders</CardTitle>
          <CardDescription>All Time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Revenue</CardTitle>
          <CardDescription>All Time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Completed Orders</CardTitle>
          <CardDescription>All Time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.completedOrders}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Pending Payments</CardTitle>
          <CardDescription>All Time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.pendingPayments}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
