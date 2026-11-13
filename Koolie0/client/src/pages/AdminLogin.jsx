import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isStrongPassword = (p) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(p);
  };

  // redirect if already authenticated as admin
  React.useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      getDoc(doc(db, "users", user.uid)).then((snap) => {
        const roles = snap.data()?.roles || {};
        if (roles.admin === true) {
          navigate("/admin");
        }
      });
    }
  }, [navigate]);

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
      const uid = cred.user.uid;
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        // shouldn't happen for admin users, but redirect to login anyway
        setError("No user document found.");
        await signOut(auth);
        return;
      }
      const data = snap.data();
      const roles = data?.roles || {};
      if (roles.admin === true) {
        navigate("/admin");
      } else {
        // not an admin
        setError("You are not authorized as an admin.");
        await signOut(auth);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-admin-label">KOOLIE internal operations</div>
        <h2 className="auth-title">Admin console sign in</h2>
        <p className="auth-subtitle">Sign in with an account authorized for KOOLIE administration.</p>
        <div className="auth-message auth-message--pending">
          Admin access is checked against the role on your account.
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span className="auth-field-label">Admin email</span>
            <input
              className="auth-input"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </label>
          <div className="password-input-wrapper">
            <label className="auth-field-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
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

          {error && <div className="auth-message auth-message--error" role="alert">{error}</div>}

          <button className="auth-submit" type="submit">Authorize &amp; open console</button>
          <div className="auth-footer"><Link to="/login">Standard user login</Link></div>
        </form>
      </div>
    </main>
  );
}

export default AdminLogin;
