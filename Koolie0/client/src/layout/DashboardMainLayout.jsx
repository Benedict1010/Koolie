import React from "react";
import "./DashboardLayout.css";

export default function DashboardMainLayout({ children }) {
  return (
    <div className="dashboard-root">
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
