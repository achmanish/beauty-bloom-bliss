
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
};

const Wishlist = () => {
  const { user, isLoggedIn } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock fetch wishlist data - in a real app, this would come from Supabase
  useEffect(() => {
    const fetchWishlist = () => {
      // Simulate API fetch delay
      setTimeout(() => {
        // Mock data - this would be replaced with an actual API call
        const mockItems: WishlistItem[] = [
          {
            id: "1",
            name: "Luxury Face Serum",
            price: 59.99,
            image: "/placeholder.svg",
            description: "Advanced anti-aging serum with hyaluronic acid",
            inStock: true,
          },
          {
            id: "2",
            name: "Hydrating Facial Mist",
            price: 28.50,
            image: "/placeholder.svg",
            description: "Refreshing mist with rose water and aloe vera",
            inStock: true,
          },
          {
            id: "3",
            name: "Overnight Recovery Cream",
            price: 45.00,
            image: "/placeholder.svg",
            description: "Rich night cream with retinol and peptides",
            inStock: false,
          }
        ];
        setWishlistItems(mockItems);
        setIsLoading(false);
      }, 800);
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = (id: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    toast.success("Item removed from wishlist");
  };

  const addToCart = (item: WishlistItem) => {
    // In a real implementation, this would add to cart in Supabase or localStorage
    toast.success(`${item.name} added to your cart`);
  };

  const moveAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock);
    if (inStockItems.length === 0) {
      toast.error("No in-stock items to add to cart");
      return;
    }
    
    // Would add all items to cart in a real implementation
    toast.success(`${inStockItems.length} items added to your cart`);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Heart className="mx-auto h-16 w-16 text-rose mb-6" />
          <h1 className="font-playfair text-3xl md:text-4xl text-burgundy mb-6">Your Wishlist</h1>
          <p className="text-gray-600 mb-8">Please sign in to view your wishlist</p>
          <Button asChild className="bg-burgundy hover:bg-burgundy-light">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl text-burgundy">Your Wishlist</h1>
          {wishlistItems.length > 0 && (
            <Button 
              onClick={moveAllToCart} 
              className="bg-burgundy hover:bg-burgundy-light"
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add All to Cart
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-64"></div>
            ))}
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div 
                key={item.id} 
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:bg-gray-100"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4 text-burgundy" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1 line-clamp-1">{item.name}</h3>
                  <p className="text-burgundy font-semibold mb-2">${item.price.toFixed(2)}</p>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${item.inStock ? 'text-green-600' : 'text-red-500'}`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    
                    <Button
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock}
                      className="bg-burgundy hover:bg-burgundy-light text-white"
                      size="sm"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg bg-cream-light">
            <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h2 className="text-2xl font-playfair text-burgundy mb-3">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Items added to your wishlist will appear here</p>
            <Button asChild className="bg-burgundy hover:bg-burgundy-light">
              <Link to="/products">Explore Products</Link>
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
