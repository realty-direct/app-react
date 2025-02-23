import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../database/supabase";
import useRealtyStore from "../store/store";

export default function Logout() {
  const navigate = useNavigate();
  const { clearSession } = useRealtyStore(); // ✅ Access Zustand inside a component

  useEffect(() => {
    const performLogout = async () => {
      clearSession(); // ✅ Clear Zustand session state
      await signOut(); // ✅ Then sign out from Supabase
      navigate("/signin", { replace: true }); // ✅ Redirect after logout
    };

    performLogout();
  }, [navigate, clearSession]);

  return <p>Logging out...</p>; // ✅ Optional, shows a message while logging out
}
