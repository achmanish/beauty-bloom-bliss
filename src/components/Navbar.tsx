
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Search, Menu, X, Heart, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import LanguageSelector from "./LanguageSelector";
import SearchOverlay from "./SearchOverlay";
import { useLanguage } from "./LanguageSelector";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isLoggedIn, isAdmin, signOut } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const { translate } = useLanguage();
  
  const cartContext = useCartContext();
  const [localCartCount, setLocalCartCount] = useState(0);
  
  const cartCount = cartContext?.cartCount ?? localCartCount;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        const count = JSON.parse(savedCart).length;
        setLocalCartCount(count);
        if (cartContext?.updateCartCount) {
          cartContext.updateCartCount(count);
        }
      } catch (e) {
        console.error("Error parsing cart data", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartItems') {
        if (e.newValue) {
          try {
            const count = JSON.parse(e.newValue).length;
            setLocalCartCount(count);
            if (cartContext?.updateCartCount) {
              cartContext.updateCartCount(count);
            }
          } catch (error) {
            console.error("Error parsing cart data", error);
          }
        } else {
          setLocalCartCount(0);
          if (cartContext?.updateCartCount) {
            cartContext.updateCartCount(0);
          }
        }
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail && typeof e.detail === 'number') {
        setLocalCartCount(e.detail);
        if (cartContext?.updateCartCount) {
          cartContext.updateCartCount(e.detail);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCustomEvent as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCustomEvent as EventListener);
    };
  }, [cartContext]);

  return (
    <>
      <nav className="bg-cream py-4 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-playfair text-2xl font-bold text-burgundy">
              Élégance
            </Link>

            <div className="hidden md:flex space-x-8">
              <Link to="/products" className="text-burgundy hover:text-burgundy-light transition-colors">
                {translate('shopAll')}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-burgundy hover:text-burgundy-light transition-colors">
                  {translate('categories')}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white z-50">
                  <DropdownMenuItem asChild>
                    <Link to="/category/skincare" className="w-full">{translate('skincare')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/category/makeup" className="w-full">{translate('makeup')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/category/haircare" className="w-full">{translate('haircare')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/category/bodycare" className="w-full">{translate('bodycare')}</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/bestsellers" className="text-burgundy hover:text-burgundy-light transition-colors">
                {translate('bestsellers')}
              </Link>
              <Link to="/marketplace" className="text-burgundy hover:text-burgundy-light transition-colors">
                {translate('marketplace')}
              </Link>
              <Link to="/about" className="text-burgundy hover:text-burgundy-light transition-colors">
                {translate('about')}
              </Link>
              <Link to="/contact" className="text-burgundy hover:text-burgundy-light transition-colors">
                {translate('contact')}
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSearch}
                className="text-burgundy hover:text-burgundy-light"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>

              <LanguageSelector />
              
              <DropdownMenu>
                <DropdownMenuTrigger className="text-burgundy hover:text-burgundy-light focus:outline-none transition-colors">
                  <User className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white z-50">
                  {isLoggedIn ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/account" className="w-full cursor-pointer">{translate('myAccount')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/orders" className="w-full cursor-pointer">{translate('myOrders')}</Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="w-full cursor-pointer">{translate('adminDashboard')}</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => signOut()}
                        className="cursor-pointer text-red-600 hover:bg-red-50"
                      >
                        {translate('signOut')}
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/auth" className="w-full cursor-pointer">{translate('signIn')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/auth" className="w-full cursor-pointer">{translate('register')}</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link to="/wishlist" className="text-burgundy hover:text-burgundy-light relative transition-colors">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-burgundy text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              
              <Link to="/cart" className="text-burgundy hover:text-burgundy-light relative transition-transform hover:scale-110">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-burgundy text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <button className="md:hidden text-burgundy" onClick={toggleMenu} aria-label="Toggle menu">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 bg-cream-light p-4 rounded-lg animate-fade-in">
              <div className="flex flex-col space-y-4">
                <Link to="/products" className="text-burgundy hover:text-burgundy-light transition-colors"
                  onClick={() => setIsMenuOpen(false)}>
                  {translate('shopAll')}
                </Link>
                <Link to="/category/skincare" className="text-burgundy hover:text-burgundy-light transition-colors"
                  onClick={() => setIsMenuOpen(false)}>
                  {translate('skincare')}
                </Link>
                <Link to="/category/makeup" className="text-burgundy hover:text-burgundy-light transition-colors"
                  onClick={() => setIsMenuOpen(false)}>
                  {translate('makeup')}
                </Link>
                <Link to="/category/haircare" className="text-burgundy hover:text-burgundy-light transition-colors"
                  onClick={() => setIsMenuOpen(false)}>
                  {translate('haircare')}
                </Link>
                <Link to="/category/bodycare" className="text-burgundy hover:text-burgundy-light transition-colors"
                  onClick={() => setIsMenuOpen(false)}>
                  {translate('bodycare')}
                </Link>
                <Link to="/bestsellers" className="text-burgundy hover:text-burgundy-light transition-colors"
                  onClick={() => setIsMenuOpen(false)}>
                  {translate('bestsellers')}
                </Link>
                <Link to="/marketplace" className="text-burgundy hover:text-burgundy-light transition-colors"
                  onClick={() => setIsMenuOpen(false)}>
                  <Store className="inline-block mr-1 h-4 w-4" />
                  {translate('marketplace')}
                </Link>
                <Link to="/about" className="text-burgundy hover:text-burgundy-light transition-colors"
                  onClick={() => setIsMenuOpen(false)}>
                  {translate('about')}
                </Link>
                <Link to="/contact" className="text-burgundy hover:text-burgundy-light transition-colors"
                  onClick={() => setIsMenuOpen(false)}>
                  {translate('contact')}
                </Link>
                <Link to="/wishlist" className="text-burgundy hover:text-burgundy-light transition-colors"
                  onClick={() => setIsMenuOpen(false)}>
                  Wishlist
                </Link>
                
                <Button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="bg-burgundy text-white w-full flex items-center justify-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  {translate('searchProducts')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
