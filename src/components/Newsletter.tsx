
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  return (
    <section className="py-20 bg-rose">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-playfair text-4xl mb-6 text-burgundy">Join Our Beauty Community</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Subscribe to receive exclusive offers, beauty tips, and new product announcements.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="bg-white/80 border-burgundy/20"
          />
          <Button className="bg-burgundy hover:bg-burgundy-light text-white">
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
