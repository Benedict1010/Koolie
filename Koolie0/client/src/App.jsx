import "./App.css";
import "./styles/hero.css";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import HeroIll from "./assets/hero-illustration.svg";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function HomePage() {
  return (
    <>
      {/* keep spacing so content isn't hidden by fixed navbar */}
      <div style={{ paddingTop: "92px" }}>
        <section className="hero-section">
          <div className="hero-card">
            <div className="hero-inner">
              <div className="hero-grid">
                <div className="hero-left">
                  <h1 className="hero-title">Find Trusted Local
                    <br />Service Professionals
                    <br />Near You
                  </h1>

                  <p className="hero-sub">
                    Connect with verified electricians, plumbers, carpenters, and hundreds of other service professionals. Fast, reliable, and transparent.
                  </p>

                  <div className="hero-actions">
                    <button className="btn btn-primary large">Book a Service <span className="arrow">→</span></button>
                    <button className="btn btn-outline large">Join as a Professional</button>
                  </div>
                </div>

                <div className="hero-right" aria-hidden="true">
                  <img src={HeroIll} alt="Illustration" className="hero-illustration-img" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Home component with How It Works section */}
        <Home />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
