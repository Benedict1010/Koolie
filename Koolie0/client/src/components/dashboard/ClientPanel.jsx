import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebase";
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { SERVICES } from "../../constants/services";

export default function ClientPanel() {
  const [activeTab, setActiveTab] = useState("request");
  const [selectedService, setSelectedService] = useState(null);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  // services list moved to shared constant
  const services = SERVICES;

  const tabBtnStyle = (active) => ({
    padding: "8px 14px",
    borderRadius: 6,
    border: active ? "2px solid #2563eb" : "1px solid #e5e7eb",
    background: active ? "#eef2ff" : "white",
    cursor: "pointer",
    fontWeight: 600,
  });

  useEffect(() => {
    let unsubSnapshot = null;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      console.debug("ClientPanel onAuthStateChanged user:", user && user.uid);
      if (!user) {
        console.debug("No authenticated user - clearing requests list");
        setRequests([]);
        if (unsubSnapshot) {
          unsubSnapshot();
          unsubSnapshot = null;
        }
        return;
      }

      const q = query(collection(db, "serviceRequests"), where("clientId", "==", user.uid));

      unsubSnapshot = onSnapshot(
        q,
        (snap) => {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          console.debug("serviceRequests snapshot count:", items.length, "for user", user.uid, items);
          // sort by createdAt descending (handle missing or serverTimestamp placeholders)
          items.sort((a, b) => {
            const ta = a.createdAt && typeof a.createdAt.toMillis === "function" ? a.createdAt.toMillis() : (a.createdAt && a.createdAt.seconds ? a.createdAt.seconds * 1000 : 0);
            const tb = b.createdAt && typeof b.createdAt.toMillis === "function" ? b.createdAt.toMillis() : (b.createdAt && b.createdAt.seconds ? b.createdAt.seconds * 1000 : 0);
            return tb - ta;
          });
          setRequests(items);
        },
        (err) => {
          console.error("serviceRequests listener error:", err);
        }
      );
    });

    return () => {
      unsubAuth();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, []);

  // fetch provider user docs for any assigned requests so client can see provider details
  const [providerDetails, setProviderDetails] = useState({});
  const [openProviderId, setOpenProviderId] = useState(null);

  useEffect(() => {
    let mounted = true;
    const ids = Array.from(new Set(requests.filter((r) => r.providerId).map((r) => r.providerId)));
    if (ids.length === 0) {
      if (mounted) setProviderDetails({});
      return () => (mounted = false);
    }

    const fetchProviders = async () => {
      try {
        const map = {};
        await Promise.all(
          ids.map(async (pid) => {
            try {
              const snap = await getDoc(doc(db, "users", pid));
              if (snap.exists()) map[pid] = { id: snap.id, ...(snap.data() || {}) };
            } catch (e) {
              console.error("Failed to fetch provider doc", pid, e);
            }
          })
        );
        if (mounted) setProviderDetails(map);
      } catch (err) {
        console.error("Failed to load provider details:", err);
      }
    };

    fetchProviders();
    return () => {
      mounted = false;
    };
  }, [requests]);

  return (
    <div>
      <h3>Client Panel</h3>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button
          type="button"
          onClick={() => setActiveTab("request")}
          style={tabBtnStyle(activeTab === "request")}
        >
          REQUEST A SERVICE
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("myRequests")}
          style={tabBtnStyle(activeTab === "myRequests")}
        >
          MY REQUESTS
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        {activeTab === "request" ? (
          <div>
            <h4 style={{ marginBottom: 12 }}>STEP 1: SERVICE SELECTION</h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 12,
              }}
            >
              {services.map((s) => (
                <div
                  key={s}
                  onClick={() => {
                    setSelectedService(s);
                    navigate("/request", { state: { service: s } });
                  }}
                  role="button"
                  tabIndex={0}
                  style={{
                    border:
                      selectedService === s ? "2px solid #2563eb" : "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: 12,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    background: "white",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 8,
                      background: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />

                  <div style={{ fontWeight: 600 }}>{s}</div>
                </div>
              ))}
            </div>

            {selectedService && (
              <div style={{ marginTop: 12 }}>
                Selected service: <strong>{selectedService}</strong>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h4 style={{ marginBottom: 8 }}>My Requests</h4>
            {requests.length === 0 ? (
              <p style={{ color: "#6b7280" }}>You have no requests yet.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {requests.map((r) => (
                  <div
                    key={r.requestId || r.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      padding: 12,
                      background: "white",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 700 }}>{r.serviceType}</div>
                      <div style={{ color: r.status === "open" ? "#059669" : "#6b7280", fontWeight: 700 }}>{r.status}</div>
                    </div>

                    <div style={{ marginTop: 8, color: "#374151" }}>{r.description}</div>
                    <div style={{ marginTop: 8, color: "#6b7280", fontSize: 13 }}>Location: {r.location}</div>
                    {r.status === "assigned" && r.providerId && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                          <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 6, overflow: "hidden", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {providerDetails[r.providerId] && providerDetails[r.providerId].providerProfile && providerDetails[r.providerId].providerProfile.photoURL ? (
                                <img src={providerDetails[r.providerId].providerProfile.photoURL} alt="provider" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <div style={{ color: "#6b7280", fontSize: 12 }}>No photo</div>
                              )}
                            </div>

                            <div style={{ overflow: "hidden" }}>
                              <div style={{ fontWeight: 700, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{(providerDetails[r.providerId] && (providerDetails[r.providerId].displayName || providerDetails[r.providerId].email)) || "Provider"}</div>
                              <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{(providerDetails[r.providerId] && providerDetails[r.providerId].providerProfile && providerDetails[r.providerId].providerProfile.location) || ""}</div>
                            </div>
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={() => setOpenProviderId(openProviderId === r.providerId ? null : r.providerId)}
                              style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #2563eb", background: openProviderId === r.providerId ? "#2563eb" : "white", color: openProviderId === r.providerId ? "white" : "#2563eb", cursor: "pointer", fontWeight: 700 }}
                            >
                              {openProviderId === r.providerId ? "Hide details" : "Show provider"}
                            </button>
                          </div>
                        </div>

                        {openProviderId === r.providerId && providerDetails[r.providerId] && (
                          <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, background: "#fafafa" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                              <div style={{ width: 96, height: 96, borderRadius: 8, overflow: "hidden", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {providerDetails[r.providerId].providerProfile && providerDetails[r.providerId].providerProfile.photoURL ? (
                                  <img src={providerDetails[r.providerId].providerProfile.photoURL} alt="provider photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                  <div style={{ color: "#6b7280", fontSize: 12 }}>No photo</div>
                                )}
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: 16 }}>{(providerDetails[r.providerId].displayName) || providerDetails[r.providerId].email || "Provider"}</div>
                                <div style={{ color: "#374151", marginTop: 8 }}>{(providerDetails[r.providerId].email) || ""}</div>
                                <div style={{ color: "#374151", marginTop: 8 }}>Phone: {(providerDetails[r.providerId].providerProfile && providerDetails[r.providerId].providerProfile.phone) || "N/A"}</div>
                                <div style={{ color: "#6b7280", marginTop: 6 }}>Location: {(providerDetails[r.providerId].providerProfile && providerDetails[r.providerId].providerProfile.location) || ""}</div>
                                <div style={{ color: "#374151", marginTop: 6 }}>Experience: {(providerDetails[r.providerId].providerProfile && providerDetails[r.providerId].providerProfile.experience) || ""}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
