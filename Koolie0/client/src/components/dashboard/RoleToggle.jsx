import React from "react";

export default function RoleToggle({ role, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button
        style={{ padding: "8px 12px", borderRadius: 8, background: role === "client" ? "#007bff" : "#f3f6fb", color: role === "client" ? "#fff" : "#111" }}
        onClick={() => onChange("client")}
      >
        Client
      </button>

      <button
        style={{ padding: "8px 12px", borderRadius: 8, background: role === "professional" ? "#007bff" : "#f3f6fb", color: role === "professional" ? "#fff" : "#111" }}
        onClick={() => onChange("professional")}
      >
        Professional
      </button>
    </div>
  );
}
