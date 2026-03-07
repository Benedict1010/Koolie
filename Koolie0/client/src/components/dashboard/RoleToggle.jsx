import React from "react";

export default function RoleToggle({ role, onChange }) {
  return (
    <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
      <button
        style={{ padding: "10px 130px", borderRadius: 40, background: role === "client" ? "#FFD700" : "#e5e7eb", color: role === "client" ? "#2563eb" : "#000000", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 14 }}
        onClick={() => onChange("client")}
      >
        Client
      </button>

      <button
        style={{ padding: "10px 100px", borderRadius: 40, background: role === "professional" ? "#FFD700" : "#e5e7eb", color: role === "professional" ? "#2563eb" : "#000000", border: "none", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
        onClick={() => onChange("professional")}
      >
        Professional
      </button>
    </div>
  );
}
