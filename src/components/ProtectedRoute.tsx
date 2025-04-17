
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check for both real Supabase auth and our mock demo auth
    const adminAuthenticated = localStorage.getItem("admin_authenticated") === "true";
    setIsAuthenticated(!!user || adminAuthenticated);
    setCheckingAuth(false);
  }, [user]);

  // If still loading, show a better loading indicator
  if (loading || checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  // For demo purposes, we'll allow access if they're authenticated with our mock
  if (localStorage.getItem("admin_authenticated") === "true") {
    return <>{children}</>;
  }

  // For real Supabase auth, check admin role
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and admin, render children
  return <>{children}</>;
};

export default ProtectedRoute;
