import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import FeaturedCategories from "@/components/FeaturedCategories";
import Testimonials from "@/components/Testimonials";
import BenefitsBanner from "@/components/BenefitsBanner";

const Index = () => {
  // Added state for wishlist items to keep track globally
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <BenefitsBanner />
      <FeaturedCategories />
      <Products />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
