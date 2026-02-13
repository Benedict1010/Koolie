import "./App.css";
import "./styles/hero.css";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CompleteProfile from "./pages/CompleteProfile";
import RoleDashboard from "./pages/RoleDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import RequestForm from "./pages/RequestForm";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function HomePage() {
  return (
    <>
      {/* keep spacing so content isn't hidden by fixed navbar */}
      <div style={{ paddingTop: "92px" }}>
        {/* Home component with hero and other sections */}
        <Home />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/role-dashboard" element={<RoleDashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/request" element={<RequestForm />} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
