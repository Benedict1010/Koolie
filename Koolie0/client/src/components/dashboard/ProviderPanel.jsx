import React, { useState, useEffect } from "react";
import { auth, db } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProviderPanel() {
  const [activeTab, setActiveTab] = useState("browse");

  const [jobs, setJobs] = useState([]);
  const [providerSkills, setProviderSkills] = useState([]);

  const [myJobs, setMyJobs] = useState([]);

  const tabBtn = (active) => ({
    padding: "8px 14px",
    borderRadius: 6,
    border: active ? "2px solid #2563eb" : "1px solid #e5e7eb",
    background: active ? "#eef2ff" : "white",
    cursor: "pointer",
    fontWeight: 600,
  });

  useEffect(() => {
    let unsubSnapshot = null;
    let unsubAssigned = null;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setJobs([]);
        setProviderSkills([]);
        if (unsubSnapshot) {
          unsubSnapshot();
          unsubSnapshot = null;
        }
        if (unsubAssigned) {
          unsubAssigned();
          unsubAssigned = null;
        }
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const skills = (userSnap.exists() && userSnap.data().providerProfile && Array.isArray(userSnap.data().providerProfile.skills)) ? userSnap.data().providerProfile.skills : [];
        setProviderSkills(skills);

        const q = query(collection(db, "serviceRequests"), where("status", "==", "open"));

        if (unsubSnapshot) unsubSnapshot();
        unsubSnapshot = onSnapshot(
          q,
          (snap) => {
            const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

            // sort by createdAt desc (handle missing timestamps)
            items.sort((a, b) => {
              const ta = a.createdAt && typeof a.createdAt.toMillis === "function" ? a.createdAt.toMillis() : (a.createdAt && a.createdAt.seconds ? a.createdAt.seconds * 1000 : 0);
              const tb = b.createdAt && typeof b.createdAt.toMillis === "function" ? b.createdAt.toMillis() : (b.createdAt && b.createdAt.seconds ? b.createdAt.seconds * 1000 : 0);
              return tb - ta;
            });

            const filtered = items.filter((it) => skills.includes(it.serviceType));
            setJobs(filtered);
          },
          (err) => {
            console.error("serviceRequests listener error:", err);
          }
        );
      } catch (err) {
        console.error("Failed to load provider skills or jobs:", err);
      }
          // subscribe to requests assigned to this provider (my jobs)
          const qAssigned = query(collection(db, "serviceRequests"), where("providerId", "==", user.uid));
          if (unsubAssigned) unsubAssigned();
          unsubAssigned = onSnapshot(
            qAssigned,
            (snap) => {
              const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
              // sort assigned jobs by createdAt desc
              items.sort((a, b) => {
                const ta = a.createdAt && typeof a.createdAt.toMillis === "function" ? a.createdAt.toMillis() : (a.createdAt && a.createdAt.seconds ? a.createdAt.seconds * 1000 : 0);
                const tb = b.createdAt && typeof b.createdAt.toMillis === "function" ? b.createdAt.toMillis() : (b.createdAt && b.createdAt.seconds ? b.createdAt.seconds * 1000 : 0);
                return tb - ta;
              });
              setMyJobs(items);
            },
            (err) => {
              console.error("assigned jobs listener error:", err);
            }
          );
    });

    return () => {
      unsubAuth();
      if (unsubSnapshot) unsubSnapshot();
      if (unsubAssigned) unsubAssigned();
    };
  }, []);
  const acceptJob = async (id) => {
    const user = auth.currentUser;
    if (!user) return alert("Please sign in to accept jobs.");

    try {
      await updateDoc(doc(db, "serviceRequests", id), {
        providerId: user.uid,
        status: "assigned",
      });
    } catch (err) {
      console.error("Failed to accept job:", err);
      alert((err && err.message) || "Failed to accept job. See console.");
    }
  };

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
              {jobs.length === 0 ? (
                <div style={{ color: "#6b7280" }}>No open jobs available for your skills.</div>
              ) : (
                jobs.map((j) => (
                  <div key={j.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, background: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{j.title || j.serviceType} <span style={{ fontWeight: 600, color: "#6b7280", fontSize: 13 }}>· {j.serviceType}</span></div>
                      <div style={{ marginTop: 6, color: "#374151" }}>{j.description}</div>
                      <div style={{ marginTop: 8, color: "#6b7280", fontSize: 13 }}>Location: {j.location}</div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <div style={{ fontWeight: 700 }}>{j.price || ""}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button type="button" style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>View</button>
                        <button type="button" onClick={() => acceptJob(j.id)} style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: "#2563eb", color: "white", cursor: "pointer" }}>Accept</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
                      <div style={{ fontWeight: 700 }}>{m.serviceType} <span style={{ fontWeight: 600, color: "#6b7280", fontSize: 13 }}>· {m.serviceType}</span></div>
                      <div style={{ marginTop: 8, color: "#374151" }}>{m.description}</div>
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
