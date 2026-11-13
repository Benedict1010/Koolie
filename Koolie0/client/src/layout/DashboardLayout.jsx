import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./DashboardLayout.css";

export default function DashboardLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAdmin = pathname === "/admin" || pathname === "/admin-login";
  const isProvider = pathname === "/provider-dashboard";
  const isProfile = pathname === "/complete-profile";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="dashboard-root">
      <aside className="sidebar" aria-label="Dashboard navigation">
        <div className="sidebar-caption">Workspace</div>
        <nav className="sidebar-nav" aria-label="Console views">
          <Link className={!isProvider && !isAdmin && !isProfile ? "sidebar-link is-active" : "sidebar-link"} to="/client-dashboard">
            <span className="sidebar-link-icon" aria-hidden="true">⌂</span>
            <span>Client overview</span>
          </Link>
          <Link className={isProvider ? "sidebar-link is-active" : "sidebar-link"} to="/provider-dashboard">
            <span className="sidebar-link-icon" aria-hidden="true">⚒</span>
            <span>Provider hub</span>
          </Link>
          <Link className={isAdmin ? "sidebar-link is-active" : "sidebar-link"} to="/admin">
            <span className="sidebar-link-icon" aria-hidden="true">▣</span>
            <span>Admin console</span>
          </Link>
        </nav>
        <div className="sidebar-caption sidebar-caption--section">Account</div>
        <nav className="sidebar-nav" aria-label="Account navigation">
          <Link className={isProfile ? "sidebar-link is-active" : "sidebar-link"} to="/complete-profile">
            <span className="sidebar-link-icon" aria-hidden="true">◉</span>
            <span>Profile setup</span>
          </Link>
          <Link className="sidebar-link" to="/">
            <span className="sidebar-link-icon" aria-hidden="true">↗</span>
            <span>Home</span>
          </Link>
          <button type="button" className="sidebar-link" onClick={handleLogout}>
            <span className="sidebar-link-icon" aria-hidden="true">⇥</span>
            <span>Log out</span>
          </button>
        </nav>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}
