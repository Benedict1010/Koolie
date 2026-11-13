import React, { useState, useEffect } from "react";
import ChatWindow from "../chat/ChatWindow";
import { auth, db } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, getDoc, runTransaction } from "firebase/firestore";
import "../../styles/clientDashboard.css";

export default function ProviderPanel() {
  const [activeTab, setActiveTab] = useState("browse");

  const [jobs, setJobs] = useState([]);

  const [myJobs, setMyJobs] = useState([]);
  const [providerProfile, setProviderProfile] = useState(null);
  const [providerEmail, setProviderEmail] = useState("");
  const [chatRequestId, setChatRequestId] = useState(null);
  const [chatOtherUser, setChatOtherUser] = useState("");
  const [chatVisible, setChatVisible] = useState(false);

  useEffect(() => {
    let unsubSnapshot = null;
    let unsubAssigned = null;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setJobs([]);
        setMyJobs([]);
        setProviderProfile(null);
        setProviderEmail("");
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
        const profile = userSnap.exists() ? userSnap.data().providerProfile || {} : {};
        const skills = Array.isArray(profile.skills) ? profile.skills : [];
        setProviderProfile({ ...profile, skills });
        setProviderEmail(user.email || "");
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
            const filtered = items.filter((it) =>
              it.serviceType && normalizedSkills.includes(it.serviceType.toLowerCase().trim())
            );
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
    <section className="provider-panel">
      <div className="provider-overview">
        <div className="provider-overview-copy">
          <p className="section-eyebrow">Professional workspace</p>
          <h1>{providerProfile?.name || providerEmail || "Your professional dashboard"}</h1>
          <p className="dashboard-subtitle">
            {providerProfile?.skills?.length
              ? `Your selected skills: ${providerProfile.skills.join(", ")}`
              : "Add skills to your profile to find matching requests."}
          </p>
        </div>
        <div className="provider-overview-status">
          <span className={providerProfile?.available ? "provider-status-dot is-available" : "provider-status-dot"} aria-hidden="true" />
          {providerProfile?.available ? "Available" : "Not available"}
        </div>
      </div>

      <div className="provider-request-metrics" aria-label="Job summary">
        <div className="provider-metric"><span>Matching open jobs</span><strong>{jobs.length}</strong></div>
        <div className="provider-metric"><span>Assigned jobs</span><strong>{myJobs.length}</strong></div>
        <div className="provider-metric"><span>Selected skills</span><strong>{providerProfile?.skills?.length || 0}</strong></div>
      </div>

      <header className="dashboard-header dashboard-header--left">
        <div>
          <h2>Available work</h2>
          <p className="dashboard-subtitle">Browse open requests that match your selected skills.</p>
        </div>
      </header>

      <div className="dashboard-tabs" role="tablist" aria-label="Professional jobs">
        <button type="button" className={activeTab === "browse" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("browse")} role="tab" aria-selected={activeTab === "browse"}>
          Available jobs <span className="tab-count">{jobs.length}</span>
        </button>
        <button type="button" className={activeTab === "myJobs" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("myJobs")} role="tab" aria-selected={activeTab === "myJobs"}>
          My jobs <span className="tab-count">{myJobs.length}</span>
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "browse" ? (
          <section aria-label="Available jobs">
            {jobs.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon" aria-hidden="true">⌕</span>
                <h2>No open jobs for your skills</h2>
                <p>New matching requests will appear here.</p>
              </div>
            ) : (
              <div className="job-card-grid">
                {jobs.map((j) => (
                  <article key={j.id} className="job-card">
                    <div className="job-card-topline">
                      <span className="job-trade">{j.serviceType}</span>
                      <span className="status-pill status-pill--open">{j.status || "Open request"}</span>
                    </div>
                    <h2>{j.title || j.serviceType}</h2>
                    <p className="job-description">{j.description}</p>
                    <p className="job-location">
                      <span aria-hidden="true">⌖</span>
                      {typeof j.location === 'object' && j.location !== null
                        ? `${j.location.addressLine || ''}, ${j.location.area || ''}, ${j.location.city || ''}, ${j.location.state || ''} - ${j.location.pincode || ''}, ${j.location.country || ''}`
                        : (j.location || '')}
                    </p>
                    {j.price && <p className="job-price">{j.price}</p>}
                    <div className="job-card-actions">
                      <button type="button" className="button button--secondary">View</button>
                      <button type="button" className="button button--primary" onClick={() => acceptJob(j.id)}>Accept job</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section aria-label="Assigned jobs">
            {myJobs.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon" aria-hidden="true">▤</span>
                <h2>No assigned jobs yet</h2>
                <p>Accepted requests will be listed here.</p>
              </div>
            ) : (
              <div className="job-card-grid">
                {myJobs.map((m) => (
                  <article key={m.id} className="job-card">
                    <div className="job-card-topline">
                      <span className="job-trade">{m.serviceType}</span>
                      <span className={m.status === "completed" ? "status-pill status-pill--complete" : "status-pill status-pill--assigned"}>{m.status}</span>
                    </div>
                    <h2>{m.serviceType}</h2>
                    <p className="job-description">{m.description}</p>
                    <p className="job-location">
                      <span aria-hidden="true">⌖</span>
                      {typeof m.location === 'object' && m.location !== null
                        ? `${m.location.addressLine || ''}, ${m.location.area || ''}, ${m.location.city || ''}, ${m.location.state || ''} - ${m.location.pincode || ''}, ${m.location.country || ''}`
                        : (m.location || '')}
                    </p>
                    <div className="job-card-actions">
                      <button type="button" className="button button--secondary">View</button>
                      {m.status === "assigned" && (
                        <button
                          type="button"
                          className="button button--blue"
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
                  </article>
                ))}
              </div>
            )}
          </section>
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
    </section>
  );
}
