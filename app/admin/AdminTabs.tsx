"use client";

import { useState } from "react";
import ImagesManager from "./ImagesManager";
import SimpleTable from "./SimpleTable";
import CrudManager from "./CrudManager";

const tabs = [
  "Caption Stats", "Captions", "Users", "Images", "Humor Flavors", "Flavor Steps",
  "Humor Mix", "Terms", "Caption Requests", "Caption Examples",
  "LLM Models", "LLM Providers", "Prompt Chains", "LLM Responses",
  "Allowed Domains", "Whitelist Emails"
];

export default function AdminTabs({
  captions, profiles, images, humorFlavors, flavorSteps, humorMix,
  terms, captionRequests, captionExamples, llmModels, llmProviders,
  llmPromptChains, llmResponses, allowedDomains, whitelistEmails,
  totalUpvotes, totalDownvotes, totalVotes, topVotedCaptions
}: any) {
  const [active, setActive] = useState("Caption Stats");

  const tabStyle = (t: string) => ({
    padding: "0.4rem 0.85rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 500,
    border: "1px solid",
    borderColor: active === t ? "#ff4d00" : "rgba(255,255,255,0.12)",
    background: active === t ? "rgba(255,77,0,0.15)" : "transparent",
    color: active === t ? "#ff4d00" : "rgba(240,237,232,0.6)",
    cursor: "pointer",
    fontFamily: "sans-serif",
    whiteSpace: "nowrap" as const,
  });

  // Aggregate vote counts per caption from raw votes
  const voteMap = new Map<string, { content: string; up: number; down: number }>();
  (topVotedCaptions ?? []).forEach((v: any) => {
    const id = v.caption_id;
    const content = v.captions?.content ?? "(no content)";
    if (!voteMap.has(id)) voteMap.set(id, { content, up: 0, down: 0 });
    if (v.vote === 1) voteMap.get(id)!.up++;
    if (v.vote === -1) voteMap.get(id)!.down++;
  });
  const sortedCaptions = Array.from(voteMap.entries())
    .map(([id, d]) => ({ id, ...d, total: d.up + d.down, score: d.up - d.down }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const upvotePct = totalVotes > 0 ? Math.round((totalUpvotes / totalVotes) * 100) : 0;

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActive(t)} style={tabStyle(t)}>{t}</button>
        ))}
      </div>

      {active === "Caption Stats" && (
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.5rem", color: "#f0ede8" }}>Caption Rating Statistics</h2>

          {/* Vote breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "2rem" }}>
            {[
              { num: totalVotes, label: "Total Votes" },
              { num: totalUpvotes, label: "Upvotes 👍" },
              { num: totalDownvotes, label: "Downvotes 👎" },
            ].map(({ num, label }) => (
              <div key={label} style={{ background: "#0e0e0e", padding: "1.25rem 1.5rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "#ff4d00", lineHeight: 1 }}>{num?.toLocaleString()}</div>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(240,237,232,0.4)", marginTop: "0.25rem" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Upvote % bar */}
          <div style={{ background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.8rem", color: "rgba(240,237,232,0.6)" }}>Upvote Rate</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ff4d00" }}>{upvotePct}%</span>
            </div>
            <div style={{ height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${upvotePct}%`, background: "#ff4d00", borderRadius: "999px", transition: "width 0.5s" }} />
            </div>
          </div>

          {/* Top voted captions table */}
          <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(240,237,232,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Most Voted Captions</h3>
          <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                  {["Caption", "👍 Up", "👎 Down", "Score", "Total Votes"].map(h => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "rgba(240,237,232,0.4)", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedCaptions.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "#0e0e0e" : "#111" }}>
                    <td style={{ padding: "0.75rem 1rem", color: "#f0ede8", maxWidth: "400px" }}>{c.content}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#4ade80" }}>{c.up}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#f87171" }}>{c.down}</td>
                    <td style={{ padding: "0.75rem 1rem", color: c.score >= 0 ? "#4ade80" : "#f87171", fontWeight: 600 }}>{c.score > 0 ? `+${c.score}` : c.score}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "rgba(240,237,232,0.5)" }}>{c.total}</td>
                  </tr>
                ))}
                {sortedCaptions.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "rgba(240,237,232,0.3)" }}>No votes yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {active === "Captions" && (
        <SimpleTable title="Captions (Read Only)" rows={captions} columns={["id", "content", "created_datetime_utc"]} />
      )}
      {active === "Users" && (
        <SimpleTable title="Users / Profiles (Read Only)" rows={profiles} columns={["email", "first_name", "last_name", "is_superadmin", "created_datetime_utc"]} />
      )}
      {active === "Images" && <ImagesManager initialImages={images} />}
      {active === "Humor Flavors" && (
        <SimpleTable title="Humor Flavors (Read Only)" rows={humorFlavors} columns={["id", "name", "description", "created_datetime_utc"]} />
      )}
      {active === "Flavor Steps" && (
        <SimpleTable title="Humor Flavor Steps (Read Only)" rows={flavorSteps} columns={["id", "humor_flavor_id", "order_by", "llm_temperature", "created_datetime_utc"]} />
      )}
      {active === "Humor Mix" && (
        <SimpleTable title="Humor Mix (Read Only)" rows={humorMix} columns={["id", "created_datetime_utc"]} />
      )}
      {active === "Terms" && (
        <CrudManager title="Terms" table="terms" rows={terms} columns={["term", "definition"]} displayColumns={["id", "term", "definition", "created_datetime_utc"]} />
      )}
      {active === "Caption Requests" && (
        <SimpleTable title="Caption Requests (Read Only)" rows={captionRequests} columns={["id", "created_datetime_utc"]} />
      )}
      {active === "Caption Examples" && (
        <CrudManager title="Caption Examples" table="caption_examples" rows={captionExamples} columns={["caption", "image_id"]} displayColumns={["id", "created_datetime_utc"]} />
      )}
      {active === "LLM Models" && (
        <CrudManager title="LLM Models" table="llm_models" rows={llmModels} columns={["name"]} displayColumns={["id", "name", "created_datetime_utc"]} />
      )}
      {active === "LLM Providers" && (
        <CrudManager title="LLM Providers" table="llm_providers" rows={llmProviders} columns={["name"]} displayColumns={["id", "name", "created_datetime_utc"]} />
      )}
      {active === "Prompt Chains" && (
        <SimpleTable title="LLM Prompt Chains (Read Only)" rows={llmPromptChains} columns={["id", "created_datetime_utc"]} />
      )}
      {active === "LLM Responses" && (
        <SimpleTable title="LLM Responses (Read Only)" rows={llmResponses} columns={["id", "created_datetime_utc"]} />
      )}
      {active === "Allowed Domains" && (
        <CrudManager title="Allowed Signup Domains" table="allowed_signup_domains" rows={allowedDomains} columns={["domain"]} displayColumns={["id", "domain", "created_datetime_utc"]} />
      )}
      {active === "Whitelist Emails" && (
        <CrudManager title="Whitelisted Email Addresses" table="whitelist_email_addresses" rows={whitelistEmails} columns={["email"]} displayColumns={["id", "email", "created_datetime_utc"]} />
      )}
    </div>
  );
}