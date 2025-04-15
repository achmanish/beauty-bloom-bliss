
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import FeaturedCategories from "@/components/FeaturedCategories";
import Testimonials from "@/components/Testimonials";
import BenefitsBanner from "@/components/BenefitsBanner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Added state for wishlist items to keep track globally
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {isAdmin && (
        <div className="bg-gray-100 py-2">
          <div className="container mx-auto px-4 text-center">
            <Link to="/admin">
              <Button variant="outline" size="sm">
                Go to Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}
      
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
