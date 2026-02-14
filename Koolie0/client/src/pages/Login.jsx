import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../services/firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
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
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Login Form</h2>

        <div className="auth-tabs" role="tablist">
          <button className="tab tab-active" aria-selected="true">Login</button>
          <Link to="/signup" className="tab tab-inactive">Signup</Link>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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

          {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

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
