import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import "../styles/auth.css";
import { auth, db } from "../services/firebase";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("client");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();


  // simple regex requiring letters, numbers and special characters, min length 8
  const isStrongPassword = (p) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(p);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email || !password) return setError("Provide email and password");
    if (!isStrongPassword(password))
      return setError(
        "Password must be at least 8 characters and include letters, numbers, and special characters."
      );
    if (password !== confirmPassword) return setError("Passwords do not match");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const roles = {
        client: role === "client" || role === "both",
        provider: role === "professional" || role === "both",
      };

      try {
        await setDoc(doc(db, "users", uid), {
          email,
          roles,
          profileCompleted: false,
          clientProfile: {},
          providerProfile: {},
          skills: [],
          createdAt: serverTimestamp(),
        });
      } catch (fsErr) {
        console.error("Firestore write failed on signup:", fsErr);
        setError(
          (fsErr && fsErr.message) || "Failed to write user document. Check Firestore rules and network."
        );
        return;
      }

      // Send verification email
      
      setVerifying(true);
      await sendEmailVerification(userCred.user);
      setSuccess("Verification email sent. Please check your inbox.");

      // Sign out user after sending verification
      setTimeout(async () => {
        await signOut(auth);
        setVerifying(false);
        // Wait for user to verify email and login again
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use. Please login instead.");
      } else {
        setError(err.message);
      }
      console.error("Signup error:", err);
      setVerifying(false);
    }
  };

  return (
    <main className="auth-page auth-page--split">
      <aside className="auth-aside">
        <div className="auth-aside-brand">
          <span className="auth-aside-mark" aria-hidden="true">K</span>
          <span className="auth-aside-name">KOOLIE</span>
        </div>
        <p className="section-eyebrow">One connected marketplace</p>
        <h1>Make room for better home services.</h1>
        <p className="auth-aside-copy">
          Create an account to request services, manage your profile, or offer your professional skills.
        </p>
        <ul className="auth-benefits">
          <li><span className="auth-benefit-icon" aria-hidden="true">✓</span><span>Choose a customer or professional profile.</span></li>
          <li><span className="auth-benefit-icon" aria-hidden="true">⌁</span><span>Keep service requests and job updates together.</span></li>
          <li><span className="auth-benefit-icon" aria-hidden="true">↗</span><span>Verify your email before signing in.</span></li>
        </ul>
      </aside>
      <div className="auth-card">
        <p className="section-eyebrow">Create account</p>
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Choose how you want to use KOOLIE.</p>

        <div className="auth-tabs" role="tablist">
          <Link to="/login" className="tab tab-inactive">Login</Link>
          <button type="button" className="tab tab-active" aria-selected="true">Sign up</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span className="auth-field-label">Work or personal email</span>
            <input
              className="auth-input"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <div className="password-input-wrapper">
            <label className="auth-field-label" htmlFor="signup-password">Create password</label>
            <input
              id="signup-password"
              className="auth-input"
              type={showPassword ? "text" : "password"}
              placeholder="Enter a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "︶" : "👁"}
            </button>
          </div>
          <small className="auth-help">
            Must be 8+ characters and include letters, numbers & special characters.
          </small>

          <div className="password-input-wrapper">
            <label className="auth-field-label" htmlFor="signup-confirm-password">Confirm password</label>
            <input
              id="signup-confirm-password"
              className="auth-input"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? "︶" : "👁"}
            </button>
          </div>

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
              <span><strong>Customer</strong><small>Request home services</small></span>
            </label>

            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="professional"
                checked={role === "professional"}
                onChange={() => setRole("professional")}
              />
              <span><strong>Service professional</strong><small>Find available work</small></span>
            </label>

            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="both"
                checked={role === "both"}
                onChange={() => setRole("both")}
              />
              <span><strong>Both</strong><small>Customer and professional</small></span>
            </label>
          </div>

          {error && <div className="auth-message auth-message--error" role="alert">{error}</div>}
          {success && <div className="auth-message auth-message--success" role="status">{success}</div>}
          {verifying && <div className="auth-message auth-message--pending" role="status">Processing...</div>}

          <button className="auth-submit" type="submit">Create account &amp; send verification email</button>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Signup;
