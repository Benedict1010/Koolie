import React, { useState } from "react";
import RoleToggle from "../components/dashboard/RoleToggle";
import ClientPanel from "../components/dashboard/ClientPanel";
import ProviderPanel from "../components/dashboard/ProviderPanel";
import DashboardLayout from "../layout/DashboardLayout";

export default function RoleDashboard() {
  const [role, setRole] = useState("client");

  return (
    <DashboardLayout>
      <div>
        <RoleToggle role={role} onChange={setRole} />

        <div style={{ marginTop: 50 }}>
          {role === "client" ? <ClientPanel /> : <ProviderPanel />}
        </div>
      </div>
    </DashboardLayout>
  );
}
