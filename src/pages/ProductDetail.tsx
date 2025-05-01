
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart, Check, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  stock: number;
  created_at: string;
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  
  const { addToCart } = useCartContext();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (error) throw error;
        
        if (!data) {
          setError("Product not found");
        } else {
          setProduct(data);
        }
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  const handleIncreaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(q => q + 1);
    } else {
      toast.error("Maximum available quantity reached");
    }
  };
  
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };
  
  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url || "",
        quantity,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const handleAddToWishlist = async () => {
    if (!product || !isLoggedIn || !user) {
      toast.error("Please log in to add items to your wishlist");
      return;
    }
    
    setIsAddingToWishlist(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        toast.info("This item is already in your wishlist");
      } else {
        const { error: insertError } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            product_id: product.id
          });
        
        if (insertError) throw insertError;
        
        toast.success("Added to your wishlist");
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      toast.error("Failed to add to wishlist");
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <Skeleton className="w-full h-[400px] rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-40 w-full" />
              <div className="flex gap-4 mt-6">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Alert variant="destructive">
            <AlertDescription>
              {error || "Product not found"}
            </AlertDescription>
          </Alert>
          <Button asChild className="mt-6 bg-burgundy hover:bg-burgundy-light">
            <Link to="/products">Back to Products</Link>
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
        <Link to="/products" className="inline-flex items-center text-burgundy hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden border">
            <AspectRatio ratio={1}>
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </AspectRatio>
          </div>
          
          {/* Product Details */}
          <div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span>{product.category || 'Uncategorized'}</span>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>4.5 (125 reviews)</span>
              </div>
            </div>
            
            <h1 className="font-playfair text-3xl md:text-4xl text-burgundy mb-3">
              {product.name}
            </h1>
            
            <p className="text-2xl font-semibold mb-6">${product.price.toFixed(2)}</p>
            
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </div>
            
            <div className="flex items-center mb-6">
              <span className="text-sm font-medium mr-2">Availability:</span>
              {product.stock > 0 ? (
                <span className="text-green-600 flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </div>
            
            {product.stock > 0 && (
              <div className="mb-8">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={handleDecreaseQuantity}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-1 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={handleIncreaseQuantity}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock <= 0}
                className="bg-burgundy hover:bg-burgundy-light flex-1 md:flex-none md:min-w-[180px]"
              >
                {isAddingToCart ? (
                  "Adding..."
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist}
                className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white flex-1 md:flex-none md:min-w-[180px]"
              >
                {isAddingToWishlist ? (
                  "Adding..."
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Wishlist
                  </>
                )}
              </Button>
            </div>
            
            {/* Additional product information */}
            <div className="mt-10">
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="pt-4">
                  <div className="text-sm space-y-4">
                    <p>
                      <strong>Category:</strong> {product.category || 'Uncategorized'}
                    </p>
                    <p>
                      <strong>Product ID:</strong> {product.id}
                    </p>
                    <p>
                      <strong>Added on:</strong> {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="shipping" className="pt-4">
                  <div className="text-sm space-y-4">
                    <div className="flex items-start">
                      <Info className="w-4 h-4 mr-2 mt-1 text-burgundy" />
                      <p>Free shipping on orders over $100</p>
                    </div>
                    <div className="flex items-start">
                      <Info className="w-4 h-4 mr-2 mt-1 text-burgundy" />
                      <p>Standard shipping: 3-5 business days</p>
                    </div>
                    <div className="flex items-start">
                      <Info className="w-4 h-4 mr-2 mt-1 text-burgundy" />
                      <p>Express shipping available at checkout</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="pt-4">
                  <div className="text-sm">
                    <p className="text-gray-500">Customer reviews will be displayed here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
