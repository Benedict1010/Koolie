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
    const [providerMap, setProviderMap] = useState({});
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
        // Build a map for quick lookup
        const map = {};
        list.forEach(p => { map[p.id] = p; });
        setProviderMap(map);
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
        // Optionally, update providerMap if not loaded
        if (providers.length === 0) {
          const q = query(collection(db, "users"), where("roles.provider", "==", true));
          const snapProviders = await getDocs(q);
          const listProviders = snapProviders.docs.map((d) => ({ id: d.id, ...d.data() }));
          const map = {};
          listProviders.forEach(p => { map[p.id] = p; });
          setProviderMap(map);
        }
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
                    <th>Name</th>
                    <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p) => (
                  <tr key={p.id}>
                      <td>{p.email || '-'}</td>
                      <td>{p.phone || '-'}</td>
                      <td>{Array.isArray(p.providerProfile?.skills) ? p.providerProfile.skills.join(", ") : '-'}</td>
                      <td>{p.providerProfile?.experience || '-'}</td>
                      <td>{typeof p.providerProfile?.location === 'object' ? Object.values(p.providerProfile.location).join(", ") : p.providerProfile?.location || '-'}</td>
                      <td>{p.providerProfile?.availability || '-'}</td>
                      <td>{p.providerProfile?.name || '-'}</td>
                      <td>{typeof p.providerProfile?.address === 'object' ? Object.values(p.providerProfile.address).join(", ") : p.providerProfile?.address || '-'}</td>
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
                    <th>Provider Details</th>
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
                      <td>
                        {r.providerId && providerMap[r.providerId] ? (
                          <div>
                            <strong>{providerMap[r.providerId].providerProfile?.name || providerMap[r.providerId].email}</strong><br />
                            Skills: {Array.isArray(providerMap[r.providerId].providerProfile?.skills) ? providerMap[r.providerId].providerProfile.skills.join(", ") : '-'}<br />
                            Phone: {providerMap[r.providerId].phone || '-'}<br />
                            Location: {typeof providerMap[r.providerId].providerProfile?.location === 'object' ? Object.values(providerMap[r.providerId].providerProfile.location).join(", ") : providerMap[r.providerId].providerProfile?.location || '-'}
                          </div>
                        ) : '-'}
                      </td>
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
