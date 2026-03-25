"use client";

import { useState } from "react";
import ImagesManager from "./ImagesManager";
import SimpleTable from "./SimpleTable";
import CrudManager from "./CrudManager";

const tabs = [
  "Captions", "Users", "Images", "Humor Flavors", "Flavor Steps",
  "Humor Mix", "Terms", "Caption Requests", "Caption Examples",
  "LLM Models", "LLM Providers", "Prompt Chains", "LLM Responses",
  "Allowed Domains", "Whitelist Emails"
];

export default function AdminTabs({
  captions, profiles, images, humorFlavors, flavorSteps, humorMix,
  terms, captionRequests, captionExamples, llmModels, llmProviders,
  llmPromptChains, llmResponses, allowedDomains, whitelistEmails
}: any) {
  const [active, setActive] = useState("Captions");

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

  return (
    <div>
      {/* TAB BAR */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActive(t)} style={tabStyle(t)}>{t}</button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {active === "Captions" && (
        <SimpleTable
          title="Captions (Read Only)"
          rows={captions}
          columns={["id", "content", "created_datetime_utc"]}
        />
      )}
      {active === "Users" && (
        <SimpleTable
          title="Users / Profiles (Read Only)"
          rows={profiles}
          columns={["email", "first_name", "last_name", "is_superadmin", "created_datetime_utc"]}
        />
      )}
      {active === "Images" && (
        <ImagesManager initialImages={images} />
      )}
      {active === "Humor Flavors" && (
        <SimpleTable
          title="Humor Flavors (Read Only)"
          rows={humorFlavors}
          columns={["id", "name", "description", "created_datetime_utc"]}
        />
      )}
      {active === "Flavor Steps" && (
        <SimpleTable
          title="Humor Flavor Steps (Read Only)"
          rows={flavorSteps}
          columns={["id", "humor_flavor_id", "order_by", "llm_temperature", "created_datetime_utc"]}
        />
      )}
      {active === "Humor Mix" && (
        <SimpleTable
          title="Humor Mix (Read Only)"
          rows={humorMix}
          columns={["id", "created_datetime_utc"]}
        />
      )}
      {active === "Terms" && (
        <CrudManager
          title="Terms"
          table="terms"
          rows={terms}
          columns={["term", "definition"]}
          displayColumns={["id", "term", "definition", "created_datetime_utc"]}
        />
      )}
      {active === "Caption Requests" && (
        <SimpleTable
          title="Caption Requests (Read Only)"
          rows={captionRequests}
          columns={["id", "created_datetime_utc"]}
        />
      )}
      {active === "Caption Examples" && (
        <CrudManager
          title="Caption Examples"
          table="caption_examples"
          rows={captionExamples}
          columns={["caption", "image_id"]}
          displayColumns={["id", "created_datetime_utc"]}
        />
      )}
      {active === "LLM Models" && (
        <CrudManager
          title="LLM Models"
          table="llm_models"
          rows={llmModels}
          columns={["name"]}
          displayColumns={["id", "name", "created_datetime_utc"]}
        />
      )}
      {active === "LLM Providers" && (
        <CrudManager
          title="LLM Providers"
          table="llm_providers"
          rows={llmProviders}
          columns={["name"]}
          displayColumns={["id", "name", "created_datetime_utc"]}
        />
      )}
      {active === "Prompt Chains" && (
        <SimpleTable
          title="LLM Prompt Chains (Read Only)"
          rows={llmPromptChains}
          columns={["id", "created_datetime_utc"]}
        />
      )}
      {active === "LLM Responses" && (
        <SimpleTable
          title="LLM Responses (Read Only)"
          rows={llmResponses}
          columns={["id", "created_datetime_utc"]}
        />
      )}
      {active === "Allowed Domains" && (
        <CrudManager
          title="Allowed Signup Domains"
          table="allowed_signup_domains"
          rows={allowedDomains}
          columns={["domain"]}
          displayColumns={["id", "domain", "created_datetime_utc"]}
        />
      )}
      {active === "Whitelist Emails" && (
        <CrudManager
          title="Whitelisted Email Addresses"
          table="whitelist_email_addresses"
          rows={whitelistEmails}
          columns={["email"]}
          displayColumns={["id", "email", "created_datetime_utc"]}
        />
      )}
    </div>
  );
}