
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/types/admin";
import { Filter, Edit, Plus } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useToast } from "@/components/ui/use-toast";
import AdminSearchFilter from "./filters/AdminSearchFilter";
import AdminCategoryFilter from "./filters/AdminCategoryFilter";
import AdminPriceRangeFilter from "./filters/AdminPriceRangeFilter";

interface ProductsTabProps {
  products: Product[];
}

const ProductsTab = ({ products }: ProductsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const { toast } = useToast();

  // Get unique categories from products
  const categories = ["all", ...new Set(products.map(p => p.category || "uncategorized"))];
  
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
          
          <Button className="gap-2 bg-burgundy hover:bg-burgundy/90 transition-colors">
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
    </div>
  );
};

export default ProductsTab;
