
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Log protection status on mount
    console.log("Protected route status:", {
      path: location.pathname,
      adminOnly,
      isLoading: loading,
      isAuthenticated: !!user,
      isAdmin,
      mockAdminAuth: localStorage.getItem("admin_authenticated") === "true"
    });
  }, [location.pathname, adminOnly, loading, user, isAdmin]);

  // If still loading, show a better loading indicator
  if (loading) {
    console.log("Auth state still loading");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check auth status based on the JWT token
  const isAuthenticated = !!user;

  // For demo purposes, we'll also allow access if they're authenticated with our mock
  const adminAuthenticated = localStorage.getItem("admin_authenticated") === "true";
  
  console.log("Access check result:", { 
    isAuthenticated, 
    adminAuthenticated, 
    adminOnly, 
    isAdmin
  });

  // If not authenticated at all, redirect to login
  if (!isAuthenticated && !adminAuthenticated) {
    console.log("Access denied: Not authenticated, redirecting to account");
    return <Navigate to="/account" state={{ from: location.pathname }} replace />;
  }

  // If adminOnly route and not admin, redirect to home
  if (adminOnly && !isAdmin && !adminAuthenticated) {
    console.log("Access denied: Not an admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required permissions
  console.log("Access granted");
  return <>{children}</>;
};

export default ProtectedRoute;
