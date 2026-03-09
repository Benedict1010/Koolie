import React, { useState, useEffect } from "react";
import ChatWindow from "../chat/ChatWindow";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebase";
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { SERVICES } from "../../constants/services";
// Static JSON for country/state/city
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
  }
};
  

export default function ClientPanel() {
  const [activeTab, setActiveTab] = useState("request");
  const [selectedService, setSelectedService] = useState(null);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  // services list moved to shared constant
  const services = SERVICES;

  // lookup for service image – files live in public/ and are served from root
  const serviceImages = {
    "Electrician": "/electrician.jpeg",
    "Plumber": "/plumber.jpeg",
    "Carpenter": "/carpenter.jpeg",
    "AC Repair": "/ac mechanic.jpeg",
    "Painter": "/painter.jpeg",
    "Cleaning": "/cleaner.jpeg",
    // doodle is not part of SERVICES but available if needed elsewhere
    "Doodle": "/doodle.png",
  };

  const tabBtnStyle = (active) => ({
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    background: active ? "#FFD700" : "white",
    cursor: "pointer",
    fontWeight: 700,
    color: active ? "#2563eb" : "#6b7280",
    fontSize: 14,
  });

  useEffect(() => {
    let unsubSnapshot = null;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      console.debug("ClientPanel onAuthStateChanged user:", user && user.uid);
      if (!user) {
        console.debug("No authenticated user - clearing requests list");
        setRequests([]);
        if (unsubSnapshot) {
          unsubSnapshot();
          unsubSnapshot = null;
        }
        return;
      }

      const q = query(collection(db, "serviceRequests"), where("clientId", "==", user.uid));

      unsubSnapshot = onSnapshot(
        q,
        (snap) => {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          console.debug("serviceRequests snapshot count:", items.length, "for user", user.uid, items);
          // sort by createdAt descending (handle missing or serverTimestamp placeholders)
          items.sort((a, b) => {
            const ta = a.createdAt && typeof a.createdAt.toMillis === "function" ? a.createdAt.toMillis() : (a.createdAt && a.createdAt.seconds ? a.createdAt.seconds * 1000 : 0);
            const tb = b.createdAt && typeof b.createdAt.toMillis === "function" ? b.createdAt.toMillis() : (b.createdAt && b.createdAt.seconds ? b.createdAt.seconds * 1000 : 0);
            return tb - ta;
          });
          setRequests(items);
        },
        (err) => {
          console.error("serviceRequests listener error:", err);
        }
      );
    });

    return () => {
      unsubAuth();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, []);

  // fetch provider user docs for any assigned requests so client can see provider details
  const [providerDetails, setProviderDetails] = useState({});
  const [openProviderId, setOpenProviderId] = useState(null);
  const [chatRequestId, setChatRequestId] = useState(null);
  const [chatOtherUser, setChatOtherUser] = useState("");
  const [chatVisible, setChatVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    const ids = Array.from(new Set(requests.filter((r) => r.providerId).map((r) => r.providerId)));
    if (ids.length === 0) {
      if (mounted) setProviderDetails({});
      return () => (mounted = false);
    }

    const fetchProviders = async () => {
      try {
        const map = {};
        await Promise.all(
          ids.map(async (pid) => {
            try {
              const snap = await getDoc(doc(db, "users", pid));
              if (snap.exists()) map[pid] = { id: snap.id, ...(snap.data() || {}) };
            } catch (e) {
              console.error("Failed to fetch provider doc", pid, e);
            }
          })
        );
        if (mounted) setProviderDetails(map);
      } catch (err) {
        console.error("Failed to load provider details:", err);
      }
    };

    fetchProviders();
    return () => {
      mounted = false;
    };
  }, [requests]);

  return (
    <div style={{ background: "#fff", minHeight: "100vh", padding: "32px 0" }}>
      <h3 style={{ color: "#003DA5", fontWeight: 700, marginBottom: 24 }}>Client Panel</h3>

      <div style={{ display: "flex", gap: 32, marginTop: 8, justifyContent: "center" }}>
        <button
          type="button"
          onClick={() => setActiveTab("request")}
          style={tabBtnStyle(activeTab === "request")}
        >
          REQUEST A SERVICE
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("myRequests")}
          style={tabBtnStyle(activeTab === "myRequests")}
        >
          MY REQUESTS
        </button>
      </div>

      <div style={{ marginTop: 24, maxWidth: 1100, marginLeft: "auto", marginRight: "auto" }}>
        {activeTab === "request" ? (
          <div>
            <h4 style={{ marginBottom: 18, color: "#003DA5", fontWeight: 700 }}>STEP 1: SERVICE SELECTION</h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 24,
                justifyContent: "center",
              }}
            >
              {services.map((s, idx) => (
                <div
                  key={s}
                  onClick={() => {
                    setSelectedService(s);
                    navigate("/request", { state: { service: s } });
                  }}
                  role="button"
                  tabIndex={0}
                  style={{
                    border:
                      selectedService === s ? "2px solid #2563eb" : "1px solid #e5e7eb",
                    borderRadius: 16,
                    padding: "10px 200px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 200,
                    background: "white",
                  }}
                >
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 12,
                      background: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />

                  <div style={{ fontWeight: 600, color: "#2563eb" }}>{s}</div>
                </div>
              ))}
            </div>

            {selectedService && (
              <div style={{ marginTop: 18, color: "#003DA5" }}>
                Selected service: <strong>{selectedService}</strong>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h4 style={{ marginBottom: 8, color: "#003DA5", fontWeight: 700 }}>My Requests</h4>
            {requests.length === 0 ? (
              <p style={{ color: "#6b7280" }}>You have no requests yet.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {requests.map((r) => (
                  <div
                    key={r.requestId || r.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      padding: 12,
                      background: "white",
                      boxShadow: "0 1px 4px rgba(16,24,40,0.05)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 700 }}>{r.serviceType}</div>
                      <div style={{ color: r.status === "open" ? "#059669" : "#6b7280", fontWeight: 700 }}>{r.status}</div>
                    </div>

                    <div style={{ marginTop: 8, color: "#374151" }}>{r.description}</div>
                    <div style={{ marginTop: 8, color: "#6b7280", fontSize: 13 }}>
                      Location: {(() => {
                        if (!r.location) return "";
                        if (typeof r.location === "string") return r.location;
                        if (typeof r.location === "object") {
                          // Try to format known keys
                          const {
                            addressLine = "",
                            area = "",
                            city = "",
                            state = "",
                            country = "",
                            pincode = "",
                          } = r.location;
                          const parts = [addressLine, area, city, state, country].filter(Boolean);
                          let locStr = parts.join(", ");
                          if (pincode) locStr += ` - ${pincode}`;
                          // If all are empty, fallback to JSON
                          if (!locStr.trim()) return JSON.stringify(r.location);
                          return locStr;
                        }
                        // Fallback for unexpected types
                        return String(r.location);
                      })()}
                    </div>
                    {r.status === "assigned" && r.providerId && (
                      <div style={{ marginTop: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                          <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 6, overflow: "hidden", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {providerDetails[r.providerId] && providerDetails[r.providerId].providerProfile && providerDetails[r.providerId].providerProfile.photoURL ? (
                                <img src={providerDetails[r.providerId].providerProfile.photoURL} alt="provider" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <div style={{ color: "#6b7280", fontSize: 12 }}>No photo</div>
                              )}
                            </div>

                            <div style={{ overflow: "hidden" }}>
                              <div style={{ fontWeight: 700, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{(providerDetails[r.providerId] && (providerDetails[r.providerId].displayName || providerDetails[r.providerId].email)) || "Provider"}</div>
                              <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>
                                {(() => {
                                  const loc = providerDetails[r.providerId] && providerDetails[r.providerId].providerProfile && providerDetails[r.providerId].providerProfile.location;
                                  if (!loc) return "";
                                  if (typeof loc === "string") return loc;
                                  if (typeof loc === "object") {
                                    const {
                                      addressLine = "",
                                      area = "",
                                      city = "",
                                      state = "",
                                      country = "",
                                      pincode = "",
                                    } = loc;
                                    const parts = [addressLine, area, city, state, country].filter(Boolean);
                                    let locStr = parts.join(", ");
                                    if (pincode) locStr += ` - ${pincode}`;
                                    if (!locStr.trim()) return JSON.stringify(loc);
                                    return locStr;
                                  }
                                  return String(loc);
                                })()}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <button
                              type="button"
                              onClick={() => setOpenProviderId(openProviderId === r.providerId ? null : r.providerId)}
                              style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #2563eb", background: openProviderId === r.providerId ? "#2563eb" : "white", color: openProviderId === r.providerId ? "white" : "#2563eb", cursor: "pointer", fontWeight: 700, marginBottom: 4 }}
                            >
                              {openProviderId === r.providerId ? "Hide details" : "Show provider"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setChatRequestId(r.id);
                                setChatOtherUser((providerDetails[r.providerId] && (providerDetails[r.providerId].displayName || providerDetails[r.providerId].email)) || "Provider");
                                setChatVisible(true);
                              }}
                              style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #059669", background: "#059669", color: "white", cursor: "pointer", fontWeight: 700 }}
                            >
                              Chat
                            </button>
                          </div>
                        </div>

                        {openProviderId === r.providerId && providerDetails[r.providerId] && (
                          <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, background: "#fafafa" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                              <div style={{ width: 96, height: 96, borderRadius: 8, overflow: "hidden", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {providerDetails[r.providerId].providerProfile && providerDetails[r.providerId].providerProfile.photoURL ? (
                                  <img src={providerDetails[r.providerId].providerProfile.photoURL} alt="provider photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                  <div style={{ color: "#6b7280", fontSize: 12 }}>No photo</div>
                                )}
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: 16 }}>{(providerDetails[r.providerId].displayName) || providerDetails[r.providerId].email || "Provider"}</div>
                                <div style={{ color: "#374151", marginTop: 8 }}>{(providerDetails[r.providerId].email) || ""}</div>
                                <div style={{ color: "#374151", marginTop: 8 }}>Phone: {(providerDetails[r.providerId].providerProfile && providerDetails[r.providerId].providerProfile.phone) || "N/A"}</div>
                                <div style={{ color: "#6b7280", marginTop: 6 }}>
                                  {(() => {
                                    const loc = providerDetails[r.providerId] && providerDetails[r.providerId].providerProfile && providerDetails[r.providerId].providerProfile.location;
                                    if (!loc) return "";
                                    if (typeof loc === "string") return loc;
                                    if (typeof loc === "object") {
                                      const {
                                        addressLine = "",
                                        area = "",
                                        city = "",
                                        state = "",
                                        country = "",
                                        pincode = "",
                                      } = loc;
                                      const parts = [addressLine, area, city, state, country].filter(Boolean);
                                      let locStr = parts.join(", ");
                                      if (pincode) locStr += ` - ${pincode}`;
                                      if (!locStr.trim()) return JSON.stringify(loc);
                                      return locStr;
                                    }
                                    return String(loc);
                                  })()}
                                </div>
                                <div style={{ color: "#374151", marginTop: 6 }}>Experience: {(providerDetails[r.providerId].providerProfile && providerDetails[r.providerId].providerProfile.experience) || ""}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    {chatVisible && (
      <ChatWindow
        requestId={chatRequestId}
        currentUserId={auth.currentUser?.uid || "client1"}
        otherUserName={chatOtherUser}
        onClose={() => setChatVisible(false)}
      />
    )}
  </div>
  );
}
