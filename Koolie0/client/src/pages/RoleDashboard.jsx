import React, { useEffect, useState } from "react";
import RoleToggle from "../components/dashboard/RoleToggle";
import ClientPanel from "../components/dashboard/ClientPanel";
import ProviderPanel from "../components/dashboard/ProviderPanel";
import DashboardLayout from "../layout/DashboardLayout";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function RoleDashboard() {
  const [role, setRole] = useState("client");

  return (
    <DashboardLayout>
      <div>
        <h2>Role Dashboard</h2>
        <RoleToggle role={role} onChange={setRole} />

        <div style={{ marginTop: 18 }}>
          {role === "client" ? <ClientPanel /> : <ProviderPanel />}
        </div>
      </div>
    </DashboardLayout>
  );
}
