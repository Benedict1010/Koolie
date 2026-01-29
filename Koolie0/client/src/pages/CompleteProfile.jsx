import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import ClientProfileForm from "../components/dashboard/ClientProfileForm";
import ProviderProfileForm from "../components/dashboard/ProviderProfileForm";

export default function CompleteProfile() {
  const [loading, setLoading] = useState(true);
  const [userDoc, setUserDoc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const current = auth.currentUser;
      if (!current) {
        navigate("/login");
        return;
      }

      const ref = doc(db, "users", current.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        // create minimal doc and show forms
        setUserDoc({ roles: { client: true, provider: false }, profileCompleted: false });
        setLoading(false);
        return;
      }

      setUserDoc({ id: snap.id, ...snap.data() });
      setLoading(false);
    };

    run();
  }, [navigate]);

  const saveClient = async (profile) => {
    const uid = auth.currentUser.uid;
    const ref = doc(db, "users", uid);
    try {
      await updateDoc(ref, {
        clientProfile: profile,
        profileCompleted: true,
        updatedAt: serverTimestamp(),
      });
      navigate("/role-dashboard");
    } catch (err) {
      console.error("Failed to save client profile:", err);
      alert((err && err.message) || "Failed to save profile. Check Firestore rules.");
    }
  };

  const saveProvider = async (profile) => {
    const uid = auth.currentUser.uid;
    const ref = doc(db, "users", uid);
    try {
      await updateDoc(ref, {
        providerProfile: profile,
        profileCompleted: true,
        updatedAt: serverTimestamp(),
      });
      navigate("/role-dashboard");
    } catch (err) {
      console.error("Failed to save provider profile:", err);
      alert((err && err.message) || "Failed to save profile. Check Firestore rules.");
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  const roles = userDoc?.roles || { client: true, provider: false };

  return (
    <div style={{ padding: 24 }}>
      <h2>Complete Your Profile</h2>
      <div style={{ marginTop: 16 }}>
        {roles.client && <ClientProfileForm initial={userDoc.clientProfile} onSave={saveClient} />}

        {roles.provider && <ProviderProfileForm initial={userDoc.providerProfile} onSave={saveProvider} />}
      </div>
    </div>
  );
}