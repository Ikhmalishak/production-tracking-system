import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/test" element={<Home />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
