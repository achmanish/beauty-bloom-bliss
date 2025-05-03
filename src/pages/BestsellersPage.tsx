
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { allProducts, Product } from "@/data/productData";
import { Separator } from "@/components/ui/separator";

const BestsellersPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Filter bestseller products
    setLoading(true);
    const bestsellerProducts = allProducts.filter(product => product.isBestseller === true);
    setProducts(bestsellerProducts);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="bg-cream py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-3xl md:text-5xl text-burgundy mb-4">
            Our Bestsellers
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most loved products that have won the hearts of our customers.
            Quality and results that speak for themselves.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy"></div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-medium">{products.length} products</h2>
            </div>
            <Separator className="mb-8" />
            
            {products.length > 0 ? (
              <ProductGrid customProducts={products} showTitle={false} />
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium text-gray-600 mb-4">
                  No bestsellers found
                </h3>
                <p className="text-gray-500">
                  Please check back later for our curated bestsellers.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default BestsellersPage;
