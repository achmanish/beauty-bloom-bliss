
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();

  // If still loading, show nothing
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated but not admin, redirect to home with error
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and admin, render children
  return <>{children}</>;
};

export default ProtectedRoute;
