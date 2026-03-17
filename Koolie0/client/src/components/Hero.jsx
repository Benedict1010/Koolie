import React from 'react';
import '../styles/hero.css';

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-bg-slice" aria-hidden="true"></div>

      <div className="hero-card">
        <div className="hero-left">
          <div className="left-inner">
            <div className="illustration-placeholder">{/* placeholder image */}</div>
            <div className="left-buttons">
              <button className="btn btn-book"><a href="#">Book a service</a></button>
              <button className="btn btn-join"><a href="#">Join as professional</a></button>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <h1 className="hero-title">Find Trusted Local Service Professionals Near You</h1>
          <p className="hero-copy">
            Connect with verified electricians, plumbers, carpenters, and hundreds of other service professionals. Fast, reliable, and transparent.
          </p>
        </div>
      </div>
    </section>
  );
}
