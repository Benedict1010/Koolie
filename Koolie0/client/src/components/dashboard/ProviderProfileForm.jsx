import React, { useState } from "react";

export default function ProviderProfileForm({ initial = {}, onSave }) {
	const [phone, setPhone] = useState(initial.phone || "");
	const [location, setLocation] = useState(initial.location || "");
	const [experience, setExperience] = useState(initial.experience || "");
	const [available, setAvailable] = useState(initial.available || false);
	const [photoURL, setPhotoURL] = useState(initial.photoURL || "");
	const [skillsText, setSkillsText] = useState((initial.skills || []).join(", "));
	const [saving, setSaving] = useState(false);

	const submit = async (e) => {
		e.preventDefault();
		setSaving(true);
		const skills = skillsText
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
		await onSave({ phone, location, experience, available, photoURL, skills });
		setSaving(false);
	};

	return (
		<form onSubmit={submit} style={{ maxWidth: 520 }}>
			<div style={{ marginBottom: 12 }}>
				<label>Phone</label>
				<input value={phone} onChange={(e) => setPhone(e.target.value)} className="auth-input" />
			</div>

			<div style={{ marginBottom: 12 }}>
				<label>Location</label>
				<input value={location} onChange={(e) => setLocation(e.target.value)} className="auth-input" />
			</div>

			<div style={{ marginBottom: 12 }}>
				<label>Experience (years or text)</label>
				<input value={experience} onChange={(e) => setExperience(e.target.value)} className="auth-input" />
			</div>

			<div style={{ marginBottom: 12 }}>
				<label>
					<input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} /> Available
				</label>
			</div>

			<div style={{ marginBottom: 12 }}>
				<label>Photo URL</label>
				<input value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} className="auth-input" />
			</div>

			<div style={{ marginBottom: 12 }}>
				<label>Skills (comma separated)</label>
				<input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} className="auth-input" />
			</div>

			<button className="auth-submit" type="submit" disabled={saving}>
				{saving ? "Saving..." : "Save Provider Profile"}
			</button>
		</form>
	);
}
