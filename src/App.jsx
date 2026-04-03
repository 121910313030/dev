import Login from "./pages/Login";
import Dashboard from "./pages/Dashbord";
import { Navigate } from "react-router-dom";
import { BrowserRouter , Routes, Route } from "react-router-dom";
import TestData from "./pages/Test";
import Home from "./pages/Home";
import Signup from "./pages/signup";
import HumanInLoop from "./pages/H-I-L-P/HumanInLoop";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/HILP" element={<HumanInLoop/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
        </Route>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/HILP" element={<HumanInLoop/>} />
        <Route path="/admin" element={<AdminDashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;