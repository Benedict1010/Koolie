import React, { useState, useEffect } from "react";
import ChatWindow from "../chat/ChatWindow";
import { auth, db } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc, runTransaction } from "firebase/firestore";

export default function ProviderPanel() {
  const [activeTab, setActiveTab] = useState("browse");

  const [jobs, setJobs] = useState([]);
  const [providerSkills, setProviderSkills] = useState([]);

  const [myJobs, setMyJobs] = useState([]);
  const [chatRequestId, setChatRequestId] = useState(null);
  const [chatOtherUser, setChatOtherUser] = useState("");
  const [chatVisible, setChatVisible] = useState(false);

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
        // Get provider district
        const providerDistrict = userSnap.exists() && userSnap.data().providerProfile && userSnap.data().providerProfile.district ? userSnap.data().providerProfile.district.toLowerCase().trim() : "";

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

            // Normalize skills and serviceType for robust matching
            const normalizedSkills = skills.map(s => s.toLowerCase().trim());
            const filtered = items.filter((it) => {
              // Skill match
              const skillMatch = it.serviceType && normalizedSkills.includes(it.serviceType.toLowerCase().trim());
              // District-city match
                let locationMatch = false;
                if (it.location && typeof it.location === 'object') {
                  const city = it.location.city ? it.location.city.toLowerCase().trim() : "";
                  const district = it.location.district ? it.location.district.toLowerCase().trim() : "";
                  locationMatch = providerDistrict && (providerDistrict === city || providerDistrict === district);
                } else {
                  const city = it.city ? it.city.toLowerCase().trim() : "";
                  const district = it.district ? it.district.toLowerCase().trim() : "";
                  locationMatch = providerDistrict && (providerDistrict === city || providerDistrict === district);
                }
                return skillMatch && locationMatch;
            });
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
      const ref = doc(db, "serviceRequests", id);
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error("Request not found");
        const data = snap.data();
        if (data.status && data.status !== "open") {
          throw new Error("Request is no longer open");
        }
        tx.update(ref, { providerId: user.uid, status: "assigned" });
      });
      alert("Job accepted successfully.");
    } catch (err) {
      console.error("Failed to accept job:", err);
      // Detect permission errors and give actionable feedback
      const msg = (err && err.message) || "Failed to accept job. See console.";
      if (msg.toLowerCase().includes("permission") || msg.toLowerCase().includes("insufficient")) {
        alert("Missing or insufficient permissions. Check Firestore rules to allow providers to accept jobs.");
      } else if (msg === "Request is no longer open") {
        alert("This request was already accepted or closed by someone else.");
      } else {
        alert(msg);
      }
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
                      <div style={{ marginTop: 8, color: "#6b7280", fontSize: 13 }}>
                        Location: {typeof j.location === 'object' && j.location !== null ?
                          `${j.location.addressLine || ''}, ${j.location.area || ''}, ${j.location.city || ''}, ${j.location.state || ''} - ${j.location.pincode || ''}, ${j.location.country || ''}`
                            : (j.location || '')}
                      </div>
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
                      <div style={{ marginTop: 8, color: "#6b7280", fontSize: 13 }}>
                        Location: {typeof m.location === 'object' && m.location !== null ?
                          `${m.location.addressLine || ''}, ${m.location.area || ''}, ${m.location.city || ''}, ${m.location.state || ''} - ${m.location.pincode || ''}, ${m.location.country || ''}`
                            : (m.location || '')}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ fontWeight: 700, color: m.status === "completed" ? "#059669" : "#f59e0b" }}>{m.status}</div>
                      <button type="button" style={{ marginTop: 8, padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>View</button>
                      {m.status === "assigned" && (
                        <button
                          type="button"
                          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #059669", background: "#059669", color: "white", cursor: "pointer", fontWeight: 700 }}
                          onClick={() => {
                            setChatRequestId(m.id);
                            setChatOtherUser(m.clientName || m.clientEmail || "Client");
                            setChatVisible(true);
                          }}
                        >
                          Chat
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    {chatVisible && (
      <ChatWindow
        requestId={chatRequestId}
        currentUserId={auth.currentUser?.uid || "provider1"}
        otherUserName={chatOtherUser}
        onClose={() => setChatVisible(false)}
      />
    )}
  </div>
  );
}
