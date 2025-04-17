
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { allProducts } from "@/data/productData";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Skincare", value: "skincare", count: 45 },
  { name: "Haircare", value: "haircare", count: 30 },
  { name: "Bodycare", value: "bodycare", count: 20 },
  { name: "Makeup", value: "makeup", count: 5 }
];

const concerns = [
  { name: "Anti-Aging", count: 25 },
  { name: "Hydration", count: 40 },
  { name: "Brightening", count: 30 },
  { name: "Acne Control", count: 15 }
];

const ProductsPage = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSearchQuery("");
    setSortBy("featured");
  };
  
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
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center text-burgundy"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md p-2 pr-8 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-burgundy"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Filters - Mobile Collapsible */}
          <div className={`md:hidden mb-6 ${filtersOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium text-lg">Filters</h2>
                <button onClick={() => setFiltersOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    min={0}
                    max={1000}
                    step={50}
                    onValueChange={setPriceRange}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.name} className="flex items-center">
                      <Checkbox
                        id={`category-${category.value}`}
                        checked={selectedCategories.includes(category.value)}
                        onCheckedChange={() => toggleCategory(category.value)}
                      />
                      <label
                        htmlFor={`category-${category.value}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {category.name} ({category.count})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Concerns */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Concerns</h3>
                <div className="space-y-2">
                  {concerns.map((concern) => (
                    <div key={concern.name} className="flex items-center">
                      <Checkbox id={`concern-${concern.name.toLowerCase()}`} />
                      <label
                        htmlFor={`concern-${concern.name.toLowerCase()}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {concern.name} ({concern.count})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  className="bg-burgundy hover:bg-burgundy-light text-white flex-grow"
                >
                  Apply Filters
                </Button>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="border-burgundy text-burgundy"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
          
          {/* Filters - Desktop Sidebar */}
          <div className="hidden md:block w-1/4 min-w-[250px]">
            <div className="bg-white p-6 rounded-lg border sticky top-24">
              <h2 className="font-medium text-lg mb-6">Filters</h2>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    min={0}
                    max={1000}
                    step={50}
                    onValueChange={setPriceRange}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              {/* Categories */}
              <Collapsible defaultOpen={true} className="mb-6">
                <CollapsibleTrigger className="flex w-full justify-between items-center text-sm font-medium text-gray-700 mb-2">
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.name} className="flex items-center">
                      <Checkbox
                        id={`desktop-category-${category.value}`}
                        checked={selectedCategories.includes(category.value)}
                        onCheckedChange={() => toggleCategory(category.value)}
                      />
                      <label
                        htmlFor={`desktop-category-${category.value}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {category.name} ({category.count})
                      </label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
              
              {/* Concerns */}
              <Collapsible defaultOpen={true} className="mb-8">
                <CollapsibleTrigger className="flex w-full justify-between items-center text-sm font-medium text-gray-700 mb-2">
                  <span>Concerns</span>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                  {concerns.map((concern) => (
                    <div key={concern.name} className="flex items-center">
                      <Checkbox id={`desktop-concern-${concern.name.toLowerCase()}`} />
                      <label
                        htmlFor={`desktop-concern-${concern.name.toLowerCase()}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {concern.name} ({concern.count})
                      </label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
              
              <div className="flex space-x-2">
                <Button
                  className="bg-burgundy hover:bg-burgundy-light text-white flex-grow"
                >
                  Apply Filters
                </Button>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="border-burgundy text-burgundy"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="md:w-3/4">
            {/* Desktop Sort Options */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <p className="text-gray-500">{allProducts.length} products</p>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 pr-8 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-burgundy"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
                </div>
              </div>
            </div>
            
            <ProductGrid showTitle={false} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
