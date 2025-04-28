// src/layouts/GuestRoute.tsx
import { Navigate, Outlet } from "react-router";
import useRealtyStore from "../store/store";

/**
 * GuestRoute component - Only allows access to unauthenticated users
 * Redirects authenticated users to the home page
 */
export default function GuestRoute() {
  const { session } = useRealtyStore();

  // If we have a session, redirect to home page
  if (session) {
    return <Navigate to="/" replace />;
  }

  // No session means we can render the guest content (signin/signup)
  return <Outlet />;
}
