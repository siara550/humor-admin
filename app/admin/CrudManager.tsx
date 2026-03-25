"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function CrudManager({ title, table, rows: initialRows, columns, displayColumns }: {
  title: string;
  table: string;
  rows: any[];
  columns: string[];
  displayColumns: string[];
}) {
  const [rows, setRows] = useState<any[]>(initialRows);
  const [newData, setNewData] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const supabase = createClient();

  const th: any = { textAlign: "left", padding: "0.6rem 1rem", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(240,237,232,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontWeight: 500 };
  const td: any = { padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "rgba(240,237,232,0.8)", fontSize: "0.82rem" };
  const inp: any = { padding: "0.4rem 0.75rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#f0ede8", fontSize: "0.82rem", outline: "none", fontFamily: "sans-serif", width: "100%" };

  const handleCreate = async () => {
    const hasData = columns.some((c) => newData[c]?.trim());
    if (!hasData) return;
    setStatus("Creating...");
    const payload: any = {};
    columns.forEach((c) => { if (newData[c]?.trim()) payload[c] = newData[c].trim(); });
    const { data, error } = await supabase.from(table).insert(payload).select().single();
    if (error) { setStatus("Error: " + error.message); return; }
    setRows([data, ...rows]);
    setNewData({});
    setStatus("Created!");
  };

  const handleUpdate = async (id: any) => {
    setStatus("Updating...");
    const payload: any = {};
    columns.forEach((c) => { if (editData[c] !== undefined) payload[c] = editData[c]; });
    const { error } = await supabase.from(table).update(payload).eq("id", id);
    if (error) { setStatus("Error: " + error.message); return; }
    setRows(rows.map((r) => r.id === id ? { ...r, ...payload } : r));
    setEditingId(null);
    setStatus("Updated!");
  };

  const handleDelete = async (id: any) => {
    if (!confirm("Delete this record?")) return;
    setStatus("Deleting...");
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) { setStatus("Error: " + error.message); return; }
    setRows(rows.filter((r) => r.id !== id));
    setStatus("Deleted!");
  };

  const allCols = [...columns, ...displayColumns.filter((c) => !columns.includes(c))];

  return (
    <div>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#ff4d00", marginBottom: "1rem" }}>{title}</h2>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        {columns.map((c) => (
          <div key={c} style={{ flex: 1, minWidth: 160 }}>
            <label style={{ fontSize: "0.68rem", textTransform: "uppercase" as const, color: "rgba(240,237,232,0.4)", display: "block", marginBottom: "0.25rem" }}>
              {c.replace(/_/g, " ")}
            </label>
            <input
              value={newData[c] ?? ""}
              onChange={(e) => setNewData({ ...newData, [c]: e.target.value })}
              placeholder={c}
              style={inp}
            />
          </div>
        ))}
        <button
          onClick={handleCreate}
          style={{ padding: "0.5rem 1rem", borderRadius: "6px", background: "#ff4d00", border: "none", color: "#fff", fontSize: "0.82rem", cursor: "pointer", alignSelf: "flex-end" }}
        >
          + Add
        </button>
      </div>

      {status && (
        <p style={{ fontSize: "0.75rem", color: "rgba(240,237,232,0.5)", marginBottom: "0.75rem" }}>{status}</p>
      )}

      {rows.length === 0 ? (
        <p style={{ color: "rgba(240,237,232,0.4)", fontSize: "0.85rem" }}>No records found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {allCols.map((c) => (
                  <th key={c} style={th}>{c.replace(/_/g, " ")}</th>
                ))}
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id ?? i}>
                  {allCols.map((c) => (
                    <td key={c} style={{ ...td, maxWidth: 200 }}>
                      {editingId === row.id && columns.includes(c) ? (
                        <input
                          value={editData[c] ?? ""}
                          onChange={(e) => setEditData({ ...editData, [c]: e.target.value })}
                          style={inp}
                        />
                      ) : (
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                          {c.includes("datetime") || c.includes("created_at")
                            ? row[c] ? new Date(row[c]).toLocaleDateString() : "—"
                            : String(row[c] ?? "—")}
                        </span>
                      )}
                    </td>
                  ))}
                  <td style={td}>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      {editingId === row.id ? (
                        <>
                          <button onClick={() => handleUpdate(row.id)} style={{ padding: "0.25rem 0.6rem", borderRadius: "6px", background: "#ff4d00", border: "none", color: "#fff", fontSize: "0.72rem", cursor: "pointer" }}>Save</button>
                          <button onClick={() => setEditingId(null)} style={{ padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(240,237,232,0.6)", fontSize: "0.72rem", cursor: "pointer" }}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(row.id);
                              const d: any = {};
                              columns.forEach((c) => { d[c] = row[c] ?? ""; });
                              setEditData(d);
                            }}
                            style={{ padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(240,237,232,0.6)", fontSize: "0.72rem", cursor: "pointer" }}
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDelete(row.id)} style={{ padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(255,50,50,0.1)", border: "none", color: "rgba(255,100,100,0.8)", fontSize: "0.72rem", cursor: "pointer" }}>Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}