import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminForm from "./pages/Admin/AdminForm";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./utils/ProtectedRoute"; // Import ProtectedRoute
import Dashboard from "./pages/Admin/Dashboard";
import ProjectsPage from "./pages/Admin/ProjectPage";
import AdminLayout from "./layout/AdminLayout";

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
              <AdminLayout>
                <AdminForm />
              </AdminLayout>
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

        {/* Protect the AdminDashboard route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Protect the AdminDashboard route */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <ProjectsPage />
              </AdminLayout>
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
