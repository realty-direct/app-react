// src/layouts/ProtectedLayout.tsx - Robust solution
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import useRealtyStore from "../store/store";

export default function ProtectedRoute() {
  const { session } = useRealtyStore();
  const location = useLocation();

  // Minimal loading state - let's keep this simple
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Immediately set loading to false after component mounts
    // This ensures we won't get stuck
    setIsLoading(false);
  }, []);

  // Very brief loading state - only on initial render
  if (isLoading) {
    return <LoadingSpinner text="Loading..." fullPage />;
  }

  // No session means redirect to sign in
  if (!session) {
    console.log("No active session found, redirecting to sign in page");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // We have a session, render the protected content
  return <Outlet />;
}
