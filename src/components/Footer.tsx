
import { Facebook, Instagram, Twitter } from "lucide-react";

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
              <li><a href="#" className="text-gray-600 hover:text-burgundy">Skincare</a></li>
              <li><a href="#" className="text-gray-600 hover:text-burgundy">Makeup</a></li>
              <li><a href="#" className="text-gray-600 hover:text-burgundy">Sets</a></li>
              <li><a href="#" className="text-gray-600 hover:text-burgundy">Gifts</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-burgundy">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-burgundy">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-burgundy">Press</a></li>
              <li><a href="#" className="text-gray-600 hover:text-burgundy">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-burgundy hover:text-burgundy-light">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-burgundy hover:text-burgundy-light">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-burgundy hover:text-burgundy-light">
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
