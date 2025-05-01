
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Check, 
  Eye, 
  X,
  AlertCircle,
  Key,
  Save,
  ShoppingBag
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/admin";

interface AccountOverviewProps {
  firstName: string;
  lastName: string;
  email: string;
  orders: Order[];
  isLoadingOrders: boolean;
  onProfileUpdate: () => Promise<void>;
  onPasswordChange: () => Promise<void>;
  onViewOrder: (orderId: string) => void;
  onCancelOrder: (orderId: string) => Promise<void>;
  setActiveTab: (tab: string) => void;
  fetchOrders: () => Promise<void>;
  isUpdatingProfile: boolean;
  isChangingPassword: boolean;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
}

const AccountOverview = ({
  firstName,
  lastName,
  email,
  orders,
  isLoadingOrders,
  onProfileUpdate,
  onPasswordChange,
  onViewOrder,
  onCancelOrder,
  setActiveTab,
  fetchOrders,
  isUpdatingProfile,
  isChangingPassword,
  setFirstName,
  setLastName,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
}: AccountOverviewProps) => {
  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Update your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-lg mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                  onClick={onProfileUpdate}
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Security</h3>
              <div className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Update your password to a new secure one
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      
                      {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <div className="flex items-center text-red-500 text-sm">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Passwords don't match
                        </div>
                      )}
                    </div>
                    
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={onPasswordChange}
                        disabled={isChangingPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                        className="bg-burgundy hover:bg-burgundy-light"
                      >
                        {isChangingPassword ? "Updating..." : "Update Password"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <div className="p-4 border rounded-md bg-gray-50 mt-6">
                  <h4 className="font-medium mb-2">Account Security Tips</h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <Check className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                      Use a strong, unique password
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                      Never share your password with others
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                      Update your password regularly
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Orders</CardTitle>
            <Button 
              variant="link" 
              className="text-burgundy p-0 h-auto"
              onClick={() => {
                setActiveTab("orders");
                fetchOrders();
              }}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingOrders ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-4">When you place your first order, it will appear here</p>
              <Button asChild className="bg-burgundy hover:bg-burgundy-light">
                <Link to="/products">Start Shopping</Link>
              </Button>
            </div>
          ) : (
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
                  {orders.slice(0, 2).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id.slice(0, 8)}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>${order.total_amount}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onViewOrder(order.id)}
                          >
                            <Eye className="w-4 h-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          
                          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => onCancelOrder(order.id)}
                            >
                              <X className="w-4 h-4" />
                              <span className="sr-only">Cancel</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountOverview;
