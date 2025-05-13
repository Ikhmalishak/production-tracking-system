import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminForm from "./pages/Admin/AdminForm";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./utils/ProtectedRoute"; // Import ProtectedRoute

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/test" element={<Home />} />

        {/* Protect the AdminForm route */}
        <Route
          path="/adminform"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminForm />
            </ProtectedRoute>
          }
        />

        {/* Protect the AdminDashboard route */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/operatordashboard"
          element={
            <ProtectedRoute requiredRole="operator">
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Login route doesn't need protection */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
