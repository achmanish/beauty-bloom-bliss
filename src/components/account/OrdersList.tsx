
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, X, ShoppingBag, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Order } from "@/types/admin";
import OrderTracking from "@/components/order/OrderTracking";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface OrdersListProps {
  orders: Order[];
  isLoadingOrders: boolean;
  onViewOrder: (orderId: string) => void;
  onCancelOrder: (orderId: string) => Promise<void>;
}

const OrdersList = ({
  orders,
  isLoadingOrders,
  onViewOrder,
  onCancelOrder,
}: OrdersListProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
      
      {isLoadingOrders ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border p-8">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-4">When you place your first order, it will appear here</p>
          <Button asChild className="bg-burgundy hover:bg-burgundy-light">
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id.slice(0, 8)}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>${order.total_amount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewOrder(order.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Package className="w-4 h-4 mr-2" />
                              Track
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order Tracking - #{order.id.slice(0, 8)}</DialogTitle>
                            </DialogHeader>
                            <OrderTracking orderId={order.id} />
                          </DialogContent>
                        </Dialog>
                        
                        {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onCancelOrder(order.id)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
