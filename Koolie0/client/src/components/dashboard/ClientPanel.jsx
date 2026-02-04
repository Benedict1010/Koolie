import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
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
