import Login from "./pages/Login";
import Dashboard from "./pages/Dashbord";
import { Navigate } from "react-router-dom";
import { BrowserRouter , Routes, Route } from "react-router-dom";
import TestData from "./pages/Test";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test" element={<TestData />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;