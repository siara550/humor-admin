"use client";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };
  return (
    <button onClick={handleLogout} style={{ padding: "0.35rem 0.9rem", borderRadius: "999px", fontSize: "0.75rem", border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(240,237,232,0.7)", cursor: "pointer" }}>
      Sign out
    </button>
  );
}