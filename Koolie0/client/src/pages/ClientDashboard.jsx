import React from "react";
import DashboardMainLayout from "../layout/DashboardMainLayout";
import ClientPanel from "../components/dashboard/ClientPanel";

export default function ClientDashboard() {
  return (
    <DashboardMainLayout>
      <ClientPanel />
    </DashboardMainLayout>
  );
}
