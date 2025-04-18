
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Zap } from "lucide-react";
import { FlashSale } from "@/types/admin";
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

interface FlashSalesTabProps {
  flashSales: FlashSale[];
  refreshData?: () => void;
}

const flashSaleSchema = z.object({
  name: z.string().min(3, "Sale name must be at least 3 characters"),
  discount_percent: z.coerce.number().min(1, "Discount must be at least 1%").max(99, "Discount cannot exceed 99%"),
  starts_at: z.string().refine(val => new Date(val) instanceof Date, {
    message: "Please enter a valid start date",
  }),
  ends_at: z.string().refine(val => new Date(val) instanceof Date, {
    message: "Please enter a valid end date",
  }),
  is_active: z.boolean().default(true),
});

type FlashSaleFormValues = z.infer<typeof flashSaleSchema>;

const FlashSalesTab = ({ flashSales = [], refreshData }: FlashSalesTabProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FlashSaleFormValues>({
    resolver: zodResolver(flashSaleSchema),
    defaultValues: {
      name: "",
      discount_percent: 25,
      starts_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      ends_at: format(addDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm"),
      is_active: true,
    },
  });

  const onSubmit = async (data: FlashSaleFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('flash_sales')
        .insert([{
          name: data.name,
          discount_percent: data.discount_percent,
          starts_at: data.starts_at,
          ends_at: data.ends_at,
          is_active: data.is_active,
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Flash sale created successfully",
        description: `${data.name} has been created with ${data.discount_percent}% discount.`,
      });
      
      form.reset();
      setIsAddDialogOpen(false);
      
      if (refreshData) {
        refreshData();
      }
      
    } catch (error: any) {
      console.error("Error creating flash sale:", error);
      toast({
        title: "Error creating flash sale",
        description: error.message || "There was a problem creating your flash sale.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFlashSale = async (saleId: string, saleName: string) => {
    try {
      const { error } = await supabase
        .from('flash_sales')
        .delete()
        .eq('id', saleId);
        
      if (error) throw error;
      
      toast({
        title: "Flash sale deleted",
        description: `${saleName} has been removed.`
      });
      
      if (refreshData) {
        refreshData();
      }
      
    } catch (error: any) {
      console.error("Error deleting flash sale:", error);
      toast({
        title: "Error deleting flash sale",
        description: error.message || "There was a problem deleting this flash sale.",
        variant: "destructive"
      });
    }
  };

  const handleToggleFlashSaleStatus = async (saleId: string, currentStatus: boolean, saleName: string) => {
    try {
      const { error } = await supabase
        .from('flash_sales')
        .update({ is_active: !currentStatus })
        .eq('id', saleId);
        
      if (error) throw error;
      
      toast({
        title: "Flash sale status updated",
        description: `${saleName} is now ${!currentStatus ? 'active' : 'inactive'}.`
      });
      
      if (refreshData) {
        refreshData();
      }
      
    } catch (error: any) {
      console.error("Error updating flash sale status:", error);
      toast({
        title: "Error updating flash sale",
        description: error.message || "There was a problem updating this flash sale.",
        variant: "destructive"
      });
    }
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date();
  };

  const getSaleStatus = (sale: FlashSale) => {
    if (!sale.is_active) return "Inactive";
    if (isExpired(sale.ends_at)) return "Expired";
    if (isUpcoming(sale.starts_at)) return "Upcoming";
    return "Active";
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Expired":
        return "bg-gray-100 text-gray-800";
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Flash Sales</h2>
        <Button 
          className="gap-2 bg-purple-600 hover:bg-purple-700 transition-colors"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create Flash Sale
        </Button>
      </div>
      
      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Discount</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Start Date</TableHead>
              <TableHead className="font-medium">End Date</TableHead>
              <TableHead className="text-right font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flashSales.length > 0 ? (
              flashSales.map((sale) => {
                const status = getSaleStatus(sale);
                return (
                  <TableRow key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{sale.name}</TableCell>
                    <TableCell>{sale.discount_percent}%</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={sale.is_active} 
                          onCheckedChange={() => handleToggleFlashSaleStatus(sale.id, sale.is_active, sale.name)}
                          disabled={isExpired(sale.ends_at)}
                        />
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyles(status)}`}>
                          {status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(sale.starts_at).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(sale.ends_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteFlashSale(sale.id, sale.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No flash sales found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Flash Sale Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Flash Sale</DialogTitle>
            <DialogDescription>
              Create a time-limited discount promotion for your store.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Weekend Special" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                        max="99" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Discount percentage (1-99%)
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
                      <FormLabel>Start Date & Time *</FormLabel>
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
                  name="ends_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date & Time *</FormLabel>
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
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Make this flash sale immediately active when it starts
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
                  {isSubmitting ? "Creating..." : "Create Flash Sale"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlashSalesTab;
