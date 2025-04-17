
import { createContext, useContext, useState, useEffect } from "react";

interface CartContextType {
  cartCount: number;
  updateCartCount: (count: number) => void;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  updateCartCount: () => {},
});

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(() => {
    // Initialize from localStorage if available
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        return JSON.parse(savedCart).length;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  });

  // Function to update cart count
  const updateCartCount = (count: number) => {
    setCartCount(count);
  };

  // Listen for localStorage changes to update cart count
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        try {
          setCartCount(JSON.parse(savedCart).length);
        } catch (e) {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    // Listen for custom event
    const handleCartUpdate = (event: any) => {
      if (event.detail !== undefined) {
        setCartCount(event.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
