import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useRealtyStore } from "../store/store";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useRealtyStore();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}
