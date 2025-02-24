import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useRealtyStore } from "../store/store";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { isAuthenticated } = useRealtyStore();
  const location = useLocation();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/signin" replace state={{ from: location }} />
  );
}
