// src/layouts/ProtectedLayout.tsx
import { Navigate, Outlet, useLocation } from "react-router";
import useRealtyStore from "../store/store";

export default function ProtectedRoute() {
  const { session } = useRealtyStore();
  const location = useLocation();

  // No session means redirect to sign in
  if (!session) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // We have a session, render the protected content
  return <Outlet />;
}
