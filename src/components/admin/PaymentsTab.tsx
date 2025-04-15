
import { useState } from "react";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Payment } from "@/types/admin";

interface PaymentsTabProps {
  payments: Payment[];
}

const PaymentsTab = ({ payments }: PaymentsTabProps) => {
  const [searchPayment, setSearchPayment] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
      case "successful":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "refunded":
        return <Badge className="bg-blue-500">Refunded</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "Credit Card":
        return "💳";
      case "UPI":
        return "📱";
      case "Razorpay":
        return "🔐";
      case "COD":
        return "💰";
      default:
        return "💲";
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchPayment.toLowerCase()) || 
                         (payment.order_id && payment.order_id.toLowerCase().includes(searchPayment.toLowerCase()));
    const matchesStatus = paymentFilter === "all" || payment.status === paymentFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search payments..."
              className="pl-10 w-full"
              value={searchPayment}
              onChange={(e) => setSearchPayment(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="successful">Successful</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Payment ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id.substring(0, 8)}</TableCell>
                <TableCell>{payment.order_id ? payment.order_id.substring(0, 8) : 'N/A'}</TableCell>
                <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                <TableCell>₹{Number(payment.amount).toLocaleString()}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1">
                    <span>{getPaymentIcon(payment.payment_method || 'Unknown')}</span>
                    <span>{payment.payment_method || 'Unknown'}</span>
                  </span>
                </TableCell>
                <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {payment.transaction_id || 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredPayments.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No payments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsTab;
