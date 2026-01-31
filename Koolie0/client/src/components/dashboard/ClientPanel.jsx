import React, { useState } from "react";

export default function ClientPanel() {
  const [activeTab, setActiveTab] = useState("request");
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    "Electrician",
    "Plumber",
    "Carpenter",
    "AC Repair",
    "Painter",
    "Cleaning",
  ];

  const tabBtnStyle = (active) => ({
    padding: "8px 14px",
    borderRadius: 6,
    border: active ? "2px solid #2563eb" : "1px solid #e5e7eb",
    background: active ? "#eef2ff" : "white",
    cursor: "pointer",
    fontWeight: 600,
  });

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
                  onClick={() => setSelectedService(s)}
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
            <p style={{ color: "#6b7280" }}>You have no requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
