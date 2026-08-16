import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Project from "../pages/Project";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

import "../App.css"

const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const AdminPanel = lazy(() => import("../pages/AdminPanel/AdminPanel"));

export default function AppRoutes() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:projectId" element={<Project/>}/>

        <Route
          path="/admin-login"
          element={
            <Suspense fallback={null}>
              <AdminLogin />
            </Suspense>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Suspense fallback={null}>
                <AdminPanel />
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </div>

  );
}