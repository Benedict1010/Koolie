import React from "react";
import DashboardLayout from "../layout/DashboardLayout";
import ClientPanel from "../components/dashboard/ClientPanel";

export default function ClientDashboard() {
  return (
    <DashboardLayout>
      <div>
        <h2>Client Dashboard</h2>
        <ClientPanel />
      </div>
    </DashboardLayout>
  );
}
