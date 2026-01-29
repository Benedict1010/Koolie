import React from "react";
import "./DashboardLayout.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-root">
      <aside className="sidebar" aria-label="Sidebar">
        <div className="brand">
          <div className="logo">K</div>
          <div className="brand-text">Koolie</div>
        </div>
        <nav className="nav" role="navigation">
          <button
            className="nav-item"
            onClick={() => (window.location.pathname = "/")}
            title="Home"
          >
            <span className="icon">🏠</span>
            <span className="label">Home</span>
          </button>
          <button
            className="nav-item"
            onClick={() => alert("Logout placeholder")}
            title="Logout"
          >
            <span className="icon">🔒</span>
            <span className="label">Logout</span>
          </button>
        </nav>
      </aside>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
