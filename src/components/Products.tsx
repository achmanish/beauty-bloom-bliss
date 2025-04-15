
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
  },
  {
    id: 5,
    name: "Aloe Vera Gel",
    price: 299,
    rating: 4.8,
    reviews: 1876,
    image: "https://images.mamaearth.in/catalog/product/a/l/aloe-vera-gel-web-1.jpg",
    badgeText: "Bestseller",
    category: "skincare",
    isNew: false
  },
  {
    id: 6,
    name: "Ubtan Nourishing Hair Removal Kit",
    price: 449,
    rating: 4.5,
    reviews: 621,
    image: "https://images.mamaearth.in/catalog/product/u/h/uhrc_1.jpg",
    badgeText: "",
    category: "bodycare",
    isNew: false
  },
  {
    id: 7,
    name: "Rice Water Shampoo",
    price: 349,
    rating: 4.6,
    reviews: 1432,
    image: "https://images.mamaearth.in/catalog/product/r/i/rice-shampoo-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 8,
    name: "Charcoal Face Wash",
    price: 249,
    rating: 4.5,
    reviews: 834,
    image: "https://images.mamaearth.in/catalog/product/c/h/charcoal-face-wash-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 9,
    name: "Bhringraj Hair Oil",
    price: 399,
    rating: 4.7,
    reviews: 1034,
    image: "https://images.mamaearth.in/catalog/product/b/h/bhringraj-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: true
  },
  {
    id: 10,
    name: "Ubtan Face Mask",
    price: 499,
    rating: 4.6,
    reviews: 524,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-face-mask-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 11,
    name: "Tea Tree Body Wash",
    price: 299,
    rating: 4.5,
    reviews: 712,
    image: "https://images.mamaearth.in/catalog/product/t/e/tea-tree-body-wash.jpg",
    badgeText: "",
    category: "bodycare",
    isNew: false
  },
  {
    id: 12,
    name: "Vitamin C Body Lotion",
    price: 399,
    rating: 4.7,
    reviews: 923,
    image: "https://images.mamaearth.in/catalog/product/v/i/vitamin-c-body-lotion.jpg",
    badgeText: "",
    category: "bodycare",
    isNew: true
  },
  {
    id: 13,
    name: "Bye Bye Blemishes Face Cream",
    price: 459,
    rating: 4.6,
    reviews: 827,
    image: "https://images.mamaearth.in/catalog/product/b/y/bye-bye-blemishes-1_1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 14,
    name: "Onion Conditioner",
    price: 349,
    rating: 4.6,
    reviews: 1267,
    image: "https://images.mamaearth.in/catalog/product/o/n/onion-cond-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 15,
    name: "Ubtan Body Wash",
    price: 299,
    rating: 4.5,
    reviews: 587,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-body-wash-1_1.jpg",
    badgeText: "",
    category: "bodycare",
    isNew: false
  },
  {
    id: 16,
    name: "Onion Hair Mask",
    price: 499,
    rating: 4.7,
    reviews: 735,
    image: "https://images.mamaearth.in/catalog/product/o/n/onion-hair-mask-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 17,
    name: "Rose Body Lotion",
    price: 399,
    rating: 4.6,
    reviews: 687,
    image: "https://images.mamaearth.in/catalog/product/r/o/rose-body-lotion.jpg",
    badgeText: "",
    category: "bodycare",
    isNew: false
  },
  {
    id: 18,
    name: "Ubtan & Turmeric Face Wash",
    price: 249,
    rating: 4.8,
    reviews: 1124,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-turmeric-face-wash-1.jpg",
    badgeText: "Bestseller",
    category: "skincare",
    isNew: false
  },
  {
    id: 19,
    name: "Aloe Vera Sunscreen SPF 50",
    price: 399,
    rating: 4.6,
    reviews: 823,
    image: "https://images.mamaearth.in/catalog/product/s/u/sunscreen_2.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 20,
    name: "Tea Tree & Neem Face Serum",
    price: 599,
    rating: 4.5,
    reviews: 634,
    image: "https://images.mamaearth.in/catalog/product/t/e/tea-tree-face-serum-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: true
  },
  {
    id: 21,
    name: "Ubtan & Saffron Night Cream",
    price: 549,
    rating: 4.7,
    reviews: 487,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-night-cream-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 22,
    name: "Rice Water Conditioner",
    price: 349,
    rating: 4.6,
    reviews: 926,
    image: "https://images.mamaearth.in/catalog/product/r/i/rice-cond-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 23,
    name: "Onion Hair Serum",
    price: 449,
    rating: 4.8,
    reviews: 1245,
    image: "https://images.mamaearth.in/catalog/product/o/n/onion-hair-serum-1.jpg",
    badgeText: "Bestseller",
    category: "haircare",
    isNew: false
  },
  {
    id: 24,
    name: "Charcoal & Coffee Face Scrub",
    price: 349,
    rating: 4.6,
    reviews: 765,
    image: "https://images.mamaearth.in/catalog/product/c/h/charcoal-face-scrub-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 25,
    name: "Vitamin C Underarm Scrub",
    price: 299,
    rating: 4.5,
    reviews: 534,
    image: "https://images.mamaearth.in/catalog/product/v/i/vit-c-underam-scrub-1.jpg",
    badgeText: "",
    category: "bodycare",
    isNew: false
  },
  {
    id: 26,
    name: "Aloe Vera Hair Mask",
    price: 499,
    rating: 4.6,
    reviews: 654,
    image: "https://images.mamaearth.in/catalog/product/a/l/aloe-vera-hair-mask-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 27,
    name: "Tea Tree Face Toner",
    price: 349,
    rating: 4.7,
    reviews: 875,
    image: "https://images.mamaearth.in/catalog/product/t/e/tea-tree-toner-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 28,
    name: "Vitamin C Day Cream",
    price: 499,
    rating: 4.8,
    reviews: 934,
    image: "https://images.mamaearth.in/catalog/product/v/i/vit_c_day_cream_1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 29,
    name: "Lavender Body Lotion",
    price: 399,
    rating: 4.5,
    reviews: 567,
    image: "https://images.mamaearth.in/catalog/product/l/a/lavender-body-lotion.jpg",
    badgeText: "",
    category: "bodycare",
    isNew: false
  },
  {
    id: 30,
    name: "Onion Shampoo Bar",
    price: 349,
    rating: 4.4,
    reviews: 432,
    image: "https://images.mamaearth.in/catalog/product/o/n/onion-shampoo-bar-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: true
  },
  // Adding more products to reach at least 70
  {
    id: 31,
    name: "Ubtan Cleansing Balm",
    price: 399,
    rating: 4.6,
    reviews: 312,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-cleansing-balm-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: true
  },
  {
    id: 32,
    name: "Rice Water Face Wash",
    price: 249,
    rating: 4.7,
    reviews: 654,
    image: "https://images.mamaearth.in/catalog/product/r/i/rice-water-face-wash-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 33,
    name: "Charcoal & Black Seed Oil Shampoo",
    price: 349,
    rating: 4.5,
    reviews: 423,
    image: "https://images.mamaearth.in/catalog/product/c/h/charcoal-shampoo-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 34,
    name: "Vitamin C Foaming Face Wash",
    price: 399,
    rating: 4.8,
    reviews: 765,
    image: "https://images.mamaearth.in/catalog/product/v/i/vitamin-c-foaming-face-wash-1.jpg",
    badgeText: "Bestseller",
    category: "skincare",
    isNew: false
  },
  {
    id: 35,
    name: "Onion Scalp Serum",
    price: 599,
    rating: 4.6,
    reviews: 534,
    image: "https://images.mamaearth.in/catalog/product/o/n/onion-scalp-serum-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 36,
    name: "Aloe Vera & Ashwagandha Hair Mask",
    price: 499,
    rating: 4.7,
    reviews: 432,
    image: "https://images.mamaearth.in/catalog/product/a/l/aloe-vera-ashwagandha-hair-mask-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 37,
    name: "Vitamin C Night Cream",
    price: 549,
    rating: 4.8,
    reviews: 675,
    image: "https://images.mamaearth.in/catalog/product/v/i/vitamin-c-night-cream-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 38,
    name: "Ubtan Hair Mask",
    price: 499,
    rating: 4.5,
    reviews: 321,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-hair-mask-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 39,
    name: "Tea Tree Anti-Dandruff Hair Oil",
    price: 399,
    rating: 4.7,
    reviews: 543,
    image: "https://images.mamaearth.in/catalog/product/t/e/tea-tree-anti-dandruff-hair-oil-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 40,
    name: "Rice Face Scrub",
    price: 349,
    rating: 4.6,
    reviews: 432,
    image: "https://images.mamaearth.in/catalog/product/r/i/rice-face-scrub-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 41,
    name: "Vitamin C Lip Balm",
    price: 199,
    rating: 4.5,
    reviews: 321,
    image: "https://images.mamaearth.in/catalog/product/v/i/vitamin-c-lip-balm-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 42,
    name: "Aloe Vera & Green Tea Face Serum",
    price: 599,
    rating: 4.7,
    reviews: 432,
    image: "https://images.mamaearth.in/catalog/product/a/l/aloe-vera-green-tea-face-serum-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: true
  },
  {
    id: 43,
    name: "Ubtan Hair Removal Cream",
    price: 349,
    rating: 4.4,
    reviews: 231,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-hair-removal-cream-1.jpg",
    badgeText: "",
    category: "bodycare",
    isNew: false
  },
  {
    id: 44,
    name: "Onion & Fenugreek Hair Mask",
    price: 499,
    rating: 4.8,
    reviews: 543,
    image: "https://images.mamaearth.in/catalog/product/o/n/onion-fenugreek-hair-mask-1.jpg",
    badgeText: "Bestseller",
    category: "haircare",
    isNew: false
  },
  {
    id: 45,
    name: "Tea Tree Face Scrub",
    price: 349,
    rating: 4.6,
    reviews: 432,
    image: "https://images.mamaearth.in/catalog/product/t/e/tea-tree-face-scrub-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 46,
    name: "Charcoal Body Wash",
    price: 299,
    rating: 4.5,
    reviews: 345,
    image: "https://images.mamaearth.in/catalog/product/c/h/charcoal-body-wash-1.jpg",
    badgeText: "",
    category: "bodycare",
    isNew: false
  },
  {
    id: 47,
    name: "Rice Hair Oil",
    price: 399,
    rating: 4.7,
    reviews: 432,
    image: "https://images.mamaearth.in/catalog/product/r/i/rice-hair-oil-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 48,
    name: "Vitamin C Sleeping Mask",
    price: 599,
    rating: 4.6,
    reviews: 321,
    image: "https://images.mamaearth.in/catalog/product/v/i/vitamin-c-sleeping-mask-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: true
  },
  {
    id: 49,
    name: "Aloe Vera Face Toner",
    price: 349,
    rating: 4.5,
    reviews: 267,
    image: "https://images.mamaearth.in/catalog/product/a/l/aloe-vera-face-toner-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 50,
    name: "Ubtan BB Cream",
    price: 499,
    rating: 4.4,
    reviews: 198,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-bb-cream-1.jpg",
    badgeText: "",
    category: "makeup",
    isNew: false
  },
  {
    id: 51,
    name: "Onion Hair Spray",
    price: 349,
    rating: 4.6,
    reviews: 286,
    image: "https://images.mamaearth.in/catalog/product/o/n/onion-hair-spray-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 52,
    name: "Charcoal Peel Off Mask",
    price: 499,
    rating: 4.7,
    reviews: 312,
    image: "https://images.mamaearth.in/catalog/product/c/h/charcoal-peel-off-mask-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 53,
    name: "Tea Tree Face Gel",
    price: 449,
    rating: 4.6,
    reviews: 243,
    image: "https://images.mamaearth.in/catalog/product/t/e/tea-tree-face-gel-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 54,
    name: "Vitamin C Compact Powder",
    price: 499,
    rating: 4.5,
    reviews: 165,
    image: "https://images.mamaearth.in/catalog/product/v/i/vitamin-c-compact-powder-1.jpg",
    badgeText: "",
    category: "makeup",
    isNew: true
  },
  {
    id: 55,
    name: "Aloe Vera & Saffron Gel",
    price: 399,
    rating: 4.6,
    reviews: 231,
    image: "https://images.mamaearth.in/catalog/product/a/l/aloe-vera-saffron-gel-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 56,
    name: "Ubtan Lip Balm",
    price: 199,
    rating: 4.4,
    reviews: 145,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-lip-balm-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 57,
    name: "Onion & Keratin Shampoo",
    price: 449,
    rating: 4.7,
    reviews: 386,
    image: "https://images.mamaearth.in/catalog/product/o/n/onion-keratin-shampoo-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 58,
    name: "Rice Radiance Day Cream",
    price: 499,
    rating: 4.6,
    reviews: 245,
    image: "https://images.mamaearth.in/catalog/product/r/i/rice-radiance-day-cream-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 59,
    name: "Vitamin C & Turmeric Face Mask",
    price: 499,
    rating: 4.8,
    reviews: 315,
    image: "https://images.mamaearth.in/catalog/product/v/i/vitamin-c-turmeric-face-mask-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 60,
    name: "Tea Tree & Neem Anti-Acne Kit",
    price: 999,
    rating: 4.7,
    reviews: 187,
    image: "https://images.mamaearth.in/catalog/product/t/e/tea-tree-neem-anti-acne-kit-1.jpg",
    badgeText: "Kit",
    category: "skincare",
    isNew: false
  },
  {
    id: 61,
    name: "Charcoal Hand Cream",
    price: 299,
    rating: 4.5,
    reviews: 134,
    image: "https://images.mamaearth.in/catalog/product/c/h/charcoal-hand-cream-1.jpg",
    badgeText: "",
    category: "bodycare",
    isNew: false
  },
  {
    id: 62,
    name: "Vitamin C & SPF 50 Sunscreen",
    price: 599,
    rating: 4.8,
    reviews: 235,
    image: "https://images.mamaearth.in/catalog/product/v/i/vitamin-c-spf-50-sunscreen-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: true
  },
  {
    id: 63,
    name: "Aloe Vera & Vitamin E Night Cream",
    price: 549,
    rating: 4.7,
    reviews: 176,
    image: "https://images.mamaearth.in/catalog/product/a/l/aloe-vera-vitamin-e-night-cream-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 64,
    name: "Ubtan Sheet Mask",
    price: 99,
    rating: 4.4,
    reviews: 146,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-sheet-mask-1.jpg",
    badgeText: "",
    category: "skincare",
    isNew: false
  },
  {
    id: 65,
    name: "Onion & Black Seed Hair Tonic",
    price: 599,
    rating: 4.6,
    reviews: 198,
    image: "https://images.mamaearth.in/catalog/product/o/n/onion-black-seed-hair-tonic-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 66,
    name: "Rice Water Fragrance Hair Oil",
    price: 449,
    rating: 4.7,
    reviews: 254,
    image: "https://images.mamaearth.in/catalog/product/r/i/rice-water-fragrance-hair-oil-1.jpg",
    badgeText: "",
    category: "haircare",
    isNew: false
  },
  {
    id: 67,
    name: "Vitamin C & Niacinamide Serum",
    price: 699,
    rating: 4.8,
    reviews: 276,
    image: "https://images.mamaearth.in/catalog/product/v/i/vitamin-c-niacinamide-serum-1.jpg",
    badgeText: "New",
    category: "skincare",
    isNew: true
  },
  {
    id: 68,
    name: "Aloe Vera & Lavender Body Lotion",
    price: 399,
    rating: 4.6,
    reviews: 165,
    image: "https://images.mamaearth.in/catalog/product/a/l/aloe-vera-lavender-body-lotion-1.jpg",
    badgeText: "",
    category: "bodycare",
    isNew: false
  },
  {
    id: 69,
    name: "Ubtan Face & Body Scrub",
    price: 349,
    rating: 4.7,
    reviews: 213,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-face-body-scrub-1.jpg",
    badgeText: "",
    category: "bodycare",
    isNew: false
  },
  {
    id: 70,
    name: "Tea Tree & Salicylic Acid Spot Gel",
    price: 349,
    rating: 4.6,
    reviews: 187,
    image: "https://images.mamaearth.in/catalog/product/t/e/tea-tree-salicylic-acid-spot-gel-1.jpg",
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

  // Only show first 8 products on homepage
  const displayProducts = products.slice(0, 8);

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
          {displayProducts.map((product) => (
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

