import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import ClientProfileForm from "../components/dashboard/ClientProfileForm";
import ProviderProfileForm from "../components/dashboard/ProviderProfileForm";
import DashboardLayout from "../layout/DashboardLayout";

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="profile-loading" role="status">Loading your profile...</div>
      </DashboardLayout>
    );
  }

  const roles = userDoc?.roles || { client: true, provider: false };

  return (
    <DashboardLayout>
      <div className="profile-page">
        <header className="profile-page-header">
          <div>
            <p className="section-eyebrow">Account setup</p>
            <h1>Complete your KOOLIE profile</h1>
            <p>Add the details needed to use your customer or professional account.</p>
          </div>
          <span className="profile-step">Profile details</span>
        </header>
        <div className="profile-sections">
          {roles.client && (
            <section className="profile-form-card">
              <div className="profile-section-heading">
                <span className="profile-section-icon" aria-hidden="true">⌂</span>
                <div>
                  <h2>Customer profile</h2>
                  <p>Contact details for your service requests.</p>
                </div>
              </div>
              <ClientProfileForm initial={userDoc.clientProfile} onSave={saveClient} />
            </section>
          )}

          {roles.provider && (
            <section className="profile-form-card">
              <div className="profile-section-heading">
                <span className="profile-section-icon" aria-hidden="true">⚒</span>
                <div>
                  <h2>Professional profile</h2>
                  <p>Set your trade skills and service area.</p>
                </div>
              </div>
              <ProviderProfileForm initial={userDoc.providerProfile} onSave={saveProvider} />
            </section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}