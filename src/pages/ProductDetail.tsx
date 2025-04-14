
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Truck, 
  Shield, 
  RefreshCw, 
  Star, 
  Minus, 
  Plus, 
  Heart, 
  Share2, 
  Info,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Products from "@/components/Products";

// Mock product data
const products = [
  {
    id: "1",
    name: "Rose Glow Serum",
    price: 89,
    rating: 4.8,
    reviews: 124,
    description: "Our luxurious Rose Glow Serum is formulated with pure rose extract and hyaluronic acid to deeply hydrate and revitalize your skin. This lightweight serum absorbs quickly, leaving your skin glowing and refreshed.",
    benefits: [
      "Deeply hydrates skin",
      "Improves skin elasticity",
      "Reduces fine lines",
      "Boosts natural radiance"
    ],
    ingredients: "Water, Rosa Damascena Flower Extract, Glycerin, Butylene Glycol, Sodium Hyaluronate, Phenoxyethanol, Hydroxyethylcellulose, Disodium EDTA, Citric Acid, Fragrance",
    directions: "Apply 2-3 drops to clean, damp skin morning and evening. Gently pat into face and neck. Follow with moisturizer.",
    images: [
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570194065650-d707c41c4754?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611930022073-84f39e061afd?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { name: "30ml", price: 89 },
      { name: "50ml", price: 129 },
      { name: "100ml", price: 199 }
    ],
    category: "skincare",
    tags: ["serum", "hydrating", "anti-aging"],
    stockStatus: "In Stock"
  },
  // More products would be defined here...
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id) || products[0]; // Fallback to first product if not found
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  const addToCart = () => {
    toast.success(`Added ${quantity} ${product.name} to your cart`, {
      description: `Size: ${selectedSize.name}`
    });
  };
  
  const addToWishlist = () => {
    toast.success(`Added ${product.name} to your wishlist`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-cream py-2">
        <div className="container mx-auto px-4">
          <div className="text-sm text-gray-500">
            <Link to="/" className="hover:text-burgundy">Home</Link> / 
            <Link to="/products" className="hover:text-burgundy"> Products</Link> / 
            <span className="text-burgundy"> {product.name}</span>
          </div>
        </div>
      </div>
      
      {/* Product Details */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="mb-4 aspect-square overflow-hidden rounded-lg">
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setMainImage(image)}
                    className={`aspect-square overflow-hidden rounded-md ${mainImage === image ? 'ring-2 ring-burgundy' : ''}`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} view ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div>
              <div className="flex justify-between">
                <div>
                  <h1 className="font-playfair text-3xl md:text-4xl text-burgundy mb-2">{product.name}</h1>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={addToWishlist}
                    className="p-2 text-burgundy hover:bg-rose-light rounded-full transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-burgundy hover:bg-rose-light rounded-full transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <p className="text-2xl font-semibold text-burgundy mb-6">${selectedSize.price}</p>
              
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <RadioGroup 
                  defaultValue={selectedSize.name}
                  onValueChange={(value) => {
                    const size = product.sizes.find(s => s.name === value);
                    if (size) setSelectedSize(size);
                  }}
                  className="flex space-x-4"
                >
                  {product.sizes.map((size) => (
                    <div key={size.name} className="flex items-center">
                      <RadioGroupItem 
                        value={size.name} 
                        id={`size-${size.name}`} 
                        className="peer sr-only" 
                      />
                      <label
                        htmlFor={`size-${size.name}`}
                        className="flex min-w-[60px] cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium transition-colors peer-data-[state=checked]:border-burgundy peer-data-[state=checked]:bg-rose peer-data-[state=checked]:text-burgundy hover:bg-gray-100"
                      >
                        {size.name}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Quantity & Add to Cart */}
              <div className="flex items-center mb-8">
                <div className="flex items-center border border-gray-300 rounded-md mr-4">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <Button 
                  onClick={addToCart}
                  className="bg-burgundy hover:bg-burgundy-light text-white px-8 py-2 h-[42px]"
                >
                  Add to Cart
                </Button>
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center text-sm mb-6">
                <div className={`w-3 h-3 rounded-full mr-2 ${product.stockStatus === 'In Stock' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{product.stockStatus}</span>
              </div>
              
              {/* Benefits */}
              <div className="bg-cream-light p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">Benefits</h3>
                <ul className="list-disc list-inside space-y-1">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-gray-600 text-sm">{benefit}</li>
                  ))}
                </ul>
              </div>
              
              {/* Shipping Info */}
              <div className="flex flex-col space-y-4 mb-8">
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-burgundy mr-3" />
                  <span className="text-sm">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center">
                  <RefreshCw className="w-5 h-5 text-burgundy mr-3" />
                  <span className="text-sm">30-day return policy</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-burgundy mr-3" />
                  <span className="text-sm">Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Product Tabs */}
      <section className="py-10 bg-cream-light">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="details">
            <TabsList className="bg-white w-full justify-start border-b mb-6">
              <TabsTrigger value="details" className="text-lg">Details</TabsTrigger>
              <TabsTrigger value="ingredients" className="text-lg">Ingredients</TabsTrigger>
              <TabsTrigger value="howToUse" className="text-lg">How to Use</TabsTrigger>
              <TabsTrigger value="reviews" className="text-lg">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="bg-white p-6 rounded-lg">
              <h3 className="font-playfair text-2xl mb-4">Product Details</h3>
              <p className="mb-4">{product.description}</p>
              <h4 className="font-medium mb-2">Benefits</h4>
              <ul className="list-disc list-inside mb-4">
                {product.benefits.map((benefit, idx) => (
                  <li key={idx} className="text-gray-600 mb-1">{benefit}</li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="ingredients" className="bg-white p-6 rounded-lg">
              <h3 className="font-playfair text-2xl mb-4">Ingredients</h3>
              <p className="mb-4">{product.ingredients}</p>
              <div className="flex items-start bg-cream p-4 rounded-lg">
                <Info className="w-5 h-5 text-burgundy mr-3 mt-0.5" />
                <p className="text-sm">Our products are formulated without parabens, sulfates, and phthalates. All ingredients are ethically sourced and cruelty-free.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="howToUse" className="bg-white p-6 rounded-lg">
              <h3 className="font-playfair text-2xl mb-4">How to Use</h3>
              <p className="mb-6">{product.directions}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-rose h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-playfair text-2xl text-burgundy">1</span>
                  </div>
                  <p className="text-sm">Apply to clean, damp skin</p>
                </div>
                <div className="text-center">
                  <div className="bg-rose h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-playfair text-2xl text-burgundy">2</span>
                  </div>
                  <p className="text-sm">Gently massage in circular motions</p>
                </div>
                <div className="text-center">
                  <div className="bg-rose h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-playfair text-2xl text-burgundy">3</span>
                  </div>
                  <p className="text-sm">Follow with moisturizer</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="bg-white p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-playfair text-2xl">Customer Reviews</h3>
                <Button className="bg-burgundy hover:bg-burgundy-light text-white">Write a Review</Button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="bg-cream p-6 rounded-lg md:w-1/3">
                  <div className="text-center">
                    <div className="text-5xl font-playfair text-burgundy mb-2">{product.rating}</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{product.reviews} reviews</p>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="space-y-6">
                    {/* Sample review */}
                    <div className="border-b pb-6">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h4 className="font-medium">Emma Wilson</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">2 weeks ago</div>
                      </div>
                      <p className="text-gray-600">This serum is amazing! I've been using it for two weeks and already notice a difference in my skin's texture and glow. Will definitely repurchase.</p>
                    </div>
                    
                    {/* Sample review */}
                    <div className="border-b pb-6">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h4 className="font-medium">James Peterson</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">1 month ago</div>
                      </div>
                      <p className="text-gray-600">The serum absorbs well and doesn't feel greasy. I like the subtle rose scent. Giving it 4 stars because I wish the bottle was bigger for the price.</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="mt-6 w-full">Load More Reviews</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-3xl text-center mb-8 text-burgundy">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg p-1">
                <AccordionTrigger className="hover:no-underline px-4">
                  Is this product suitable for sensitive skin?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  Yes, our Rose Glow Serum is formulated to be gentle and is suitable for most skin types, including sensitive skin. However, we always recommend doing a patch test first if you have particularly reactive skin.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border rounded-lg p-1">
                <AccordionTrigger className="hover:no-underline px-4">
                  How long will one bottle last?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  With regular daily use (morning and evening), the 30ml bottle typically lasts 2-3 months. The 50ml bottle should last 4-5 months, and the 100ml bottle 8-10 months.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border rounded-lg p-1">
                <AccordionTrigger className="hover:no-underline px-4">
                  Can I use this with other skincare products?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  Yes, our Rose Glow Serum works well in combination with other skincare products. Apply it after cleansing and before moisturizer for best results. It can be used alongside other serums, but we recommend applying thinner consistencies first.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border rounded-lg p-1">
                <AccordionTrigger className="hover:no-underline px-4">
                  Is this product cruelty-free and vegan?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  Yes, all our products are cruelty-free and never tested on animals. The Rose Glow Serum is also vegan and does not contain any animal-derived ingredients.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
      
      {/* You May Also Like */}
      <section className="py-10 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-3xl text-center mb-8 text-burgundy">You May Also Like</h2>
          <Products />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
