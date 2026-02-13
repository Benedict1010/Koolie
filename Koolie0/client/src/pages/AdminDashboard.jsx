import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("providers");
  const [providers, setProviders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  // verify admin access
  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/admin-login");
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const roles = snap.data()?.roles || {};
        if (roles.admin !== true) {
          // not allowed, send to normal login
          await signOut(auth);
          navigate("/login");
          return;
        }
        // load initial tab data
        loadProviders();
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), where("roles.provider", "==", true));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProviders(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "serviceRequests"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRequests(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (t) => {
    setTab(t);
    if (t === "providers") {
      loadProviders();
    } else {
      loadRequests();
    }
  };

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => handleTabChange("providers")} disabled={tab === "providers"}>
          Service Providers
        </button>
        <button onClick={() => handleTabChange("requests")} disabled={tab === "requests"}>
          Service Requests
        </button>
        <button
          style={{ float: "right" }}
          onClick={async () => {
            await signOut(auth);
            navigate("/admin-login");
          }}
        >
          Logout
        </button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {tab === "providers" && (
        <div>
          {providers.length === 0 && <p>No providers found.</p>}
          {providers.length > 0 && (
            <table border="1" cellPadding="4" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Skills</th>
                  <th>Experience</th>
                  <th>Location</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p) => (
                  <tr key={p.id}>
                    <td>{p.email}</td>
                    <td>{p.phone || "-"}</td>
                    <td>{(p.skills || []).join(", ")}</td>
                    <td>{p.providerProfile?.experience || "-"}</td>
                    <td>{p.providerProfile?.location || "-"}</td>
                    <td>{p.providerProfile?.availability || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {tab === "requests" && (
        <div>
          {requests.length === 0 && <p>No requests found.</p>}
          {requests.length > 0 && (
            <table border="1" cellPadding="4" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Service Type</th>
                  <th>Client ID</th>
                  <th>Provider ID</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td>{r.serviceType}</td>
                    <td>{r.clientId}</td>
                    <td>{r.providerId || "-"}</td>
                    <td>{r.status}</td>
                    <td>{r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
