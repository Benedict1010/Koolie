import React, { useEffect, useState } from "react";
import RoleToggle from "../components/dashboard/RoleToggle";
import ClientPanel from "../components/dashboard/ClientPanel";
import ProviderPanel from "../components/dashboard/ProviderPanel";
import DashboardLayout from "../layout/DashboardLayout";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function RoleDashboard() {
  const [role, setRole] = useState("client");
  const [roles, setRoles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      const current = auth.currentUser;
      if (!current) {
        setRoles({ client: false, provider: false });
        setLoading(false);
        return;
      }
      const ref = doc(db, "users", current.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setRoles({ client: false, provider: false });
        setLoading(false);
        return;
      }
      setRoles(snap.data().roles || { client: false, provider: false });
      setLoading(false);
    };
    fetchRoles();
  }, []);

  if (loading) return <DashboardLayout><div style={{ padding: 24 }}>Loading...</div></DashboardLayout>;

  // Only client
  if (roles.client && !roles.provider) {
    return (
      <DashboardLayout>
        <div>
          <h2>Client Dashboard</h2>
          <ClientPanel />
        </div>
      </DashboardLayout>
    );
  }

  // Only provider
  if (!roles.client && roles.provider) {
    return (
      <DashboardLayout>
        <div>
          <h2>Professional Dashboard</h2>
          <ProviderPanel />
        </div>
      </DashboardLayout>
    );
  }

  // Both roles
  if (roles.client && roles.provider) {
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

  // No role
  return (
    <DashboardLayout>
      <div style={{ padding: 24 }}>No roles assigned. Please contact support.</div>
    </DashboardLayout>
  );
}
