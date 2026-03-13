import Login from "./pages/Login";
import Dashboard from "./pages/Dashbord";
import { Navigate } from "react-router-dom";
import { BrowserRouter , Routes, Route } from "react-router-dom";
import TestData from "./pages/Test";
import Home from "./pages/Home";
import Signup from "./pages/signup";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;