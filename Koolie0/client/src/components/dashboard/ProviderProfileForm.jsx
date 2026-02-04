import React, { useState, useRef, useEffect } from "react";
import { SERVICES } from "../../constants/services";

export default function ProviderProfileForm({ initial = {}, onSave }) {
	const [phone, setPhone] = useState(initial.phone || "");
	const [location, setLocation] = useState(initial.location || "");
	const [experience, setExperience] = useState(initial.experience || "");
	const [available, setAvailable] = useState(initial.available || false);
	const [photoURL, setPhotoURL] = useState(initial.photoURL || "");
	const [skillsSelected, setSkillsSelected] = useState(initial.skills || []);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const wrapperRef = useRef(null);
	const [saving, setSaving] = useState(false);

	const submit = async (e) => {
		e.preventDefault();
		setSaving(true);
		const skills = Array.isArray(skillsSelected) ? skillsSelected : [];
		await onSave({ phone, location, experience, available, photoURL, skills });
		setSaving(false);
	};

	const onSkillsChange = (e) => {
		// not used in the new custom dropdown, kept for compatibility
		const opts = Array.from(e.target.selectedOptions || []);
		const vals = opts.map((o) => o.value);
		setSkillsSelected(vals);
	};

	useEffect(() => {
		function handleClickOutside(event) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setDropdownOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const toggleSkill = (s) => {
		setSkillsSelected((prev) => {
			if (prev.includes(s)) return prev.filter((x) => x !== s);
			return [...prev, s];
		});
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

			<div style={{ marginBottom: 12 }} ref={wrapperRef}>
				<label style={{ display: "block", marginBottom: 6 }}>Skills</label>

				<button
					type="button"
					onClick={() => setDropdownOpen((o) => !o)}
					aria-expanded={dropdownOpen}
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						padding: "8px 12px",
						borderRadius: 8,
						border: "1px solid #e5e7eb",
						background: "white",
						width: "100%",
						justifyContent: "space-between",
						cursor: "pointer",
					}}
				>
					<div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", maxWidth: "80%" }}>
						{skillsSelected && skillsSelected.length > 0 ? (
							skillsSelected.map((s) => (
								<span
									key={s}
									style={{ background: "#eef2ff", color: "#0f172a", padding: "4px 8px", borderRadius: 999, fontSize: 13 }}
								>
									{s}
								</span>
							))
						) : (
							<span style={{ color: "#6b7280" }}>Select skills</span>
						)}
					</div>

					<div style={{ marginLeft: "auto", color: "#374151" }}>{dropdownOpen ? "▲" : "▼"}</div>
				</button>

				{dropdownOpen && (
					<div
						role="menu"
						style={{
							position: "absolute",
							background: "white",
							border: "1px solid #e5e7eb",
							marginTop: 8,
							borderRadius: 8,
							boxShadow: "0 6px 20px rgba(2,6,23,0.08)",
							zIndex: 40,
							maxHeight: 220,
							overflow: "auto",
							width: 360,
						}}
					>
						{SERVICES.map((s) => (
							<label
								key={s}
								style={{
									display: "flex",
									alignItems: "center",
									gap: 8,
									padding: "8px 12px",
									cursor: "pointer",
								}}
							>
								<input type="checkbox" checked={skillsSelected.includes(s)} onChange={() => toggleSkill(s)} />
								<span style={{ marginLeft: 6 }}>{s}</span>
							</label>
						))}
					</div>
				)}
			</div>

			<button className="auth-submit" type="submit" disabled={saving}>
				{saving ? "Saving..." : "Save Provider Profile"}
			</button>
		</form>
	);
}
