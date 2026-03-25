"use client";

export default function SimpleTable({ title, rows, columns }: { title: string; rows: any[]; columns: string[] }) {
  const th = { textAlign: "left" as const, padding: "0.6rem 1rem", fontSize: "0.68rem", textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "rgba(240,237,232,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontWeight: 500 };
  const td = { padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "rgba(240,237,232,0.8)", fontSize: "0.82rem", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const };

  return (
    <div>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#ff4d00", marginBottom: "1rem" }}>{title}</h2>
      {rows.length === 0 ? (
        <p style={{ color: "rgba(240,237,232,0.4)", fontSize: "0.85rem" }}>No data found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{columns.map(c => <th key={c} style={th}>{c.replace(/_/g, " ")}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id ?? i}>
                  {columns.map(c => (
                    <td key={c} style={td}>
                      {c.includes("datetime") || c.includes("created_at")
                        ? row[c] ? new Date(row[c]).toLocaleDateString() : "—"
                        : c === "is_superadmin"
                        ? <span style={{ padding: "0.2rem 0.5rem", borderRadius: "999px", fontSize: "0.65rem", background: row[c] ? "rgba(0,200,100,0.15)" : "rgba(255,255,255,0.06)", color: row[c] ? "#00c864" : "rgba(240,237,232,0.4)", border: `1px solid ${row[c] ? "rgba(0,200,100,0.2)" : "rgba(255,255,255,0.08)"}` }}>{row[c] ? "Yes" : "No"}</span>
                        : String(row[c] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}