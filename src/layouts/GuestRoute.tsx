// src/layouts/GuestRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import useRealtyStore from "../store/store";

/**
 * GuestRoute component - Only allows access to unauthenticated users
 * Redirects authenticated users to the home page
 */
export default function GuestRoute() {
  const { session } = useRealtyStore();
  const location = useLocation();

  // Minimal loading state to prevent flicker
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Immediately set loading to false after component mounts
    setIsLoading(false);
  }, []);

  // Very brief loading state - only on initial render
  if (isLoading) {
    return <LoadingSpinner text="Loading..." fullPage />;
  }

  // If we have a session, redirect to home page
  if (session) {
    return <Navigate to="/" replace />;
  }

  // No session means we can render the guest content (signin/signup)
  return <Outlet />;
}
