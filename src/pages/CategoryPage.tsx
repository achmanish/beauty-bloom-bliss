
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { allProducts, Product } from "@/data/productData";
import { Separator } from "@/components/ui/separator";

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter products by category
    setLoading(true);
    const filteredProducts = allProducts.filter(product => 
      product.category.toLowerCase() === categoryName?.toLowerCase()
    );
    setProducts(filteredProducts);
    setLoading(false);
  }, [categoryName]);

  // Format the category name for display
  const formattedCategoryName = categoryName ? 
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : "";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="bg-cream py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-3xl md:text-5xl text-burgundy mb-4">
            {formattedCategoryName}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our {formattedCategoryName.toLowerCase()} collection, featuring premium beauty products 
            designed to enhance your natural beauty.
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
                  No products found in this category
                </h3>
                <p className="text-gray-500">
                  Please check our other categories or come back later.
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

export default CategoryPage;
