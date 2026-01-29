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
		<form onSubmit={submit} style={{ maxWidth: 520 }}>
			<div style={{ marginBottom: 12 }}>
				<label>Phone</label>
				<input value={phone} onChange={(e) => setPhone(e.target.value)} className="auth-input" />
			</div>

			<div style={{ marginBottom: 12 }}>
				<label>Photo URL</label>
				<input value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} className="auth-input" />
			</div>

			<button className="auth-submit" type="submit" disabled={saving}>
				{saving ? "Saving..." : "Save Client Profile"}
			</button>
		</form>
	);
}
