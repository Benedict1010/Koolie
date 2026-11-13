import React, { useEffect, useState } from "react";
import RoleToggle from "../components/dashboard/RoleToggle";
import ClientPanel from "../components/dashboard/ClientPanel";
import ProviderPanel from "../components/dashboard/ProviderPanel";
import DashboardMainLayout from "../layout/DashboardMainLayout";

export default function RoleDashboard() {
  const [role, setRole] = useState("client");

  return (
    <DashboardMainLayout>
      <div className="role-dashboard">
        <header className="role-dashboard-header">
          <div>
            <p className="section-eyebrow">Combined account</p>
            <h1>Your KOOLIE workspace</h1>
            <p>Switch between the customer and professional views for your account.</p>
          </div>
        </header>
        <RoleToggle role={role} onChange={setRole} />

        <div className="role-dashboard-panel">
          {role === "client" ? <ClientPanel /> : <ProviderPanel />}
        </div>
      </div>
    </DashboardMainLayout>
  );
}
