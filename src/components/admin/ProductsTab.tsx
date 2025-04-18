
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/types/admin";
import { Filter, Edit, Plus, X } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useToast } from "@/components/ui/use-toast";
import AdminSearchFilter from "./filters/AdminSearchFilter";
import AdminCategoryFilter from "./filters/AdminCategoryFilter";
import AdminPriceRangeFilter from "./filters/AdminPriceRangeFilter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";

interface ProductsTabProps {
  products: Product[];
}

// Form schema for product creation/editing
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().optional(),
  stock: z.coerce.number().min(0, "Stock must be a positive number"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductsTab = ({ products }: ProductsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Get unique categories from products
  const categories = ["all", ...new Set(products.map(p => p.category || "uncategorized"))];
  
  // Set up form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      stock: 0,
    },
  });
  
  // Apply filters when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);
  
  // Apply filters function
  const applyFilters = () => {
    let results = [...products];
    
    // Filter by search term
    if (searchTerm.trim() !== "") {
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (categoryFilter !== "all") {
      results = results.filter(product => product.category === categoryFilter);
    }
    
    // Filter by price range
    results = results.filter(product => 
      Number(product.price) >= priceRange[0] && Number(product.price) <= priceRange[1]
    );
    
    setFilteredProducts(results);
    
    toast({
      title: `Filters Applied`,
      description: `Found ${results.length} product${results.length !== 1 ? 's' : ''}`,
    });
  };

  // Handle form submission for adding a new product
  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert([
          {
            name: data.name,
            price: data.price,
            category: data.category,
            stock: data.stock,
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Product added successfully",
        description: `${data.name} has been added to your inventory.`,
      });
      
      // Reset form and close dialog
      form.reset();
      setIsAddDialogOpen(false);
      
      // Refresh product list (this would be better with a data fetching hook)
      // For now, we'll just add the new product to the current list
      if (newProduct && newProduct.length > 0) {
        setFilteredProducts([...filteredProducts, newProduct[0]]);
      }
      
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error adding product",
        description: "There was a problem adding your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1 w-full md:w-auto">
          <AdminSearchFilter 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 hover:bg-gray-100 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          
          <Button 
            className="gap-2 bg-burgundy hover:bg-burgundy/90 transition-colors"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md border mb-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdminCategoryFilter 
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categories={categories}
            />
            
            <AdminPriceRangeFilter 
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
            
            <div className="col-span-1 md:col-span-3 flex justify-end">
              <Button 
                onClick={applyFilters}
                className="bg-burgundy hover:bg-burgundy/90 transition-colors"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-gray-50">
              <TableHead className="font-medium">Product Name</TableHead>
              <TableHead className="font-medium">Category</TableHead>
              <TableHead className="font-medium">Price</TableHead>
              <TableHead className="font-medium">Stock</TableHead>
              <TableHead className="text-right font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <span className="cursor-pointer hover:text-burgundy transition-colors">{product.name}</span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between space-x-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">{product.name}</h4>
                          <p className="text-sm">
                            No detailed description available.
                          </p>
                          <div className="flex items-center pt-2">
                            <span className="text-xs text-gray-500">
                              ID: {product.id.toString().substring(0, 8)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>{product.category || 'Uncategorized'}</TableCell>
                <TableCell>₹{Number(product.price).toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.stock > 10 
                      ? 'bg-green-100 text-green-800' 
                      : product.stock > 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-gray-100 text-burgundy transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.filter(cat => cat !== "all").map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  className="bg-burgundy hover:bg-burgundy/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsTab;
