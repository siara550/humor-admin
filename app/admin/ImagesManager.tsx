"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type ImageRow = { id: string; url: string | null; created_datetime_utc: string | null; };

export default function ImagesManager({ initialImages }: { initialImages: ImageRow[] }) {
  const [images, setImages] = useState<ImageRow[]>(initialImages);
  const [newUrl, setNewUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [status, setStatus] = useState("");
  const supabase = createClient();

  const handleCreate = async () => {
    if (!newUrl.trim()) return;
    setStatus("Creating...");
    const { data, error } = await supabase.from("images").insert({ url: newUrl.trim() }).select().single();
    if (error) { setStatus(`Error: ${error.message}`); return; }
    setImages([data, ...images]);
    setNewUrl("");
    setStatus("Created!");
  };

  const handleUpdate = async (id: string) => {
    setStatus("Updating...");
    const { error } = await supabase.from("images").update({ url: editUrl }).eq("id", id);
    if (error) { setStatus(`Error: ${error.message}`); return; }
    setImages(images.map(img => img.id === id ? { ...img, url: editUrl } : img));
    setEditingId(null);
    setStatus("Updated!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    setStatus("Deleting...");
    const { error } = await supabase.from("images").delete().eq("id", id);
    if (error) { setStatus(`Error: ${error.message}`); return; }
    setImages(images.filter(img => img.id !== id));
    setStatus("Deleted!");
  };

  const inp = { padding: "0.5rem 0.75rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#f0ede8", fontSize: "0.82rem", outline: "none", fontFamily: "sans-serif" };
  const btn = (bg: string, color: string) => ({ padding: "0.25rem 0.6rem", borderRadius: "6px", background: bg, border: "none", color, fontSize: "0.72rem", cursor: "pointer", fontFamily: "sans-serif" });

  return (
    <div>
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
        <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="Paste image URL to add..." style={{ ...inp, flex: 1 }} />
        <button onClick={handleCreate} style={btn("#ff4d00", "#fff")}>+ Add Image</button>
      </div>
      {status && <p style={{ fontSize: "0.75rem", color: "rgba(240,237,232,0.5)", marginBottom: "0.75rem" }}>{status}</p>}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr>
              {["Preview", "URL", "Created", "Actions"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "0.6rem 1rem", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(240,237,232,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {images.map(img => (
              <tr key={img.id}>
                <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {img.url ? <img src={img.url} alt="" style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 4 }} /> : "—"}
                </td>
                <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", maxWidth: 300 }}>
                  {editingId === img.id
                    ? <input value={editUrl} onChange={e => setEditUrl(e.target.value)} style={{ ...inp, width: "100%" }} />
                    : <span style={{ fontSize: "0.75rem", color: "rgba(240,237,232,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{img.url ?? "—"}</span>
                  }
                </td>
                <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.75rem", color: "rgba(240,237,232,0.4)", whiteSpace: "nowrap" }}>
                  {img.created_datetime_utc ? new Date(img.created_datetime_utc).toLocaleDateString() : "—"}
                </td>
                <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {editingId === img.id ? (
                      <>
                        <button onClick={() => handleUpdate(img.id)} style={btn("#ff4d00", "#fff")}>Save</button>
                        <button onClick={() => setEditingId(null)} style={btn("rgba(255,255,255,0.08)", "rgba(240,237,232,0.6)")}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingId(img.id); setEditUrl(img.url ?? ""); }} style={btn("rgba(255,255,255,0.06)", "rgba(240,237,232,0.6)")}>Edit</button>
                        <button onClick={() => handleDelete(img.id)} style={btn("rgba(255,50,50,0.1)", "rgba(255,100,100,0.8)")}>Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}