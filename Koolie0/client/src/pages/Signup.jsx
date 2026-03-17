import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged } from "firebase/auth";
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
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Signup Form</h2>

        <div className="auth-tabs" role="tablist">
          <Link to="/login" className="tab tab-inactive">Login</Link>
          <button className="tab tab-active" aria-selected="true">Signup</button>
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
          <small style={{ display: "block", marginBottom: "8px", color: "#555" }}>
            Must be 8+ characters and include letters, numbers &amp; special characters.
          </small>

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


          {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
          {success && <div style={{ color: "green", marginBottom: 8 }}>{success}</div>}
          {verifying && <div style={{ color: "#555", marginBottom: 8 }}>Processing...</div>}

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
