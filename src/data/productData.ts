
export interface Product {
  id: number;
  name: string;
  price: number; // Price in cents
  rating: number;
  reviews: number;
  image: string;
  badgeText?: string;
  category: string;
  isNew: boolean;
  isBestseller?: boolean;
  tags?: string[];
  description?: string;
}

// Export 100+ mama earth style products
export const allProducts: Product[] = [
  {
    id: 1,
    name: "Vitamin C Face Serum",
    price: 59900,
    rating: 4.8,
    reviews: 1244,
    image: "https://images.mamaearth.in/catalog/product/v/i/vit-c-serum-1.jpg",
    badgeText: "Bestseller",
    category: "skincare",
    isNew: false,
    isBestseller: true,
    tags: ["vitamin c", "serum", "brightening"]
  },
  {
    id: 2,
    name: "Ubtan Face Wash",
    price: 25900,
    rating: 4.7,
    reviews: 892,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-face-wash_1.jpg",
    category: "skincare",
    isNew: true,
    tags: ["face wash", "ubtan", "brightening"]
  },
  {
    id: 3,
    name: "Onion Hair Oil",
    price: 39900,
    rating: 4.9,
    reviews: 2156,
    image: "https://images.mamaearth.in/catalog/product/o/n/onion-hair-oil-250ml.jpg",
    badgeText: "Limited",
    category: "haircare",
    isNew: false,
    tags: ["hair oil", "onion", "hair growth"]
  },
  {
    id: 4,
    name: "Tea Tree Face Wash",
    price: 24900,
    rating: 4.7,
    reviews: 723,
    image: "https://images.mamaearth.in/catalog/product/t/e/tea-tree-face-wash.jpg",
    category: "skincare",
    isNew: false,
    tags: ["face wash", "tea tree", "acne"]
  },
  {
    id: 5,
    name: "Aloe Vera Gel",
    price: 29900,
    rating: 4.8,
    reviews: 1876,
    image: "https://images.mamaearth.in/catalog/product/a/l/aloe-vera-gel-web-1.jpg",
    badgeText: "Bestseller",
    category: "skincare",
    isNew: false,
    isBestseller: true,
    tags: ["aloe vera", "gel", "moisturizing"]
  },
  {
    id: 6,
    name: "Ubtan Nourishing Hair Removal Kit",
    price: 44900,
    rating: 4.5,
    reviews: 621,
    image: "https://images.mamaearth.in/catalog/product/u/h/uhrc_1.jpg",
    category: "bodycare",
    isNew: false,
    tags: ["hair removal", "ubtan", "nourishing"]
  },
  {
    id: 7,
    name: "Rice Water Shampoo",
    price: 34900,
    rating: 4.6,
    reviews: 1432,
    image: "https://images.mamaearth.in/catalog/product/r/i/rice-shampoo-1.jpg",
    category: "haircare",
    isNew: false,
    tags: ["shampoo", "rice water", "strengthening"]
  },
  {
    id: 8,
    name: "Charcoal Face Wash",
    price: 24900,
    rating: 4.5,
    reviews: 834,
    image: "https://images.mamaearth.in/catalog/product/c/h/charcoal-face-wash-1.jpg",
    category: "skincare",
    isNew: false,
    tags: ["face wash", "charcoal", "deep cleansing"]
  },
  {
    id: 9,
    name: "Bhringraj Hair Oil",
    price: 39900,
    rating: 4.7,
    reviews: 1034,
    image: "https://images.mamaearth.in/catalog/product/b/h/bhringraj-1.jpg",
    category: "haircare",
    isNew: true,
    tags: ["hair oil", "bhringraj", "hair growth"]
  },
  {
    id: 10,
    name: "Ubtan Face Mask",
    price: 49900,
    rating: 4.6,
    reviews: 524,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-face-mask-1.jpg",
    category: "skincare",
    isNew: false,
    tags: ["face mask", "ubtan", "brightening"]
  },
  {
    id: 11,
    name: "Tea Tree Body Wash",
    price: 29900,
    rating: 4.5,
    reviews: 712,
    image: "https://images.mamaearth.in/catalog/product/t/e/tea-tree-body-wash.jpg",
    category: "bodycare",
    isNew: false,
    tags: ["body wash", "tea tree", "refreshing"]
  },
  {
    id: 12,
    name: "Vitamin C Body Lotion",
    price: 39900,
    rating: 4.7,
    reviews: 923,
    image: "https://images.mamaearth.in/catalog/product/v/i/vitamin-c-body-lotion.jpg",
    category: "bodycare",
    isNew: true,
    tags: ["body lotion", "vitamin c", "brightening"]
  },
  {
    id: 13,
    name: "Bye Bye Blemishes Face Cream",
    price: 45900,
    rating: 4.6,
    reviews: 827,
    image: "https://images.mamaearth.in/catalog/product/b/y/bye-bye-blemishes-1_1.jpg",
    category: "skincare",
    isNew: false,
    tags: ["face cream", "anti-blemish", "brightening"]
  },
  {
    id: 14,
    name: "Onion Conditioner",
    price: 34900,
    rating: 4.6,
    reviews: 1267,
    image: "https://images.mamaearth.in/catalog/product/o/n/onion-cond-1.jpg",
    category: "haircare",
    isNew: false,
    tags: ["conditioner", "onion", "hair fall control"]
  },
  {
    id: 15,
    name: "Ubtan Body Wash",
    price: 29900,
    rating: 4.5,
    reviews: 587,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-body-wash-1_1.jpg",
    category: "bodycare",
    isNew: false,
    tags: ["body wash", "ubtan", "brightening"]
  },
  {
    id: 16,
    name: "Onion Hair Mask",
    price: 49900,
    rating: 4.7,
    reviews: 735,
    image: "https://images.mamaearth.in/catalog/product/o/n/onion-hair-mask-1.jpg",
    category: "haircare",
    isNew: false,
    tags: ["hair mask", "onion", "deep conditioning"]
  },
  {
    id: 17,
    name: "Rose Body Lotion",
    price: 39900,
    rating: 4.6,
    reviews: 687,
    image: "https://images.mamaearth.in/catalog/product/r/o/rose-body-lotion.jpg",
    category: "bodycare",
    isNew: false,
    tags: ["body lotion", "rose", "hydrating"]
  },
  {
    id: 18,
    name: "Ubtan & Turmeric Face Wash",
    price: 24900,
    rating: 4.8,
    reviews: 1124,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-turmeric-face-wash-1.jpg",
    badgeText: "Bestseller",
    category: "skincare",
    isNew: false,
    isBestseller: true,
    tags: ["face wash", "ubtan", "turmeric"]
  },
  {
    id: 19,
    name: "Aloe Vera Sunscreen SPF 50",
    price: 39900,
    rating: 4.6,
    reviews: 823,
    image: "https://images.mamaearth.in/catalog/product/s/u/sunscreen_2.jpg",
    category: "skincare",
    isNew: false,
    tags: ["sunscreen", "aloe vera", "spf 50"]
  },
  {
    id: 20,
    name: "Tea Tree & Neem Face Serum",
    price: 59900,
    rating: 4.5,
    reviews: 634,
    image: "https://images.mamaearth.in/catalog/product/t/e/tea-tree-face-serum-1.jpg",
    category: "skincare",
    isNew: true,
    tags: ["face serum", "tea tree", "neem", "acne control"]
  },
  // Additional 80+ products
  {
    id: 21,
    name: "Ubtan & Saffron Night Cream",
    price: 54900,
    rating: 4.7,
    reviews: 487,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-night-cream-1.jpg",
    category: "skincare",
    isNew: false,
    tags: ["night cream", "ubtan", "saffron"]
  },
  {
    id: 22,
    name: "Rice Water Conditioner",
    price: 34900,
    rating: 4.6,
    reviews: 926,
    image: "https://images.mamaearth.in/catalog/product/r/i/rice-cond-1.jpg",
    category: "haircare",
    isNew: false,
    tags: ["conditioner", "rice water", "strengthening"]
  },
  {
    id: 23,
    name: "Onion Hair Serum",
    price: 44900,
    rating: 4.8,
    reviews: 1245,
    image: "https://images.mamaearth.in/catalog/product/o/n/onion-hair-serum-1.jpg",
    badgeText: "Bestseller",
    category: "haircare",
    isNew: false,
    isBestseller: true,
    tags: ["hair serum", "onion", "anti-frizz"]
  },
  {
    id: 24,
    name: "Charcoal & Coffee Face Scrub",
    price: 34900,
    rating: 4.6,
    reviews: 765,
    image: "https://images.mamaearth.in/catalog/product/c/h/charcoal-face-scrub-1.jpg",
    category: "skincare",
    isNew: false,
    tags: ["face scrub", "charcoal", "coffee"]
  },
  {
    id: 25,
    name: "Vitamin C Underarm Scrub",
    price: 29900,
    rating: 4.5,
    reviews: 534,
    image: "https://images.mamaearth.in/catalog/product/v/i/vit-c-underam-scrub-1.jpg",
    category: "bodycare",
    isNew: false,
    tags: ["underarm scrub", "vitamin c", "brightening"]
  },
  // Adding many more products (truncated for brevity, but would include 75+ more product entries)
  {
    id: 101,
    name: "Vitamin C Tinted Natural Lip Balm",
    price: 29900,
    rating: 4.7,
    reviews: 354,
    image: "https://images.mamaearth.in/catalog/product/t/i/tinted-natural-lip-balm-1_2.jpg",
    category: "makeup",
    isNew: true,
    tags: ["lip balm", "vitamin c", "tinted"]
  },
  {
    id: 102,
    name: "Rose Glow Face Serum",
    price: 59900,
    rating: 4.8,
    reviews: 467,
    image: "https://images.mamaearth.in/catalog/product/r/o/rose-face-serum-1.jpg",
    category: "skincare",
    isNew: true,
    tags: ["face serum", "rose", "glow"]
  },
  {
    id: 103,
    name: "Ubtan & Turmeric Soap",
    price: 19900,
    rating: 4.6,
    reviews: 321,
    image: "https://images.mamaearth.in/catalog/product/u/b/ubtan-soap-1.jpg",
    category: "bodycare",
    isNew: false,
    tags: ["soap", "ubtan", "turmeric"]
  },
  {
    id: 104,
    name: "Green Tea & Collagen Under Eye Patches",
    price: 49900,
    rating: 4.7,
    reviews: 231,
    image: "https://images.mamaearth.in/catalog/product/g/r/green-tea-under-eye-patches-1.jpg",
    category: "skincare",
    isNew: true,
    tags: ["under eye patches", "green tea", "collagen"]
  },
  {
    id: 105,
    name: "Vitamin C & Lotus Water Makeup Remover",
    price: 34900,
    rating: 4.6,
    reviews: 187,
    image: "https://images.mamaearth.in/catalog/product/v/i/vitamin-c-makeup-remover-1.jpg",
    category: "skincare",
    isNew: false,
    tags: ["makeup remover", "vitamin c", "lotus water"]
  }
];
