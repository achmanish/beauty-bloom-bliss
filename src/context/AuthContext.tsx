
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/admin";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  loading: boolean;
  wishlistCount: number;
  userRole: UserRole | null;
  signOut: () => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string }) => Promise<{error: any | null}>;
  changePassword: (newPassword: string) => Promise<{error: any | null}>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status when auth state changes
        if (session?.user) {
          setTimeout(() => {
            checkUserRole(session.user.id);
          }, 0);
          
          // Load wishlist count when user logs in
          fetchWishlistCount(session.user.id);
        } else {
          setIsAdmin(false);
          setUserRole(null);
          setWishlistCount(0);
        }
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserRole(session.user.id);
        fetchWishlistCount(session.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchWishlistCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from('wishlists')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (!error && count !== null) {
        setWishlistCount(count);
      } else {
        console.error("Error fetching wishlist count:", error);
        setWishlistCount(0);
      }
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
      setWishlistCount(0);
    }
  };

  const checkUserRole = async (userId: string) => {
    try {
      // First check if user is in admins table (legacy approach)
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select()
        .eq('id', userId)
        .maybeSingle();
      
      if (!adminError && adminData) {
        setIsAdmin(true);
        setUserRole('admin');
        return;
      }
      
      // Then check user_roles table for more granular role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (!roleError && roleData) {
        setUserRole(roleData.role as UserRole);
        setIsAdmin(roleData.role === 'admin');
      } else {
        setUserRole(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      setIsAdmin(false);
      setUserRole(null);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: { firstName?: string; lastName?: string }) => {
    if (!user) {
      return { error: new Error("User not authenticated") };
    }

    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        }
      });

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error };
    }
  };

  const changePassword = async (newPassword: string) => {
    if (!user) {
      return { error: new Error("User not authenticated") };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error("Error changing password:", error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      isAdmin, 
      isLoggedIn: !!user, 
      loading, 
      wishlistCount,
      userRole,
      signOut,
      updateProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
