
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="min-h-screen bg-cream flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl text-burgundy leading-tight">
              Discover Your Natural Beauty
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-md">
              Luxury skincare and cosmetics made with natural ingredients for a radiant, confident you.
            </p>
            <div className="flex gap-4">
              <Button className="bg-burgundy hover:bg-burgundy-light text-white px-8">
                Shop Now
              </Button>
              <Button variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy/5">
                Learn More
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
