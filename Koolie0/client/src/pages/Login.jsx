import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Login Form</h2>

        <div className="auth-tabs" role="tablist">
          <button className="tab tab-active" aria-selected="true">Login</button>
          <Link to="/signup" className="tab tab-inactive">Signup</Link>
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="auth-forgot">
            <a href="#">Forgot password?</a>
          </div>

          <button className="auth-submit">Login</button>
        
          <div className="auth-footer">
            Not a member? <Link to="/signup">Signup now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
