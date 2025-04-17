
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useCartContext } from "@/pages/AdminDashboard"; // Import the cart context

// Import a large selection of products (first 100)
import { allProducts } from "@/data/productData";

interface ProductGridProps {
  limit?: number;
  showTitle?: boolean;
  title?: string;
  category?: string;
}

const ProductGrid = ({ limit = 100, showTitle = true, title = "Our Products", category }: ProductGridProps) => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { toast } = useToast();
  const cartContext = useCartContext();

  // Function to update cart in localStorage and dispatch event
  const updateCart = (items: any[]) => {
    localStorage.setItem('cartItems', JSON.stringify(items));
    
    // Dispatch a custom event for the same tab
    const event = new CustomEvent('cartUpdated', { detail: items.length });
    window.dispatchEvent(event);
    
    // Update context if available
    if (cartContext?.updateCartCount) {
      cartContext.updateCartCount(items.length);
    }
  };

  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast({
        title: "Removed from wishlist",
        description: "Product has been removed from your wishlist",
      });
    } else {
      setWishlist([...wishlist, productId]);
      toast({
        title: "Added to wishlist",
        description: "Product has been added to your wishlist",
      });
    }
  };

  const addToCart = (product: any) => {
    // Get current cart items
    const cartItems = localStorage.getItem('cartItems') 
      ? JSON.parse(localStorage.getItem('cartItems') || '[]') 
      : [];
    
    // Check if product is already in cart
    const existingItem = cartItems.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      // Update quantity
      const updatedItems = cartItems.map((item: any) => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
      updateCart(updatedItems);
    } else {
      // Add new item
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      };
      updateCart([...cartItems, newItem]);
    }
    
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart",
    });
  };
  
  // Filter products by category if provided
  let displayProducts = category 
    ? allProducts.filter(p => p.category === category) 
    : allProducts;
  
  // Apply limit to number of products displayed
  displayProducts = displayProducts.slice(0, limit);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-playfair text-3xl md:text-4xl text-burgundy">{title}</h2>
            <Link to="/products" className="text-burgundy hover:underline">
              View All
            </Link>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {displayProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 border-none h-full">
              <CardContent className="p-0 h-full flex flex-col">
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
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.badgeText && (
                      <Badge className="bg-burgundy text-white text-xs px-2 py-1">{product.badgeText}</Badge>
                    )}
                    {product.isNew && (
                      <Badge className="bg-rose text-burgundy text-xs px-2 py-1">New</Badge>
                    )}
                  </div>
                  
                  {/* Wishlist button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-rose-light transition-colors"
                  >
                    <Heart 
                      className={`h-4 w-4 ${wishlist.includes(product.id) ? 'text-red-500 fill-red-500' : 'text-burgundy'}`} 
                    />
                  </button>
                </div>
                
                {/* Product Info */}
                <div className="p-3 flex flex-col flex-grow">
                  <Link to={`/product/${product.id}`} className="flex-grow">
                    <h3 className="font-medium text-sm md:text-base mb-1 hover:text-burgundy transition-colors line-clamp-2">{product.name}</h3>
                  </Link>
                  <p className="text-burgundy font-semibold text-sm md:text-base mb-1">${(product.price/100).toFixed(2)}</p>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <div className="flex items-center mr-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 ${
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
                  
                  <Button 
                    onClick={() => addToCart(product)} 
                    size="sm" 
                    className="mt-auto w-full bg-burgundy hover:bg-burgundy-light text-white text-xs transition-all duration-200 hover:scale-105"
                  >
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
