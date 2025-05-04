
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "./LanguageSelector";

const Hero = () => {
  const { translate } = useLanguage();
  
  return (
    <div className="min-h-screen bg-cream flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl text-burgundy leading-tight">
              {translate('discoverBeauty')}
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-md">
              {translate('luxurySkincare')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                className="bg-burgundy hover:bg-burgundy-light text-white px-8 w-full sm:w-auto"
              >
                <Link to="/products">{translate('shopNow')}</Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                className="border-burgundy text-burgundy hover:bg-burgundy/5 w-full sm:w-auto"
              >
                <Link to="/about">{translate('learnMore')}</Link>
              </Button>
            </div>
          </div>
          <div className="relative animate-slide-up">
            <div className="aspect-square rounded-full bg-rose/30 absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%]" />
            <img
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"
              alt="Luxury Cosmetics"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
