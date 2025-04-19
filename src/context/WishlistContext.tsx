
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

// Define types for wishlist items
interface WishlistProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
  stock: number;
}

export interface WishlistItem {
  id: string;
  product_id: string;
  user_id?: string;
  created_at: string;
  product: WishlistProduct;
}

interface WishlistContextType {
  wishlistCount: number;
  addToWishlist: (productId: string, product: Partial<WishlistProduct>) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  wishlistItems: WishlistItem[];
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load initial wishlist data
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserWishlist();
    } else {
      loadGuestWishlist();
    }
  }, [isLoggedIn, user]);

  // Fetch authenticated user's wishlist from Supabase
  const fetchUserWishlist = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          product_id,
          created_at,
          product:products (
            id,
            name,
            price,
            image_url,
            stock
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }
      
      if (data) {
        setWishlistItems(data as WishlistItem[]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // Load guest wishlist from localStorage
  const loadGuestWishlist = () => {
    try {
      const savedWishlist = localStorage.getItem('guestWishlist');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading guest wishlist:', error);
    }
  };

  // Save guest wishlist to localStorage
  const saveGuestWishlist = (items: WishlistItem[]) => {
    try {
      localStorage.setItem('guestWishlist', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving guest wishlist:', error);
    }
  };

  const addToWishlist = async (productId: string, product: Partial<WishlistProduct>) => {
    if (isLoggedIn && user) {
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .insert([{ user_id: user.id, product_id: productId }])
          .select()
          .single();

        if (error) throw error;
        await fetchUserWishlist(); // Refresh the wishlist
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
      }
    } else {
      // Handle guest wishlist
      const newItem: WishlistItem = {
        id: `guest-${Date.now()}`,
        product_id: productId,
        created_at: new Date().toISOString(),
        product: {
          id: productId,
          name: product.name || '',
          price: product.price || 0,
          image_url: product.image_url || '',
          stock: product.stock || 0
        }
      };

      const updatedItems = [...wishlistItems, newItem];
      setWishlistItems(updatedItems);
      saveGuestWishlist(updatedItems);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (isLoggedIn && user) {
      try {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', user.id);

        if (error) throw error;
        await fetchUserWishlist(); // Refresh the wishlist
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
      }
    } else {
      // Handle guest wishlist
      const updatedItems = wishlistItems.filter(item => item.product_id !== productId);
      setWishlistItems(updatedItems);
      saveGuestWishlist(updatedItems);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistCount: wishlistItems.length,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      wishlistItems
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
