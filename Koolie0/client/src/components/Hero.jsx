import React from 'react';
import '../styles/hero.css';

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-inner site-container">
        <div className="hero-copy-column">
          <div className="hero-badge"><span aria-hidden="true"></span> Home services, made simpler</div>
          <h1 className="hero-title">Find trusted local service professionals near you.</h1>
          <p className="hero-copy">
            Connect with electricians, plumbers, carpenters, and other local professionals for the work your home needs.
          </p>
          <div className="hero-actions">
            <a className="button button--primary" href="">Book a service <span aria-hidden="true">→</span></a>
            <a className="button button--secondary" href="#">Join as a professional</a>
          </div>
          <div className="hero-note">
            <span className="hero-note-icon" aria-hidden="true">✓</span>
            Browse the service categories available through KOOLIE
          </div>
        </div>
        <div className="hero-visual">
          <img src="/ac mechanic.jpeg" alt="Air-conditioning technician at work" />
          <div className="hero-image-caption">
            <span>Local expertise</span>
            <strong>Services for everyday home needs</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
