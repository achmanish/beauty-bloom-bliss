
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingBag, Heart, Filter, X, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock product data
const allProducts = [
  {
    id: 1,
    name: "Rose Glow Serum",
    price: 89,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80",
    category: "skincare",
    tags: ["serum", "hydrating", "anti-aging"],
    isNew: false,
    isBestseller: true
  },
  {
    id: 2,
    name: "Hydrating Cream",
    price: 65,
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1570194065650-d707c41c4754?auto=format&fit=crop&w=800&q=80",
    category: "skincare",
    tags: ["moisturizer", "hydrating"],
    isNew: true,
    isBestseller: false
  },
  {
    id: 3,
    name: "Crystal Essence",
    price: 120,
    rating: 4.9,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
    category: "skincare",
    tags: ["essence", "brightening"],
    isNew: false,
    isBestseller: false
  },
  {
    id: 4,
    name: "Renewal Oil",
    price: 95,
    rating: 4.7,
    reviews: 72,
    image: "https://images.unsplash.com/photo-1611930022073-84f39e061afd?auto=format&fit=crop&w=800&q=80",
    category: "skincare",
    tags: ["oil", "anti-aging"],
    isNew: false,
    isBestseller: true
  },
  {
    id: 5,
    name: "Violet Eye Cream",
    price: 75,
    rating: 4.5,
    reviews: 48,
    image: "https://images.unsplash.com/photo-1591375372156-542495912da9?auto=format&fit=crop&w=800&q=80",
    category: "skincare",
    tags: ["eye cream", "anti-aging"],
    isNew: true,
    isBestseller: false
  },
  {
    id: 6,
    name: "Matte Lipstick",
    price: 35,
    rating: 4.3,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    category: "makeup",
    tags: ["lipstick", "matte"],
    isNew: false,
    isBestseller: true
  },
  {
    id: 7,
    name: "Luxury Foundation",
    price: 68,
    rating: 4.6,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1631730359585-5d1ed4a540e3?auto=format&fit=crop&w=800&q=80",
    category: "makeup",
    tags: ["foundation", "long-lasting"],
    isNew: false,
    isBestseller: false
  },
  {
    id: 8,
    name: "Silk Hair Mask",
    price: 54,
    rating: 4.7,
    reviews: 62,
    image: "https://images.unsplash.com/photo-1597354984706-fac992d9306f?auto=format&fit=crop&w=800&q=80",
    category: "hair",
    tags: ["mask", "treatment"],
    isNew: false,
    isBestseller: false
  }
];

const categories = [
  { name: "Skincare", count: 5 },
  { name: "Makeup", count: 2 },
  { name: "Hair Care", count: 1 },
  { name: "Body Care", count: 0 }
];

const concerns = [
  { name: "Anti-Aging", count: 3 },
  { name: "Hydration", count: 2 },
  { name: "Brightening", count: 1 },
  { name: "Sensitive Skin", count: 0 }
];

const ProductsPage = () => {
  const [products, setProducts] = useState(allProducts);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const applyFilters = () => {
    let filteredProducts = [...allProducts];
    
    // Filter by price range
    filteredProducts = filteredProducts.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        selectedCategories.map(cat => cat.toLowerCase()).includes(product.category)
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filteredProducts.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      default:
        // Featured: bestsellers first, then by rating
        filteredProducts.sort((a, b) => {
          if (a.isBestseller && !b.isBestseller) return -1;
          if (!a.isBestseller && b.isBestseller) return 1;
          return b.rating - a.rating;
        });
    }
    
    setProducts(filteredProducts);
    // Close filters panel on mobile after applying
    if (window.innerWidth < 768) {
      setFiltersOpen(false);
    }
  };
  
  const resetFilters = () => {
    setPriceRange([0, 200]);
    setSelectedCategories([]);
    setSearchQuery("");
    setSortBy("featured");
    setProducts(allProducts);
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="bg-cream py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl text-burgundy mb-4">
            Our Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our complete collection of premium beauty and skincare products, 
            crafted with natural ingredients for radiant, healthy skin.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-10">
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
              onChange={(e) => {
                setSortBy(e.target.value);
                setTimeout(applyFilters, 0);
              }}
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
                    max={200}
                    step={10}
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
                        id={`category-${category.name.toLowerCase()}`}
                        checked={selectedCategories.includes(category.name.toLowerCase())}
                        onCheckedChange={() => toggleCategory(category.name.toLowerCase())}
                      />
                      <label
                        htmlFor={`category-${category.name.toLowerCase()}`}
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
                  onClick={applyFilters}
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
                    max={200}
                    step={10}
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
                        id={`desktop-category-${category.name.toLowerCase()}`}
                        checked={selectedCategories.includes(category.name.toLowerCase())}
                        onCheckedChange={() => toggleCategory(category.name.toLowerCase())}
                      />
                      <label
                        htmlFor={`desktop-category-${category.name.toLowerCase()}`}
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
                  onClick={applyFilters}
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
              <p className="text-gray-500">{products.length} products</p>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setTimeout(applyFilters, 0);
                    }}
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
            
            {products.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-playfair mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <Button
                  onClick={resetFilters}
                  className="bg-burgundy hover:bg-burgundy-light text-white"
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 border-none">
                    <CardContent className="p-0">
                      <div className="relative">
                        {/* Product Image */}
                        <Link to={`/product/${product.id}`}>
                          <div className="aspect-square overflow-hidden rounded-t-lg">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </Link>
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.isBestseller && (
                            <span className="bg-burgundy text-white text-xs px-2 py-1 rounded-full">Bestseller</span>
                          )}
                          {product.isNew && (
                            <span className="bg-rose text-burgundy text-xs px-2 py-1 rounded-full">New</span>
                          )}
                        </div>
                        
                        {/* Wishlist button */}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-rose-light transition-colors"
                        >
                          <Heart 
                            className={`h-5 w-5 ${wishlist.includes(product.id) ? 'text-red-500 fill-red-500' : 'text-burgundy'}`} 
                          />
                        </button>
                        
                        {/* Quick add button */}
                        <div className="absolute bottom-4 left-0 right-0 mx-auto w-4/5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button className="w-full bg-burgundy hover:bg-burgundy-light text-white">
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-4">
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-playfair text-xl mb-2 hover:text-burgundy transition-colors">{product.name}</h3>
                        </Link>
                        <p className="text-burgundy font-semibold mb-2">${product.price}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <div className="flex items-center mr-2">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                          <span>{product.rating} ({product.reviews})</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
