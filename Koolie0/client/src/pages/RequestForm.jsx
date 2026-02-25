import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";

// Static JSON for country/state/city
const locationData = {
  India: {
    Karnataka: ["Bangalore", "Mysore", "Hubli"],
    Kerala: ["Kochi", "Trivandrum", "Calicut"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  },
  USA: {
    California: ["Los Angeles", "San Francisco", "San Diego"],
    Texas: ["Houston", "Dallas", "Austin"],
    NewYork: ["New York City", "Buffalo", "Albany"],
  },
};

export default function RequestForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const serviceType = state?.service || "";

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({
    country: '',
    state: '',
    city: '',
    area: '',
    pincode: '',
    addressLine: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dropdown options
  const countryOptions = Object.keys(locationData);
  const stateOptions = location.country ? Object.keys(locationData[location.country]) : [];
  const cityOptions = location.country && location.state ? locationData[location.country][location.state] : [];

  // Cascading logic
  const handleCountryChange = (e) => {
    setLocation({
      ...location,
      country: e.target.value,
      state: '',
      city: '',
    });
  };
  const handleStateChange = (e) => {
    setLocation({
      ...location,
      state: e.target.value,
      city: '',
    });
  };
  const handleCityChange = (e) => {
    setLocation({
      ...location,
      city: e.target.value,
    });
  };
  const handleAreaChange = (e) => {
    setLocation({
      ...location,
      area: e.target.value,
    });
  };
  const handlePincodeChange = (e) => {
    setLocation({
      ...location,
      pincode: e.target.value.replace(/\D/g, ''),
    });
  };
  const handleAddressLineChange = (e) => {
    setLocation({
      ...location,
      addressLine: e.target.value,
    });
  };

  // Validation
  const validate = () => {
    if (!location.country || !location.state || !location.city || !location.pincode) {
      setError('Country, State, City, and Pincode are required.');
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!serviceType) return alert("Please choose a service first.");
    if (!validate()) return;
    setLoading(true);
    try {
      const clientId = auth.currentUser ? auth.currentUser.uid : "";
      const ref = await addDoc(collection(db, "serviceRequests"), {
        clientId,
        createdAt: serverTimestamp(),
        description,
        location,
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
          <div style={{ display: 'grid', gap: 8 }}>
            <select value={location.country} onChange={handleCountryChange} required style={{ padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }}>
              <option value="">Select Country</option>
              {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={location.state} onChange={handleStateChange} required disabled={!location.country} style={{ padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }}>
              <option value="">Select State</option>
              {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={location.city} onChange={handleCityChange} required disabled={!location.state} style={{ padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }}>
              <option value="">Select City</option>
              {cityOptions.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
            <input type="text" value={location.area} onChange={handleAreaChange} placeholder="Area" style={{ padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            <input type="number" value={location.pincode} onChange={handlePincodeChange} placeholder="Pincode" required style={{ padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            <textarea value={location.addressLine} onChange={handleAddressLineChange} placeholder="Address Line" rows={2} style={{ padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
          </div>
          {error && <div style={{ color: 'red', marginTop: 6 }}>{error}</div>}
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
