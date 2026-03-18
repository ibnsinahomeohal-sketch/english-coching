import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        // If it's an invite or recovery, redirect to reset password
        const hash = window.location.hash;
        if (hash && (hash.includes("type=invite") || hash.includes("type=recovery"))) {
          navigate("/reset-password");
        } else {
          navigate("/");
        }
      } else if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    // Also check current session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const hash = window.location.hash;
        if (hash && (hash.includes("type=invite") || hash.includes("type=recovery"))) {
          navigate("/reset-password");
        } else {
          navigate("/");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}
