import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../services/firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // reuse same strength rule as signup
  const isStrongPassword = (p) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(p);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters and include letters, numbers, and special characters."
      );
      return;
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      if (!user.emailVerified) {
        setError("Please verify your email before logging in. Check your inbox for the verification email.");
        await signOut(auth);
        return;
      }
      const uid = user.uid;

      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        // create a minimal user doc for first-time sign-ins
        try {
          await setDoc(userRef, {
            email: user.email || email,
            roles: { client: true, provider: false },
            profileCompleted: false,
            clientProfile: {},
            providerProfile: {},
            skills: [],
            createdAt: serverTimestamp(),
          });
        } catch (fsErr) {
          console.error("Firestore write failed on login (creating doc):", fsErr);
          setError(
            (fsErr && fsErr.message) || "Failed to create user document. Check Firestore rules and network."
          );
          return;
        }
        navigate("/complete-profile");
        return;
      }

      const data = snap.data();
      const roles = data?.roles || {};
      const isClient = roles.client === true;
      const isProvider = roles.provider === true;

      if (data.profileCompleted === false) {
        navigate("/complete-profile");
      } else {
        // If user has both roles, send them to the role toggle dashboard
        if (isClient && isProvider) {
          navigate("/role-dashboard");
        } else if (isClient) {
          navigate("/client-dashboard");
        } else if (isProvider) {
          navigate("/provider-dashboard");
        } else {
          // fallback to role dashboard if no explicit role set
          navigate("/role-dashboard");
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="auth-page auth-page--split">
      <aside className="auth-aside">
        <div className="auth-aside-brand">
          <span className="auth-aside-mark" aria-hidden="true">K</span>
          <span className="auth-aside-name">KOOLIE</span>
        </div>
        <p className="section-eyebrow">Welcome back</p>
        <h1>Your home services, all in one place.</h1>
        <p className="auth-aside-copy">
          Sign in to manage your requests, professional jobs, and profile.
        </p>
        <ul className="auth-benefits">
          <li><span className="auth-benefit-icon" aria-hidden="true">⌂</span><span>Return to your customer dashboard.</span></li>
          <li><span className="auth-benefit-icon" aria-hidden="true">⚒</span><span>Review available work and assigned jobs.</span></li>
          <li><span className="auth-benefit-icon" aria-hidden="true">✉</span><span>Email verification is required to sign in.</span></li>
        </ul>
      </aside>
      <div className="auth-card">
        <p className="section-eyebrow">Account access</p>
        <h2 className="auth-title">Sign in to KOOLIE</h2>
        <p className="auth-subtitle">Use the email and password associated with your account.</p>

        <div className="auth-tabs" role="tablist">
          <button type="button" className="tab tab-active" aria-selected="true">Login</button>
          <Link to="/signup" className="tab tab-inactive">Sign up</Link>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span className="auth-field-label">Email address</span>
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
            <label className="auth-field-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="auth-input"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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

          <div className="auth-forgot">
            <a href="#">Forgot password?</a>
          </div>

          {error && <div className="auth-message auth-message--error" role="alert">{error}</div>}

          <button className="auth-submit" type="submit">Sign in</button>
        
          <div className="auth-footer">
            New to KOOLIE? <Link to="/signup">Create an account</Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;
