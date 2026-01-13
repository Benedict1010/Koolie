import React from "react";
import "../../styles/navbar.css";

export default function Navbar() {
  return (
    <header className="site-navbar" role="banner">
      <div className="site-navbar__inner">
        <div className="site-navbar__left">
          {/* Placeholder for logo image - replace the div below with an <img> when you have the logo */}
          <div className="logo-placeholder" aria-hidden="true">SP</div>
          <div className="brand-name">KOOLIE</div>
        </div>

        <nav className="site-navbar__nav" role="navigation" aria-label="Main navigation">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Services</a>
          <a href="#" className="nav-link">How it Works</a>
        </nav>

        <div className="site-navbar__actions">
          <button className="btn btn-outline">Login</button>
          <button className="btn btn-primary">Sign Up</button>
        </div>
      </div>
    </header>
  );
}
