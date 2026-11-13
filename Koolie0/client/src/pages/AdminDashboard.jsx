import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import DashboardLayout from "../layout/DashboardLayout";
import "../styles/admin.css";

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
    return (
      <DashboardLayout>
        <div className="admin-loading" role="status">Loading admin dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="admin-page">
        <header className="admin-page-header">
          <div>
            <p className="section-eyebrow">Operations console</p>
            <h1>Marketplace overview</h1>
            <p>Review the registered providers and service requests available in Firestore.</p>
          </div>
          <span className="admin-authorized"><span aria-hidden="true">●</span> Admin authorized</span>
        </header>

        <div className="admin-toolbar">
          <div className="dashboard-tabs" role="tablist" aria-label="Admin data views">
            <button type="button" className={tab === "providers" ? "tab-btn active" : "tab-btn"} onClick={() => handleTabChange("providers")} disabled={tab === "providers"} role="tab" aria-selected={tab === "providers"}>
              Service providers <span className="tab-count">{providers.length}</span>
            </button>
            <button type="button" className={tab === "requests" ? "tab-btn active" : "tab-btn"} onClick={() => handleTabChange("requests")} disabled={tab === "requests"} role="tab" aria-selected={tab === "requests"}>
              Service requests <span className="tab-count">{requests.length}</span>
            </button>
          </div>
          <button
            type="button"
            className="button button--secondary"
            onClick={async () => {
              await signOut(auth);
              navigate("/admin-login");
            }}
          >
            Log out
          </button>
        </div>
        {error && <div className="auth-message auth-message--error" role="alert">{error}</div>}
        {tab === "providers" && (
          <section className="admin-table-card" aria-label="Service providers">
            <div className="admin-table-heading">
              <div>
                <h2>Service providers</h2>
                <p>{providers.length} provider records loaded</p>
              </div>
            </div>
            {providers.length === 0 ? (
              <p className="admin-empty">No providers found.</p>
            ) : (
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th scope="col">Email</th>
                      <th scope="col">Name</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Skills</th>
                      <th scope="col">Experience</th>
                      <th scope="col">Location</th>
                      <th scope="col">Availability</th>
                      <th scope="col">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((p) => (
                      <tr key={p.id}>
                        <td>{p.email || "-"}</td>
                        <td>{p.providerProfile?.name || "-"}</td>
                        <td>{p.phone || "-"}</td>
                        <td>{Array.isArray(p.providerProfile?.skills) ? p.providerProfile.skills.join(", ") : "-"}</td>
                        <td>{p.providerProfile?.experience || "-"}</td>
                        <td>{typeof p.providerProfile?.location === "object" ? Object.values(p.providerProfile.location).join(", ") : p.providerProfile?.location || "-"}</td>
                        <td>{p.providerProfile?.availability || "-"}</td>
                        <td>{typeof p.providerProfile?.address === "object" ? Object.values(p.providerProfile.address).join(", ") : p.providerProfile?.address || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
        {tab === "requests" && (
          <section className="admin-table-card" aria-label="Service requests">
            <div className="admin-table-heading">
              <div>
                <h2>Service requests</h2>
                <p>{requests.length} request records loaded</p>
              </div>
            </div>
            {requests.length === 0 ? (
              <p className="admin-empty">No requests found.</p>
            ) : (
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th scope="col">Service type</th>
                      <th scope="col">Client ID</th>
                      <th scope="col">Provider ID</th>
                      <th scope="col">Provider details</th>
                      <th scope="col">Status</th>
                      <th scope="col">Created at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id}>
                        <td>{r.serviceType || "-"}</td>
                        <td>{r.clientId || "-"}</td>
                        <td>{r.providerId || "-"}</td>
                        <td>
                          {r.providerId && providerMap[r.providerId] ? (
                            <div className="admin-provider-details">
                              <strong>{providerMap[r.providerId].providerProfile?.name || providerMap[r.providerId].email}</strong>
                              <span>Skills: {Array.isArray(providerMap[r.providerId].providerProfile?.skills) ? providerMap[r.providerId].providerProfile.skills.join(", ") : "-"}</span>
                              <span>Phone: {providerMap[r.providerId].phone || "-"}</span>
                              <span>Location: {typeof providerMap[r.providerId].providerProfile?.location === "object" ? Object.values(providerMap[r.providerId].providerProfile.location).join(", ") : providerMap[r.providerId].providerProfile?.location || "-"}</span>
                            </div>
                          ) : "-"}
                        </td>
                        <td><span className="status-pill">{r.status || "-"}</span></td>
                        <td>{r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </section>
    </DashboardLayout>
  );
}

export default AdminDashboard;
