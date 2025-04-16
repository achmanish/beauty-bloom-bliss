
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();

  // If still loading, show a better loading indicator
  if (loading) {
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
  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  // If authenticated but not admin, redirect to home with error
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and admin, render children
  return <>{children}</>;
};

export default ProtectedRoute;
