import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { supabase } from "../database/supabase";
import useRealtyStore from "../store/store";

export default function ProtectedRoute() {
  const { session } = useRealtyStore();
  const location = useLocation();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        useRealtyStore.getState().setSession(data.session);
      }
      setCheckingSession(false);
    });
  }, []);

  if (checkingSession) {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
