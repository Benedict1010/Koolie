import React, { useState } from "react";
import RoleToggle from "../components/dashboard/RoleToggle";
import ClientPanel from "../components/dashboard/ClientPanel";
import ProviderPanel from "../components/dashboard/ProviderPanel";

export default function RoleDashboard() {
  const [role, setRole] = useState("client");

  return (
    <div style={{ paddingTop: "92px" }}>
      <h2>Role Dashboard</h2>
      <RoleToggle role={role} onChange={setRole} />
+
      <div style={{ marginTop: 18 }}>
        {role === "client" ? <ClientPanel /> : <ProviderPanel />}
      </div>
    </div>
  );
}
