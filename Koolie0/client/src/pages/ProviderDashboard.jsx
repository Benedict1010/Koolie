import React from "react";
import DashboardLayout from "../layout/DashboardLayout";
import ProviderPanel from "../components/dashboard/ProviderPanel";

export default function ProviderDashboard() {
  return (
    <DashboardLayout>
      <div>
        <h2>Professional Dashboard</h2>
        <ProviderPanel />
      </div>
    </DashboardLayout>
  );
}
