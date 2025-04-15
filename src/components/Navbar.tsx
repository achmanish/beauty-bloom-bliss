
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, User, Search, Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-cream py-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-playfair text-2xl font-bold text-burgundy">
            Élégance
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/products" className="text-burgundy hover:text-burgundy-light transition-colors">
              Shop All
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-burgundy hover:text-burgundy-light transition-colors">
                Categories
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem>
                  <Link to="/category/skincare" className="w-full">Skincare</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/category/makeup" className="w-full">Makeup</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/category/hair" className="w-full">Hair Care</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/category/body" className="w-full">Body Care</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/bestsellers" className="text-burgundy hover:text-burgundy-light transition-colors">
              Bestsellers
            </Link>
            <Link to="/about" className="text-burgundy hover:text-burgundy-light transition-colors">
              About
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center relative w-1/3">
            <Input type="text" placeholder="Search products..." className="pr-8" />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Link to="/account" className="text-burgundy hover:text-burgundy-light">
              <User className="h-5 w-5" />
            </Link>
            
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="text-burgundy hover:text-burgundy-light relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-burgundy text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="text-burgundy hover:text-burgundy-light relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-burgundy text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Mobile menu button */}
            <button className="md:hidden text-burgundy" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-cream-light p-4 rounded-lg animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link to="/products" className="text-burgundy hover:text-burgundy-light transition-colors">
                Shop All
              </Link>
              <Link to="/category/skincare" className="text-burgundy hover:text-burgundy-light transition-colors">
                Skincare
              </Link>
              <Link to="/category/makeup" className="text-burgundy hover:text-burgundy-light transition-colors">
                Makeup
              </Link>
              <Link to="/category/hair" className="text-burgundy hover:text-burgundy-light transition-colors">
                Hair Care
              </Link>
              <Link to="/category/body" className="text-burgundy hover:text-burgundy-light transition-colors">
                Body Care
              </Link>
              <Link to="/bestsellers" className="text-burgundy hover:text-burgundy-light transition-colors">
                Bestsellers
              </Link>
              <Link to="/about" className="text-burgundy hover:text-burgundy-light transition-colors">
                About
              </Link>
              <Link to="/wishlist" className="text-burgundy hover:text-burgundy-light transition-colors">
                Wishlist
              </Link>
              
              {/* Mobile search */}
              <div className="relative">
                <Input type="text" placeholder="Search products..." className="w-full pr-8" />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

