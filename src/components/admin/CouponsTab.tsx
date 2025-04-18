
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Coupon } from "@/types/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays } from "date-fns";

interface CouponsTabProps {
  coupons: Coupon[];
  refreshData?: () => void;
}

const couponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters").toUpperCase(),
  discount_percent: z.coerce.number().min(1, "Discount must be at least 1%").max(100, "Discount cannot exceed 100%"),
  starts_at: z.string().refine(val => new Date(val) instanceof Date, {
    message: "Please enter a valid start date",
  }),
  expires_at: z.string().refine(val => new Date(val) instanceof Date, {
    message: "Please enter a valid expiration date",
  }),
  is_active: z.boolean().default(true),
  max_uses: z.coerce.number().nullable().optional(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

const CouponsTab = ({ coupons = [], refreshData }: CouponsTabProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      discount_percent: 10,
      starts_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      expires_at: format(addDays(new Date(), 30), "yyyy-MM-dd'T'HH:mm"),
      is_active: true,
      max_uses: null,
    },
  });

  const onSubmit = async (data: CouponFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('coupons')
        .insert([{
          code: data.code.toUpperCase(),
          discount_percent: data.discount_percent,
          starts_at: data.starts_at,
          expires_at: data.expires_at,
          is_active: data.is_active,
          max_uses: data.max_uses || null,
          current_uses: 0,
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Coupon added successfully",
        description: `${data.code} has been added with ${data.discount_percent}% discount.`,
      });
      
      form.reset();
      setIsAddDialogOpen(false);
      
      if (refreshData) {
        refreshData();
      }
      
    } catch (error: any) {
      console.error("Error adding coupon:", error);
      toast({
        title: "Error adding coupon",
        description: error.message || "There was a problem adding your coupon.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (couponId: string, couponCode: string) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId);
        
      if (error) throw error;
      
      toast({
        title: "Coupon deleted",
        description: `${couponCode} has been removed.`
      });
      
      if (refreshData) {
        refreshData();
      }
      
    } catch (error: any) {
      console.error("Error deleting coupon:", error);
      toast({
        title: "Error deleting coupon",
        description: error.message || "There was a problem deleting this coupon.",
        variant: "destructive"
      });
    }
  };

  const handleToggleCouponStatus = async (couponId: string, currentStatus: boolean, couponCode: string) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !currentStatus })
        .eq('id', couponId);
        
      if (error) throw error;
      
      toast({
        title: "Coupon status updated",
        description: `${couponCode} is now ${!currentStatus ? 'active' : 'inactive'}.`
      });
      
      if (refreshData) {
        refreshData();
      }
      
    } catch (error: any) {
      console.error("Error updating coupon status:", error);
      toast({
        title: "Error updating coupon",
        description: error.message || "There was a problem updating this coupon.",
        variant: "destructive"
      });
    }
  };

  // Generate a random coupon code (5 characters)
  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Coupons</h2>
        <Button 
          className="gap-2 bg-purple-600 hover:bg-purple-700 transition-colors"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Coupon
        </Button>
      </div>
      
      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium">Code</TableHead>
              <TableHead className="font-medium">Discount</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Usage</TableHead>
              <TableHead className="font-medium">Validity</TableHead>
              <TableHead className="text-right font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length > 0 ? (
              coupons.map((coupon) => (
                <TableRow key={coupon.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{coupon.code}</TableCell>
                  <TableCell>{coupon.discount_percent}%</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={coupon.is_active} 
                        onCheckedChange={() => handleToggleCouponStatus(coupon.id, coupon.is_active, coupon.code)}
                      />
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{coupon.current_uses}/{coupon.max_uses || '∞'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>From: {new Date(coupon.starts_at).toLocaleDateString()}</span>
                      <span>To: {new Date(coupon.expires_at).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No coupons found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Coupon Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Coupon</DialogTitle>
            <DialogDescription>
              Create a discount coupon for your customers.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-end gap-2">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Coupon Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="SALE25" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    const randomCode = generateRandomCode();
                    form.setValue("code", randomCode);
                  }}
                >
                  Generate
                </Button>
              </div>
              
              <FormField
                control={form.control}
                name="discount_percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Percentage *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="100" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Discount percentage (1-100%)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="starts_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid From *</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expires_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Until *</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="max_uses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Uses</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="Leave empty for unlimited" 
                        {...field} 
                        value={field.value === null ? '' : field.value}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value);
                          field.onChange(val);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum number of times this coupon can be used (leave empty for unlimited)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Make this coupon immediately available to customers
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Coupon"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouponsTab;
