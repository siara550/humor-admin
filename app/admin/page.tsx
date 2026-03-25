import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";
import AdminTabs from "./AdminTabs";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("is_superadmin").eq("id", user.id).single();
  if (!profile?.is_superadmin) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#ff4444" }}>Access Denied — Superadmin only.</p>
      </div>
    );
  }

  const [
    { count: totalCaptions },
    { count: totalImages },
    { count: totalProfiles },
    { count: totalVotes },
    { data: captions },
    { data: profiles },
    { data: images },
    { data: humorFlavors },
    { data: flavorSteps },
    { data: humorMix },
    { data: terms },
    { data: captionRequests },
    { data: captionExamples },
    { data: llmModels },
    { data: llmProviders },
    { data: llmPromptChains },
    { data: llmResponses },
    { data: allowedDomains },
    { data: whitelistEmails },
  ] = await Promise.all([
    supabase.from("captions").select("*", { count: "exact", head: true }),
    supabase.from("images").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("caption_votes").select("*", { count: "exact", head: true }),
    supabase.from("captions").select("id, content, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(20),
    supabase.from("profiles").select("id, email, first_name, last_name, is_superadmin, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(50),
    supabase.from("images").select("id, url, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(50),
    supabase.from("humor_flavors").select("id, name, description, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(50),
    supabase.from("humor_flavor_steps").select("id, humor_flavor_id, order_by, llm_temperature, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(50),
    supabase.from("humor_flavor_mix").select("id, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(50),
    supabase.from("terms").select("id, term, definition, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(50),
    supabase.from("caption_requests").select("id, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(20),
    supabase.from("caption_examples").select("id, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(20),
    supabase.from("llm_models").select("id, name, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(50),
    supabase.from("llm_providers").select("id, name, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(50),
    supabase.from("llm_prompt_chains").select("id, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(20),
    supabase.from("llm_model_responses").select("id, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(20),
    supabase.from("allowed_signup_domains").select("id, domain, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(50),
    supabase.from("whitelist_email_addresses").select("id, email, created_datetime_utc").order("created_datetime_utc", { ascending: false }).limit(50),
  ]);

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#f0ede8", fontFamily: "sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", height: "56px", background: "rgba(8,8,8,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.05em" }}>CRACKD <span style={{ color: "#ff4d00" }}>ADMIN</span></span>
        <LogoutButton />
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ff4d00", marginBottom: "0.25rem" }}>Superadmin · {user.email}</p>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem" }}>Data Dashboard</h1>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "2.5rem" }}>
          {[
            { num: totalCaptions, label: "Captions" },
            { num: totalImages, label: "Images" },
            { num: totalProfiles, label: "Users" },
            { num: totalVotes, label: "Votes" },
          ].map(({ num, label }) => (
            <div key={label} style={{ background: "#0e0e0e", padding: "1.25rem 1.5rem" }}>
              <div style={{ fontSize: "2.2rem", fontWeight: 700, color: "#ff4d00", lineHeight: 1 }}>{num?.toLocaleString()}</div>
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(240,237,232,0.4)", marginTop: "0.25rem" }}>{label}</div>
            </div>
          ))}
        </div>

        <AdminTabs
          captions={captions ?? []}
          profiles={profiles ?? []}
          images={images ?? []}
          humorFlavors={humorFlavors ?? []}
          flavorSteps={flavorSteps ?? []}
          humorMix={humorMix ?? []}
          terms={terms ?? []}
          captionRequests={captionRequests ?? []}
          captionExamples={captionExamples ?? []}
          llmModels={llmModels ?? []}
          llmProviders={llmProviders ?? []}
          llmPromptChains={llmPromptChains ?? []}
          llmResponses={llmResponses ?? []}
          allowedDomains={allowedDomains ?? []}
          whitelistEmails={whitelistEmails ?? []}
        />
      </div>
    </div>
  );
}