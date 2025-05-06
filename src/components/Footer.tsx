
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  // Function to scroll to top when navigating
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  
  return (
    <footer className="bg-cream py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-playfair text-2xl text-burgundy mb-4">Élégance</h3>
            <p className="text-gray-600 max-w-xs">
              Luxury beauty products crafted with natural ingredients for your daily ritual.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/category/skincare" className="text-gray-600 hover:text-burgundy" onClick={scrollToTop}>Skincare</Link></li>
              <li><Link to="/category/makeup" className="text-gray-600 hover:text-burgundy" onClick={scrollToTop}>Makeup</Link></li>
              <li><Link to="/category/haircare" className="text-gray-600 hover:text-burgundy" onClick={scrollToTop}>Haircare</Link></li>
              <li><Link to="/category/bodycare" className="text-gray-600 hover:text-burgundy" onClick={scrollToTop}>Body Care</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-burgundy" onClick={scrollToTop}>About</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-burgundy" onClick={scrollToTop}>Contact</Link></li>
              <li><Link to="/products" className="text-gray-600 hover:text-burgundy" onClick={scrollToTop}>All Products</Link></li>
              <li><Link to="/bestsellers" className="text-gray-600 hover:text-burgundy" onClick={scrollToTop}>Bestsellers</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
          <p>&copy; 2025 Élégance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
