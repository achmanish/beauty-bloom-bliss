import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/sonner";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  size?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: CartProduct;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: CartProduct) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  syncCart: () => Promise<void>;
  updateCartCount: (count: number) => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartCount: 0,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  isLoading: false,
  syncCart: async () => {},
  updateCartCount: () => {},
});

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<CartItem[]>([]);
  const [isCartSynced, setIsCartSynced] = useState(false);

  // Check network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Try to sync any pending changes
      if (pendingChanges.length > 0) {
        syncCart();
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial offline status
    setIsOffline(!window.navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingChanges]);

  // Load cart data on initial load or auth state change
  useEffect(() => {
    if (isLoggedIn && user) {
      fetchUserCart();
    } else {
      loadGuestCart();
    }
  }, [isLoggedIn, user]);

  // Fetch authenticated user's cart from Supabase
  const fetchUserCart = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // First, get or create the user's cart
      let { data: cart, error: cartError } = await supabase
        .from('shopping_carts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (cartError) throw cartError;
      
      // If no cart exists, create one
      if (!cart) {
        const { data: newCart, error: createError } = await supabase
          .from('shopping_carts')
          .insert({ user_id: user.id })
          .select('id')
          .single();
        
        if (createError) throw createError;
        cart = newCart;
      }
      
      setCartId(cart.id);
      
      // Get the cart items
      const { data: cartItems, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          id, 
          quantity, 
          product_id,
          product:products (
            id, 
            name, 
            price, 
            image_url
          )
        `)
        .eq('cart_id', cart.id);
      
      if (itemsError) throw itemsError;
      
      // Format the cart items
      const formattedItems: CartItem[] = (cartItems || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: {
          ...item.product,
          quantity: item.quantity
        }
      }));
      
      setCartItems(formattedItems);
      setCartCount(formattedItems.reduce((total, item) => total + item.quantity, 0));
      
      // Try to merge with any guest cart items
      const savedGuestCart = localStorage.getItem('cartItems');
      if (savedGuestCart && !isCartSynced) {
        const guestCartItems = JSON.parse(savedGuestCart);
        if (guestCartItems.length > 0) {
          // Add guest cart items to the user's cart
          for (const guestItem of guestCartItems) {
            const existingItem = formattedItems.find(item => item.product_id === guestItem.product_id);
            if (!existingItem) {
              await addToCart(guestItem.product);
            }
          }
          // Clear the guest cart after merging
          localStorage.removeItem('cartItems');
          setIsCartSynced(true);
        }
      }
      
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load your cart');
      
      // Fall back to guest cart if there's an error
      loadGuestCart();
    } finally {
      setIsLoading(false);
    }
  };

  // Load guest cart from localStorage
  const loadGuestCart = () => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const guestCartItems = JSON.parse(savedCart);
        setCartItems(guestCartItems);
        setCartCount(guestCartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0));
      } else {
        setCartItems([]);
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error loading guest cart:', error);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Save guest cart to localStorage
  const saveGuestCart = (items: CartItem[]) => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
      
      // Dispatch custom event for cart updates across tabs
      const cartUpdatedEvent = new CustomEvent('cartUpdated', { 
        detail: items.reduce((total, item) => total + item.quantity, 0) 
      });
      window.dispatchEvent(cartUpdatedEvent);
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  // Add to cart
  const addToCart = async (product: CartProduct) => {
    // Check if product is already in cart
    const existingItemIndex = cartItems.findIndex(item => item.product_id === product.id);
    const newQuantity = existingItemIndex >= 0 ? cartItems[existingItemIndex].quantity + 1 : 1;
    
    if (isLoggedIn && user && cartId && !isOffline) {
      try {
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: newQuantity })
            .eq('cart_id', cartId)
            .eq('product_id', product.id);
          
          if (error) throw error;
        } else {
          // Add new item
          const { error } = await supabase
            .from('cart_items')
            .insert({
              cart_id: cartId,
              product_id: product.id,
              quantity: 1
            });
          
          if (error) throw error;
        }
        
        await fetchUserCart(); // Refresh cart
        toast.success(`${product.name} added to your cart`);
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add item to cart');
        
        // Store the change for sync later
        addToPendingChanges(product);
      }
    } else {
      // Handle guest cart or offline mode
      let updatedItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        updatedItems = cartItems.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + 1, product: { ...item.product, quantity: item.quantity + 1 } } 
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `guest-${Date.now()}`,
          product_id: product.id,
          quantity: 1,
          product: { ...product, quantity: 1 }
        };
        updatedItems = [...cartItems, newItem];
      }
      
      setCartItems(updatedItems);
      setCartCount(updatedItems.reduce((total, item) => total + item.quantity, 0));
      saveGuestCart(updatedItems);
      
      if (isLoggedIn && isOffline) {
        // Store the change for sync later
        addToPendingChanges({ ...product, quantity: 1 } as CartProduct);
        toast.success(`${product.name} added to cart (offline mode)`);
      } else {
        toast.success(`${product.name} added to your cart`);
      }
    }
  };

  // Remove from cart
  const removeFromCart = async (productId: string) => {
    if (isLoggedIn && user && cartId && !isOffline) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cartId)
          .eq('product_id', productId);
        
        if (error) throw error;
        
        await fetchUserCart(); // Refresh cart
        toast.success('Item removed from cart');
      } catch (error) {
        console.error('Error removing from cart:', error);
        toast.error('Failed to remove item from cart');
        
        // Store for offline sync
        addToPendingChanges({ id: productId, quantity: 0 } as CartProduct);
      }
    } else {
      // Handle guest cart or offline mode
      const updatedItems = cartItems.filter(item => item.product_id !== productId);
      setCartItems(updatedItems);
      setCartCount(updatedItems.reduce((total, item) => total + item.quantity, 0));
      saveGuestCart(updatedItems);
      
      if (isLoggedIn && isOffline) {
        // Store for offline sync
        addToPendingChanges({ id: productId, quantity: 0 } as CartProduct);
        toast.success('Item removed from cart (offline mode)');
      } else {
        toast.success('Item removed from cart');
      }
    }
  };

  // Update quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      return removeFromCart(productId);
    }
    
    if (isLoggedIn && user && cartId && !isOffline) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('cart_id', cartId)
          .eq('product_id', productId);
        
        if (error) throw error;
        
        await fetchUserCart(); // Refresh cart
      } catch (error) {
        console.error('Error updating quantity:', error);
        toast.error('Failed to update quantity');
        
        // Store for offline sync
        const item = cartItems.find(item => item.product_id === productId);
        if (item) {
          addToPendingChanges({ ...item.product, quantity } as CartProduct);
        }
      }
    } else {
      // Handle guest cart or offline mode
      const updatedItems = cartItems.map(item => 
        item.product_id === productId 
          ? { ...item, quantity, product: { ...item.product, quantity } } 
          : item
      );
      setCartItems(updatedItems);
      setCartCount(updatedItems.reduce((total, item) => total + item.quantity, 0));
      saveGuestCart(updatedItems);
      
      if (isLoggedIn && isOffline) {
        // Store for offline sync
        const item = cartItems.find(item => item.product_id === productId);
        if (item) {
          addToPendingChanges({ ...item.product, quantity } as CartProduct);
        }
      }
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (isLoggedIn && user && cartId && !isOffline) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cartId);
        
        if (error) throw error;
        
        setCartItems([]);
        setCartCount(0);
        toast.success('Cart cleared');
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error('Failed to clear cart');
      }
    } else {
      // Handle guest cart or offline mode
      setCartItems([]);
      setCartCount(0);
      localStorage.removeItem('cartItems');
      
      // Dispatch custom event
      const cartUpdatedEvent = new CustomEvent('cartUpdated', { detail: 0 });
      window.dispatchEvent(cartUpdatedEvent);
      
      toast.success('Cart cleared');
    }
  };

  // Add to pending changes for offline sync
  const addToPendingChanges = (product: CartProduct) => {
    if (!isOffline) return;
    
    // Store the pending change
    const existingChangeIndex = pendingChanges.findIndex(change => change.product_id === product.id);
    
    let updatedChanges: CartItem[];
    if (existingChangeIndex >= 0) {
      // Update existing change
      updatedChanges = pendingChanges.map((change, index) => 
        index === existingChangeIndex 
          ? { ...change, quantity: product.quantity } 
          : change
      );
    } else {
      // Add new change
      const newChange: CartItem = {
        id: `pending-${Date.now()}`,
        product_id: product.id,
        quantity: product.quantity,
        product
      };
      updatedChanges = [...pendingChanges, newChange];
    }
    
    setPendingChanges(updatedChanges);
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('pendingCartChanges', JSON.stringify(updatedChanges));
    } catch (error) {
      console.error('Error saving pending changes:', error);
    }
  };

  // Sync cart with server
  const syncCart = async () => {
    if (!isLoggedIn || !user || !cartId || pendingChanges.length === 0) return;
    
    setIsLoading(true);
    try {
      // Process each pending change
      for (const change of pendingChanges) {
        if (change.quantity === 0) {
          // Remove item
          await supabase
            .from('cart_items')
            .delete()
            .eq('cart_id', cartId)
            .eq('product_id', change.product_id);
        } else {
          // Check if item exists
          const { data, error } = await supabase
            .from('cart_items')
            .select('id')
            .eq('cart_id', cartId)
            .eq('product_id', change.product_id)
            .maybeSingle();
          
          if (!error) {
            if (data) {
              // Update item
              await supabase
                .from('cart_items')
                .update({ quantity: change.quantity })
                .eq('id', data.id);
            } else {
              // Insert item
              await supabase
                .from('cart_items')
                .insert({
                  cart_id: cartId,
                  product_id: change.product_id,
                  quantity: change.quantity
                });
            }
          }
        }
      }
      
      // Clear pending changes
      setPendingChanges([]);
      localStorage.removeItem('pendingCartChanges');
      
      // Refresh cart
      await fetchUserCart();
      toast.success('Cart synchronized successfully');
    } catch (error) {
      console.error('Error syncing cart:', error);
      toast.error('Failed to synchronize cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update cart count (for components)
  const updateCartCount = (count: number) => {
    setCartCount(count);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isLoading,
      syncCart,
      updateCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
