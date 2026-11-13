import React from "react";

export default function RoleToggle({ role, onChange }) {
  return (
    <div className="role-switch" role="tablist" aria-label="Dashboard role">
      <button
        type="button"
        className={role === "client" ? "role-switch-button is-active" : "role-switch-button"}
        onClick={() => onChange("client")}
        role="tab"
        aria-selected={role === "client"}
      >
        <span aria-hidden="true">⌂</span> Customer view
      </button>

      <button
        type="button"
        className={role === "professional" ? "role-switch-button is-active" : "role-switch-button"}
        onClick={() => onChange("professional")}
        role="tab"
        aria-selected={role === "professional"}
      >
        <span aria-hidden="true">⚒</span> Professional view
      </button>
    </div>
  );
}
