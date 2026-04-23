import Login from "./pages/Login";
import Dashboard from "./pages/Dashbord";
import { BrowserRouter , Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import HumanInLoop from "./pages/H-I-L-P/HumanInLoop";
import ProtectedRoute from "./ProtectedRoute";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/HILP" element={<HumanInLoop/>} />
        </Route>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/HILP" element={<HumanInLoop/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;