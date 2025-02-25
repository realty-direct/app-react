import { Navigate, Outlet, useLocation } from "react-router-dom";
import useRealtyStore from "../store/store";

export default function ProtectedRoute() {
  const { session } = useRealtyStore();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
