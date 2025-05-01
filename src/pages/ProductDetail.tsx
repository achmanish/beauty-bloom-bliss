import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingBag, Check, Minus, Plus, Star } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCartContext } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  // Additional fields
  size?: string;
  ingredients?: string;
  usage?: string;
  benefits?: string;
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { addToCart } = useCartContext();
  const { addToWishlist, removeFromWishlist, wishlistItems, isInWishlist } = useWishlist();
  const { user } = useAuth();
  
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) return;
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setProduct(data as Product);
          // Fetch related products in the same category
          fetchRelatedProducts(data.category);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  // Check if product is in wishlist
  useEffect(() => {
    if (product && wishlistItems && wishlistItems.length > 0) {
      const isInWishlistItem = wishlistItems.some(item => item.product_id === product.id);
      setInWishlist(isInWishlistItem);
    }
  }, [product, wishlistItems]);
  
  const fetchRelatedProducts = async (category: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .neq('id', productId)
        .limit(4);
      
      if (error) {
        throw error;
      }
      
      setRelatedProducts(data as Product[]);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: quantity,
      size: product.size || '',
    });
    
    toast.success(`${product.name} added to cart`);
  };
  
  const handleWishlist = () => {
    if (!product) return;
    
    if (!user) {
      toast.error('Please log in to add items to your wishlist');
      return;
    }
    
    if (inWishlist) {
      // Find the wishlist item with this product ID
      const wishlistItem = wishlistItems.find(item => item.product_id === product.id);
      if (wishlistItem) {
        removeFromWishlist(wishlistItem.id);
        setInWishlist(false);
        toast.success(`${product.name} removed from wishlist`);
      }
    } else {
      addToWishlist(product.id, {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        stock: product.stock
      });
      setInWishlist(true);
      toast.success(`${product.name} added to wishlist`);
    }
  };
  
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="bg-burgundy hover:bg-burgundy-light">
              <Link to="/products">Back to Products</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-burgundy">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-burgundy">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-burgundy">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={product.image_url || 'https://via.placeholder.com/500'} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-playfair text-burgundy mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-current text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">(24 reviews)</span>
            </div>
            
            <div className="text-2xl font-medium mb-6">${product.price.toFixed(2)}</div>
            
            <p className="text-gray-700 mb-8">{product.description}</p>
            
            {product.stock > 0 ? (
              <div className="flex items-center text-green-600 mb-6">
                <Check className="w-5 h-5 mr-2" />
                <span>In Stock ({product.stock} available)</span>
              </div>
            ) : (
              <div className="text-red-500 mb-6">Out of Stock</div>
            )}
            
            {/* Category Badge */}
            <div className="mb-8">
              <span className="text-sm text-gray-500 mr-2">Category:</span>
              <Badge variant="outline" className="bg-rose text-burgundy hover:bg-rose">
                {product.category}
              </Badge>
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center mb-8">
              <span className="mr-4 text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                  onClick={decrementQuantity} 
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  disabled={quantity === 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  onClick={incrementQuantity} 
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  disabled={product.stock <= quantity}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleAddToCart}
                className="w-full sm:w-auto bg-burgundy hover:bg-burgundy-light text-white"
                disabled={product.stock === 0}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              
              <Button 
                onClick={handleWishlist}
                variant="outline" 
                className={`w-full sm:w-auto ${
                  inWishlist 
                    ? "bg-rose text-burgundy hover:bg-rose-light" 
                    : "border-burgundy text-burgundy hover:bg-rose hover:text-burgundy"
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${inWishlist ? "fill-burgundy" : ""}`} />
                {inWishlist ? "In Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start mb-8">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="usage">How to Use</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="text-gray-700">
              <h3 className="font-medium mb-4 text-xl">Product Details</h3>
              <p className="mb-4">{product.description}</p>
              {product.size && (
                <div className="mb-2">
                  <span className="font-medium">Size:</span> {product.size}
                </div>
              )}
              <div className="mb-2">
                <span className="font-medium">SKU:</span> {product.id.substring(0, 8)}
              </div>
            </TabsContent>
            <TabsContent value="ingredients" className="text-gray-700">
              <h3 className="font-medium mb-4 text-xl">Ingredients</h3>
              {product.ingredients ? (
                <p>{product.ingredients}</p>
              ) : (
                <p>No ingredient information available for this product.</p>
              )}
            </TabsContent>
            <TabsContent value="usage" className="text-gray-700">
              <h3 className="font-medium mb-4 text-xl">How to Use</h3>
              {product.usage ? (
                <p>{product.usage}</p>
              ) : (
                <p>No usage information available for this product.</p>
              )}
            </TabsContent>
            <TabsContent value="benefits" className="text-gray-700">
              <h3 className="font-medium mb-4 text-xl">Benefits</h3>
              {product.benefits ? (
                <p>{product.benefits}</p>
              ) : (
                <p>No benefits information available for this product.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-playfair text-burgundy mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link to={`/product/${relatedProduct.id}`} key={relatedProduct.id} className="group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <img 
                      src={relatedProduct.image_url || 'https://via.placeholder.com/300'} 
                      alt={relatedProduct.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium group-hover:text-burgundy transition-colors">{relatedProduct.name}</h3>
                  <p className="mt-2">${relatedProduct.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
