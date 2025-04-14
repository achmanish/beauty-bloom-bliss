import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    id: 1,
    name: "Vitamin C Face Serum",
    price: 599,
    rating: 4.8,
    reviews: 1244,
    image: "https://images.mamaearth.in/catalog/product/v/i/vit-c-serum-1.jpg",
    badgeText: "Bestseller",
    category: "skincare",
    isNew: false
  },
  {
    id: 2,
    name: "Ubtan Face Wash",
    price: 259,
    rating: 4.7,
    reviews: 892,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-face-wash_1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: true
  },
  {
    id: 3,
    name: "Onion Hair Oil",
    price: 399,
    rating: 4.9,
    reviews: 2156,
    image: "https://images.mamaearth.in/catalog/product/o/n/onion-hair-oil-250ml.jpg",
    badgeText: "Limited",
    category: "haircare",
    isNew: false
  },
  {
    id: 4,
    name: "Tea Tree Face Wash",
    price: 249,
    rating: 4.7,
    reviews: 723,
    image: "https://images.mamaearth.in/catalog/product/t/e/tea-tree-face-wash.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  }
];

const Products = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="font-playfair text-4xl text-burgundy">Bestsellers</h2>
          <Link to="/products" className="text-burgundy hover:underline">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    {product.badgeText && (
                      <Badge className="bg-burgundy text-white">{product.badgeText}</Badge>
                    )}
                    {product.isNew && (
                      <Badge className="bg-rose text-burgundy">New</Badge>
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
      </div>
    </section>
  );
};

export default Products;
