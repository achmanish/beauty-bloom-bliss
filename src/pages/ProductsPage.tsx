
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { allProducts, Product } from "@/data/productData";
import SortSelector from "@/components/filters/SortSelector";
import MobileFilterDrawer from "@/components/filters/MobileFilterDrawer";
import FilterSidebar from "@/components/filters/FilterSidebar";

const categories = [
  { name: "Skincare", value: "skincare", count: 45 },
  { name: "Haircare", value: "haircare", count: 30 },
  { name: "Bodycare", value: "bodycare", count: 20 },
  { name: "Makeup", value: "makeup", count: 5 }
];

const concerns = [
  { name: "Anti-Aging", value: "anti-aging", count: 25 },
  { name: "Hydration", value: "hydration", count: 40 },
  { name: "Brightening", value: "brightening", count: 30 },
  { name: "Acne Control", value: "acne-control", count: 15 }
];

const ProductsPage = () => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  
  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Toggle concern selection
  const toggleConcern = (concern: string) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter(c => c !== concern));
    } else {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSelectedConcerns([]);
    setSearchQuery("");
    setSortBy("featured");
    setFilteredProducts(allProducts);
  };
  
  // Apply filters to products
  const applyFilters = () => {
    console.log("Applying filters with:", { 
      searchQuery, 
      priceRange, 
      selectedCategories, 
      selectedConcerns, 
      sortBy 
    });
    
    let results = [...allProducts];
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      results = results.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    // Filter by selected concerns
    if (selectedConcerns.length > 0) {
      results = results.filter(product => 
        // Check if any of the product's tags match the selected concerns
        product.tags?.some(tag => 
          selectedConcerns.includes(tag) || 
          selectedConcerns.some(concern => tag.includes(concern))
        )
      );
    }
    
    // Filter by price range
    results = results.filter(product => 
      (product.price / 100) >= priceRange[0] && 
      (product.price / 100) <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default: // "featured"
        results.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
    
    console.log(`Found ${results.length} products after filtering`);
    setFilteredProducts(results);
  };

  // Apply filters whenever any filter value changes
  useEffect(() => {
    applyFilters();
  }, [sortBy]); // Only auto-apply when sort changes
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="bg-cream py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-3xl md:text-5xl text-burgundy mb-4">
            Our Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our complete collection of premium beauty and skincare products, 
            crafted with natural ingredients for radiant, healthy skin.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 md:py-10">
        {/* Mobile Filter Toggle and Sort */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <MobileFilterDrawer 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            concerns={concerns}
            selectedConcerns={selectedConcerns}
            toggleConcern={toggleConcern}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
          />
          
          <SortSelector sortBy={sortBy} setSortBy={setSortBy} />
        </div>
        
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Desktop Sidebar */}
          <FilterSidebar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            concerns={concerns}
            selectedConcerns={selectedConcerns}
            toggleConcern={toggleConcern}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
          />
          
          {/* Products Grid */}
          <div className="md:w-3/4">
            {/* Desktop Sort Options */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <p className="text-gray-500">{filteredProducts.length} products</p>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <SortSelector sortBy={sortBy} setSortBy={setSortBy} />
              </div>
            </div>
            
            {/* ProductGrid component usage with filtered products */}
            <ProductGrid showTitle={false} customProducts={filteredProducts} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
