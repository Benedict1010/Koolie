import React, { useState, useRef, useEffect } from "react";
import { SERVICES } from "../../constants/services";

export default function ProviderProfileForm({ initial = {}, onSave }) {
	const [phone, setPhone] = useState(initial.phone || "");

	// digits only, max 10
	const handlePhoneChange = (e) => {
		const val = e.target.value.replace(/\D/g, '').slice(0, 10);
		setPhone(val);
	};
	const locationData = {
  India: {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
    "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"],
    "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup Metropolitan", "Kamrup", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Dima Hasao", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
    "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
    "Chhattisgarh": ["Balarampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
    "Goa": ["North Goa", "South Goa"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kutch", "Kheda", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
    "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
    "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
    "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
    "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
    "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
    "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
    "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
    "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Baudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghapur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Sonepur", "Sundargarh"],
    "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Shahid Bhagat Singh Nagar", "Sri Muktsar Sahib", "Tarn Taran"],
    "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
    "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
    "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
    "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal", "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
    "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Prayagraj", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
    "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
    "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
    "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
    "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
    "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
    "Ladakh": ["Kargil", "Leh"],
    "Lakshadweep": ["Lakshadweep"],
    "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
  },
  

		
	};

	const [location, setLocation] = useState(
		initial.location || {
			country: '',
			state: '',
			district: '',
			area: '',
			pincode: '',
		}
	);
	const [experience, setExperience] = useState(initial.experience || "");
	const [available, setAvailable] = useState(initial.available || false);
	const [photoURL, setPhotoURL] = useState(initial.photoURL || "");
	const [skillsSelected, setSkillsSelected] = useState(initial.skills || []);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const wrapperRef = useRef(null);
	const [saving, setSaving] = useState(false);

	const countryOptions = Object.keys(locationData);
	const stateOptions = location.country ? Object.keys(locationData[location.country]) : [];
	const districtOptions = location.country && location.state ? locationData[location.country][location.state] : [];

	const handleCountryChange = (e) => {
		setLocation({ ...location, country: e.target.value, state: '', district: '' });
	};
	const handleStateChange = (e) => {
		setLocation({ ...location, state: e.target.value, district: '' });
	};
	const handleDistrictChange = (e) => {
		setLocation({ ...location, district: e.target.value });
	};
	const handleAreaChange = (e) => {
		setLocation({ ...location, area: e.target.value });
	};
	const handlePincodeChange = (e) => {
		// allow only digits and limit to 6 characters
		const val = e.target.value.replace(/\D/g, '').slice(0, 6);
		setLocation({ ...location, pincode: val });
	};

	const submit = async (e) => {
		e.preventDefault();
		// enforce 10-digit phone if provided
		if (phone && phone.length !== 10) {
			alert("Phone number must be exactly 10 digits");
			return;
		}
		// enforce 6-digit pincode
		if (!location.pincode || location.pincode.length !== 6) {
			alert("Pincode must be exactly 6 digits");
			return;
		}
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
		<form onSubmit={submit} className="auth-form" style={{ maxWidth: 520, margin: "0 auto" }}>
			<div style={{ marginBottom: 12 }}>
				<label>Phone</label>
				<input
					type="tel"
					value={phone}
					onChange={handlePhoneChange}
					className="auth-input"
					maxLength={10}
					pattern="\d{10}"
				/>
			</div>

			<div style={{ marginBottom: 12 }}>
				<label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Location</label>
				<div style={{ display: 'grid', gap: 8 }}>
					<select value={location.country} onChange={handleCountryChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', background: "#334155", color: "white" }}>
						<option value="">Select Country</option>
						{countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
					</select>
					<select value={location.state} onChange={handleStateChange} required disabled={!location.country} style={{ width: "100%", padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', background: "#334155", color: "white" }}>
						<option value="">Select State</option>
						{stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
					</select>
					<select value={location.district} onChange={handleDistrictChange} required disabled={!location.state} style={{ width: "100%", padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', background: "#334155", color: "white" }}>
						<option value="">Select District</option>
						{districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
					</select>
					<input type="text" value={location.area} onChange={handleAreaChange} placeholder="Area" style={{ width: "100%", padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', background: "#334155", color: "white" }} />
					<input
					type="text"
					value={location.pincode}
					onChange={handlePincodeChange}
					placeholder="Pincode"
					required
					maxLength={6}
					pattern="\d{6}"
					style={{ padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', background: "#334155", color: "white" }}
				/>
				</div>
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
