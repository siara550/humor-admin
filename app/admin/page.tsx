import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ImagesManager from "./ImagesManager";
import LogoutButton from "./LogoutButton";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("is_superadmin").eq("id", user.id).single();
  if (!profile?.is_superadmin) {
    return (
      <main style={{ minHeight: "100vh", background: "#080808", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#ff4444", fontSize: "1.2rem" }}>Access Denied</p>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "0.5rem" }}>Superadmin access required.</p>
        </div>
      </main>
    );
  }

  const [
    { count: totalCaptions },
    { count: totalImages },
    { count: totalProfiles },
    { count: totalVotes },
    { data: recentCaptions },
    { data: profiles },
    { data: images },
  ] = await Promise.all([
    supabase.from("captions").select("*", { count: "exact", head: true }),
    supabase.from("images").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("caption_votes").select("*", { count: "exact", head: true }),
    supabase.from("captions").select("id, content, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(10),
    supabase.from("profiles").select("id, email, first_name, last_name, is_superadmin, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(50),
    supabase.from("images").select("id, url, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(50),
  ]);

  const s = { th: { textAlign: "left" as const, padding: "0.6rem 1rem", fontSize: "0.68rem", textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "rgba(240,237,232,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontWeight: 500 }, td: { padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "rgba(240,237,232,0.8)", fontSize: "0.82rem" } };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#f0ede8", fontFamily: "sans-serif" }}>
      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", height: "56px", background: "rgba(8,8,8,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.05em" }}>CRACKD <span style={{ color: "#ff4d00" }}>ADMIN</span></span>
        <LogoutButton />
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ff4d00", marginBottom: "0.25rem" }}>Superadmin · {user.email}</p>
        <h1 style={{ fontSize: "3rem", fontWeight: 700, marginBottom: "2rem" }}>Data Dashboard</h1>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "3rem" }}>
          {[
            { num: totalCaptions, label: "Total Captions" },
            { num: totalImages, label: "Total Images" },
            { num: totalProfiles, label: "Total Users" },
            { num: totalVotes, label: "Total Votes" },
          ].map(({ num, label }) => (
            <div key={label} style={{ background: "#0e0e0e", padding: "1.5rem" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "#ff4d00", lineHeight: 1 }}>{num?.toLocaleString()}</div>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(240,237,232,0.4)", marginTop: "0.25rem" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* RECENT CAPTIONS */}
        <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#ff4d00", borderBottom: "1px solid rgba(255,77,0,0.2)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>Recent Captions</h2>
        <div style={{ overflowX: "auto", marginBottom: "3rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={s.th}>Caption</th><th style={s.th}>Created</th><th style={s.th}>ID</th></tr></thead>
            <tbody>
              {recentCaptions?.map(c => (
                <tr key={c.id}>
                  <td style={s.td}><div style={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.content ?? "(no content)"}</div></td>
                  <td style={{ ...s.td, color: "rgba(240,237,232,0.4)", fontSize: "0.75rem", whiteSpace: "nowrap" }}>{c.created_datetime_utc ? new Date(c.created_datetime_utc).toLocaleDateString() : "—"}</td>
                  <td style={{ ...s.td, fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(240,237,232,0.3)" }}>{c.id.slice(0, 8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* USERS */}
        <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#ff4d00", borderBottom: "1px solid rgba(255,77,0,0.2)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>Users / Profiles</h2>
        <div style={{ overflowX: "auto", marginBottom: "3rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={s.th}>Email</th><th style={s.th}>Name</th><th style={s.th}>Superadmin</th><th style={s.th}>Joined</th></tr></thead>
            <tbody>
              {profiles?.map(p => (
                <tr key={p.id}>
                  <td style={s.td}>{p.email ?? "—"}</td>
                  <td style={s.td}>{[p.first_name, p.last_name].filter(Boolean).join(" ") || "—"}</td>
                  <td style={s.td}>
                    <span style={{ padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.65rem", background: p.is_superadmin ? "rgba(0,200,100,0.15)" : "rgba(255,255,255,0.06)", color: p.is_superadmin ? "#00c864" : "rgba(240,237,232,0.4)", border: `1px solid ${p.is_superadmin ? "rgba(0,200,100,0.2)" : "rgba(255,255,255,0.08)"}` }}>
                      {p.is_superadmin ? "Yes" : "No"}
                    </span>
                  </td>
                  <td style={{ ...s.td, fontSize: "0.75rem", color: "rgba(240,237,232,0.4)" }}>{p.created_datetime_utc ? new Date(p.created_datetime_utc).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* IMAGES CRUD */}
        <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#ff4d00", borderBottom: "1px solid rgba(255,77,0,0.2)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>Images</h2>
        <ImagesManager initialImages={images ?? []} />
      </div>
    </div>
  );
}