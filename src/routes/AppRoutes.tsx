import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Project from "../pages/Project";
import AdminLogin from "../pages/AdminLogin";
import AdminPanel from "../pages/AdminPanel/AdminPanel";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

import "../App.css"


export default function AppRoutes() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:projectId" element={<Project/>}/>

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </div>
    
  );
}