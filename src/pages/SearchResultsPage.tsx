
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { allProducts, Product } from "@/data/productData";
import { Separator } from "@/components/ui/separator";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    // Filter products by search query
    const searchResults = allProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) || 
      product.description?.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setProducts(searchResults);
  }, [query]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="bg-cream py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-2xl md:text-3xl text-burgundy mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            {products.length} products found
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <Separator className="mb-8" />
        
        {products.length > 0 ? (
          <ProductGrid customProducts={products} showTitle={false} />
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-600 mb-4">
              No products match your search
            </h3>
            <p className="text-gray-500">
              Try using different keywords or browse our categories.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
