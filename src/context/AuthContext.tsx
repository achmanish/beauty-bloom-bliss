
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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status when auth state changes
        if (session?.user) {
          setTimeout(() => {
            checkUserRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setUserRole(null);
        }
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Logged in" : "Not logged in");
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserRole(session.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUserRole = async (userId: string) => {
    try {
      console.log("Checking user role for:", userId);
      
      // First check if user is in admins table (legacy approach)
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select()
        .eq('id', userId)
        .maybeSingle();
      
      if (!adminError && adminData) {
        console.log("User is admin (via admins table)");
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
      
      console.log("User role check results:", { roleData, roleError });
      
      if (!roleError && roleData) {
        setUserRole(roleData.role as UserRole);
        setIsAdmin(roleData.role === 'admin');
        console.log("User role set to:", roleData.role);
      } else {
        setUserRole(null);
        setIsAdmin(false);
        console.log("User has no special role");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      setIsAdmin(false);
      setUserRole(null);
    }
  };

  const signOut = async () => {
    console.log("Signing out user");
    
    try {
      // Clear admin authentication if it exists
      localStorage.removeItem("admin_authenticated");
      
      // Sign out from supabase
      await supabase.auth.signOut();
      
      console.log("Sign out completed");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
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
