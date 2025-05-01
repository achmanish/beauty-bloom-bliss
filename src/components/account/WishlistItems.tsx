
import { Button } from "@/components/ui/button";
import { X, ShoppingCart, Heart } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router-dom";

interface WishlistItemType {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

interface WishlistItemsProps {
  wishlistItems: WishlistItemType[];
  isLoadingWishlist: boolean;
  onRemoveWishlistItem: (itemId: string) => Promise<void>;
  onAddToCart: (productId: string) => Promise<void>;
}

const WishlistItems = ({
  wishlistItems,
  isLoadingWishlist,
  onRemoveWishlistItem,
  onAddToCart
}: WishlistItemsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">My Wishlist</h2>

      {isLoadingWishlist ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading your wishlist...</p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border p-8">
          <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-4">Save items you like to your wishlist while shopping</p>
          <Button asChild className="bg-burgundy hover:bg-burgundy-light">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
              <Link to={`/product/${item.product_id}`} className="block">
                <div className="w-full">
                  <AspectRatio ratio={4/3}>
                    <img 
                      src={item.product.image_url} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>

                <div className="p-4">
                  <h3 className="font-medium truncate">{item.product.name}</h3>
                  <p className="text-burgundy mt-1 font-semibold">${item.product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.product.stock > 0 ? `In stock: ${item.product.stock}` : "Out of stock"}
                  </p>
                </div>
              </Link>

              <div className="border-t p-4 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onRemoveWishlistItem(item.id)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                  onClick={() => onAddToCart(item.product_id)}
                  disabled={item.product.stock <= 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistItems;
