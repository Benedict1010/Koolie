import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Admin Login</h2>
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

          {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

          <button className="auth-submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
