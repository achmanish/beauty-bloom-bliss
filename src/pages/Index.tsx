
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import BenefitsBanner from "@/components/BenefitsBanner";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedCategories />
      <ProductGrid limit={8} title="Bestsellers" />
      <BenefitsBanner />
      <ProductGrid limit={4} title="New Arrivals" category="skincare" />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
