import React from "react";
import Hero from "../components/Hero";

function Home() {
  return (
    <>
      <Hero />

      {/* Why Choose ServicePro Section */}
      <section className="why-choose-section">
        <div className="why-container">
          <h2 className="why-title">Why Us?</h2>
          <p className="why-subtitle">We make finding and hiring service professionals simple and safe</p>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#1a9a2b" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="#dff7e6" fill="#eaf9ee" />
                  <path d="M9 12l2 2 4-4" stroke="#118a2a" strokeWidth="2.5" fill="none" />
                </svg>
              </div>
              <h3 className="why-card-title">Verified Professionals</h3>
              <p className="why-card-desc">All service providers are verified and background checked</p>
            </div>

            <div className="why-card">
              <div className="why-icon">
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#1a9a2b" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="#dff7e6" fill="#eaf9ee" />
                  <path d="M9 12l2 2 4-4" stroke="#118a2a" strokeWidth="2.5" fill="none" />
                </svg>
              </div>
              <h3 className="why-card-title">Fair Pricing</h3>
              <p className="why-card-desc">Transparent pricing with no hidden fees or surprises</p>
            </div>

            <div className="why-card">
              <div className="why-icon">
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#1a9a2b" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="#dff7e6" fill="#eaf9ee" />
                  <path d="M9 12l2 2 4-4" stroke="#118a2a" strokeWidth="2.5" fill="none" />
                </svg>
              </div>
              <h3 className="why-card-title">24/7 Support</h3>
              <p className="why-card-desc">Our support team is always available to help</p>
            </div>

            <div className="why-card">
              <div className="why-icon">
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#1a9a2b" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="#dff7e6" fill="#eaf9ee" />
                  <path d="M9 12l2 2 4-4" stroke="#118a2a" strokeWidth="2.5" fill="none" />
                </svg>
              </div>
              <h3 className="why-card-title">Quality Guarantee</h3>
              <p className="why-card-desc">We guarantee satisfaction or your money back</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <h2 className="how-it-works-title">How It Works</h2>
          <p className="how-it-works-subtitle">Get quality service in just three simple steps</p>
          
          <div className="how-it-works-grid">
            {/* Card 1 */}
            <div className="how-it-works-card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="card-title">Post Your Request</h3>
              <p className="card-description">Tell us what you need and provide some details about your project.</p>
            </div>

            {/* Card 2 */}
            <div className="how-it-works-card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="card-title">Get Matched</h3>
              <p className="card-description">We match you with verified professionals in your area.</p>
            </div>

            {/* Card 3 */}
            <div className="how-it-works-card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8 10 1 17"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </div>
              <h3 className="card-title">Get Service</h3>
              <p className="card-description">Chat, schedule, and complete your project with confidence.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
