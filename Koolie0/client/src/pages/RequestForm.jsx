import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";

export default function RequestForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const serviceType = state?.service || "";

  const [description, setDescription] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!serviceType) return alert("Please choose a service first.");
    setLoading(true);

    try {
      const clientId = auth.currentUser ? auth.currentUser.uid : "";
      const ref = await addDoc(collection(db, "serviceRequests"), {
        clientId,
        createdAt: serverTimestamp(),
        description,
        location: locationInput,
        providerId: "",
        requestId: "",
        serviceType,
        status: "open",
      });

      // store generated id as requestId
      await updateDoc(doc(db, "serviceRequests", ref.id), { requestId: ref.id });

      setLoading(false);
      alert("Request created");
      navigate("/client-dashboard");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert((err && err.message) || "Failed to create request. Check console.");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h3>Create Service Request</h3>
      <p style={{ color: "#6b7280" }}>Service: <strong>{serviceType || "(none)"}</strong></p>

      <form onSubmit={submit} style={{ marginTop: 12, maxWidth: 640 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Location</label>
          <input
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Address or brief location"
            required
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e5e7eb" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem (required)"
            required
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e5e7eb", minHeight: 120 }}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Request"}
          </button>

          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
