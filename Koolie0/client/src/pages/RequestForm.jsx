import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import DashboardLayout from "../layout/DashboardLayout";

// Complete JSON for India - All States & UTs
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

  const countryOptions = Object.keys(locationData);
  const stateOptions = location.country ? Object.keys(locationData[location.country]) : [];
  const cityOptions = location.country && location.state ? locationData[location.country][location.state] : [];

  const handleCountryChange = (e) => {
    setLocation({ ...location, country: e.target.value, state: '', city: '' });
  };
  const handleStateChange = (e) => {
    setLocation({ ...location, state: e.target.value, city: '' });
  };
  const handleCityChange = (e) => {
    setLocation({ ...location, city: e.target.value });
  };
  const handleAreaChange = (e) => {
    setLocation({ ...location, area: e.target.value });
  };
  const handlePincodeChange = (e) => {
    setLocation({ ...location, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) });
  };
  const handleAddressLineChange = (e) => {
    setLocation({ ...location, addressLine: e.target.value });
  };

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
      await updateDoc(doc(db, "serviceRequests", ref.id), { requestId: ref.id });
      setLoading(false);
      alert("Request created");
      navigate("/client-dashboard");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert((err && err.message) || "Failed to create request.");
    }
  };

  return (
    <DashboardLayout>
      <div className="request-page">
        <header className="request-page-header">
          <div>
            <p className="section-eyebrow">New service request</p>
            <h1>Book a service</h1>
            <p>Share the work details and location so a professional can review your request.</p>
          </div>
          <div className="request-service-chip">
            <span>Selected service</span>
            <strong>{serviceType || "(none)"}</strong>
          </div>
        </header>

        <form className="request-form" onSubmit={submit}>
          <div className="request-form-grid">
            <div className="request-form-sections">
          <section className="request-form-section">
            <div className="request-section-heading">
              <span className="request-step">1</span>
              <div>
                <h2>Service location</h2>
                <p>Enter the address where work is needed.</p>
              </div>
            </div>
            <div className="request-location-grid">
              <label className="request-field">
                <span>Country <b>*</b></span>
                <select value={location.country} onChange={handleCountryChange} required>
                  <option value="">Select country</option>
                  {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="request-field">
                <span>State <b>*</b></span>
                <select value={location.state} onChange={handleStateChange} required disabled={!location.country}>
                  <option value="">Select state</option>
                  {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="request-field">
                <span>City <b>*</b></span>
                <select value={location.city} onChange={handleCityChange} required disabled={!location.state}>
                  <option value="">Select city</option>
                  {cityOptions.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </label>
              <label className="request-field">
                <span>Area / locality</span>
                <input type="text" value={location.area} onChange={handleAreaChange} placeholder="Area or locality" />
              </label>
              <label className="request-field">
                <span>Pincode <b>*</b></span>
                <input type="number" value={location.pincode} onChange={handlePincodeChange} placeholder="6-digit pincode" required />
              </label>
              <label className="request-field request-field--wide">
                <span>Street address</span>
                <textarea value={location.addressLine} onChange={handleAddressLineChange} placeholder="Building name, flat/house number, landmark" rows={2} />
              </label>
            </div>
            {error && <div className="auth-message auth-message--error" role="alert">{error}</div>}
          </section>

          <section className="request-form-section">
            <div className="request-section-heading">
              <span className="request-step">2</span>
              <div>
                <h2>Describe the work</h2>
                <p>Include the details that will help a professional understand your request.</p>
              </div>
            </div>
            <label className="request-field">
              <span>Description <b>*</b></span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem or service needed"
                required
                rows={5}
              />
            </label>
          </section>
            </div>

            <aside className="request-process-card" aria-label="What happens next">
              <p className="section-eyebrow">What happens next</p>
              <h2>Your request, step by step</h2>
              <ol>
                <li><span>1</span><div><strong>Submit your details</strong><p>Your request is saved with the service and location you provide.</p></div></li>
                <li><span>2</span><div><strong>Matching professionals review it</strong><p>Professionals with matching skills can browse open requests.</p></div></li>
                <li><span>3</span><div><strong>Chat after assignment</strong><p>Once accepted, you can view the professional and open request-specific chat.</p></div></li>
              </ol>
            </aside>
          </div>

          <div className="request-form-actions">
            <button type="button" className="button button--secondary" onClick={() => navigate(-1)}>Cancel and return</button>
            <button type="submit" className="button button--primary" disabled={loading}>
              {loading ? "Creating..." : "Submit service request"} <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}