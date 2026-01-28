import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("client");

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Signup Form</h2>

        <div className="auth-tabs" role="tablist">
          <Link to="/login" className="tab tab-inactive">Login</Link>
          <button className="tab tab-active" aria-selected="true">Signup</button>
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

          <input
            className="auth-input"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="auth-roles">
            <span className="roles-label">Register as</span>
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="client"
                checked={role === "client"}
                onChange={() => setRole("client")}
              />
              <span>Client</span>
            </label>

            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="professional"
                checked={role === "professional"}
                onChange={() => setRole("professional")}
              />
              <span>Professional</span>
            </label>

            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="both"
                checked={role === "both"}
                onChange={() => setRole("both")}
              />
              <span>Both</span>
            </label>
          </div>

          <button className="auth-submit">Signup</button>

          <div className="auth-footer">
            Already a member? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
