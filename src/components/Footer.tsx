
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-cream py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-playfair text-2xl text-burgundy mb-4">Élégance</h3>
            <p className="text-gray-600 max-w-xs">
              Luxury beauty products crafted with natural ingredients for your daily ritual.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/category/skincare" className="text-gray-600 hover:text-burgundy">Skincare</Link></li>
              <li><Link to="/category/makeup" className="text-gray-600 hover:text-burgundy">Makeup</Link></li>
              <li><Link to="/category/haircare" className="text-gray-600 hover:text-burgundy">Haircare</Link></li>
              <li><Link to="/category/bodycare" className="text-gray-600 hover:text-burgundy">Body Care</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-burgundy">About</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-burgundy">Contact</Link></li>
              <li><Link to="/products" className="text-gray-600 hover:text-burgundy">All Products</Link></li>
              <li><Link to="/bestsellers" className="text-gray-600 hover:text-burgundy">Bestsellers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-burgundy hover:text-burgundy-light">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-burgundy hover:text-burgundy-light">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-burgundy hover:text-burgundy-light">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
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
