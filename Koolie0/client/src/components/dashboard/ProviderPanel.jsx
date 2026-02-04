import React, { useState } from "react";

export default function ProviderPanel() {
  const [activeTab, setActiveTab] = useState("browse");

  const sampleJobs = [
    {
      id: "j1",
      title: "Fix kitchen sink",
      service: "Plumber",
      location: "Sector 12, Near Park",
      price: "₹800",
      description: "Leak from pipe under sink, needs replacement",
    },
    {
      id: "j2",
      title: "AC not cooling",
      service: "AC Repair",
      location: "MG Road",
      price: "₹1200",
      description: "Compressor humming but not cooling",
    },
    {
      id: "j3",
      title: "Wall paint touchups",
      service: "Painter",
      location: "Lakeview",
      price: "₹500",
      description: "Small patches and touchups required",
    },
  ];

  const myJobs = [
    {
      id: "m1",
      title: "Wardrobe fix",
      service: "Carpenter",
      location: "Sector 3",
      status: "in-progress",
    },
  ];

  const tabBtn = (active) => ({
    padding: "8px 14px",
    borderRadius: 6,
    border: active ? "2px solid #2563eb" : "1px solid #e5e7eb",
    background: active ? "#eef2ff" : "white",
    cursor: "pointer",
    fontWeight: 600,
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Provider Panel</h3>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button type="button" onClick={() => setActiveTab("browse")} style={tabBtn(activeTab === "browse")}>BROWSE JOBS</button>
        <button type="button" onClick={() => setActiveTab("myJobs")} style={tabBtn(activeTab === "myJobs")}>MY JOBS</button>
      </div>

      <div style={{ marginTop: 16 }}>
        {activeTab === "browse" ? (
          <div>
            <h4 style={{ marginBottom: 12 }}>Available Jobs</h4>
            <div style={{ display: "grid", gap: 12 }}>
              {sampleJobs.map((j) => (
                <div key={j.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, background: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{j.title} <span style={{ fontWeight: 600, color: "#6b7280", fontSize: 13 }}>· {j.service}</span></div>
                    <div style={{ marginTop: 6, color: "#374151" }}>{j.description}</div>
                    <div style={{ marginTop: 8, color: "#6b7280", fontSize: 13 }}>Location: {j.location}</div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <div style={{ fontWeight: 700 }}>{j.price}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>View</button>
                      <button type="button" style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: "#2563eb", color: "white", cursor: "pointer" }}>Accept</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h4 style={{ marginBottom: 8 }}>My Jobs</h4>
            {myJobs.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No active jobs yet.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {myJobs.map((m) => (
                  <div key={m.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, background: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{m.title} <span style={{ fontWeight: 600, color: "#6b7280", fontSize: 13 }}>· {m.service}</span></div>
                      <div style={{ marginTop: 8, color: "#6b7280", fontSize: 13 }}>Location: {m.location}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, color: m.status === "completed" ? "#059669" : "#f59e0b" }}>{m.status}</div>
                      <button type="button" style={{ marginTop: 8, padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>View</button>
                    </div>
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
