
import { ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <a href="/" className="font-playfair text-2xl text-burgundy">Élégance</a>
          <div className="hidden md:flex gap-6">
            <a href="#" className="text-gray-600 hover:text-burgundy transition-colors">Skincare</a>
            <a href="#" className="text-gray-600 hover:text-burgundy transition-colors">Makeup</a>
            <a href="#" className="text-gray-600 hover:text-burgundy transition-colors">Collections</a>
            <a href="#" className="text-gray-600 hover:text-burgundy transition-colors">About</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ShoppingBag className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
