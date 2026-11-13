import React, { useState } from "react";

export default function ClientProfileForm({ initial = {}, onSave }) {
	const [phone, setPhone] = useState(initial.phone || "");
	const [photoURL, setPhotoURL] = useState(initial.photoURL || "");
	const [saving, setSaving] = useState(false);

	const submit = async (e) => {
		e.preventDefault();
		setSaving(true);
		await onSave({ phone, photoURL });
		setSaving(false);
	};

	return (
		<form onSubmit={submit} className="profile-form auth-form">
			<label className="auth-field">
				<span className="auth-field-label">Phone</span>
				<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="auth-input" />
			</label>

			<label className="auth-field">
				<span className="auth-field-label">Photo URL</span>
				<input value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} className="auth-input" />
			</label>

			<button className="auth-submit" type="submit" disabled={saving}>
				{saving ? "Saving..." : "Save Client Profile"}
			</button>
		</form>
	);
}
