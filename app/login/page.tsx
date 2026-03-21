"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "400px" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", marginBottom: "0.5rem" }}>Humor Project · Admin</p>
        <h1 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 600, margin: "0 0 0.5rem" }}>Admin Access</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Superadmin access required.</p>
        <button onClick={signIn} disabled={loading} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", background: "#fff", border: "none", fontWeight: 500, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "Opening Google…" : "Continue with Google"}
        </button>
      </div>
    </main>
  );
}