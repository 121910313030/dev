import Login from "./pages/Login";
import Dashboard from "./pages/Dashbord";
import { Navigate } from "react-router-dom";
import { BrowserRouter , Routes, Route } from "react-router-dom";
import TestData from "./pages/Test";
import Home from "./pages/Home";
import Signup from "./pages/signup";
import HumanInLoop from "./pages/H-I-L-P/HumanInLoop";

// import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/HILP" element={<HumanInLoop/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;