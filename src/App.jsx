import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Admin from "./pages/Dashboard/Admin/Admin";
import Manager from "./pages/Dashboard/Manager/Manager";
import Planner from "./pages/Dashboard/Planner/Planner";
import Scheduler from "./pages/Dashboard/Scheduler/Scheduler";
import Crew from "./pages/Dashboard/Crew/Crew";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Private */}
        <Route path="/admin-dashboard" element={<Admin />} />
        <Route path="/manager-dashboard" element={<Manager />} />
        <Route path="/planner-dashboard" element={<Planner />} />
        <Route path="/scheduler-dashboard" element={<Scheduler />} />
        <Route path="/crew-dashboard" element={<Crew />} />
      </Routes>
    </Router>
  );
}
