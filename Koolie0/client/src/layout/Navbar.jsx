import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAuthPage = ["/login", "/signup", "/admin-login"].includes(pathname);
  const isDashboard = [
    "/role-dashboard",
    "/client-dashboard",
    "/provider-dashboard",
    "/request",
    "/complete-profile",
    "/admin",
  ].includes(pathname);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isAuthPage) return null;

  return (
    <header className={isDashboard ? "site-navbar site-navbar--dashboard" : "site-navbar"} role="banner">
      <div className="site-navbar__inner">
        <Link to="/" className="site-brand" aria-label="KOOLIE home">
          <span className="site-brand__mark" aria-hidden="true">K</span>
          <span className="site-brand__name">KOOLIE</span>
        </Link>

        {!isDashboard && (
          <nav className="site-navbar__nav" aria-label="Main navigation">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/#services" className="nav-link">Services</Link>
            <Link to="/#how-it-works" className="nav-link">How it works</Link>
          </nav>
        )}

        <div className="site-navbar__actions">
          {user ? (
            <div className="user-info">
              <span className="user-avatar" aria-hidden="true">{(user.email || "K").charAt(0).toUpperCase()}</span>
              <span className="user-email" title={user.email}>{isDashboard ? (user.displayName || user.email) : user.email}</span>
              {pathname !== "/admin" && (
                <button onClick={handleLogout} className="navbar-logout" aria-label="Log out">⇥</button>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="button button--secondary">Login</Link>
              <Link to="/signup" className="button button--primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
