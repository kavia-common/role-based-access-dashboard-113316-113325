import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  AdminDashboard,
  GuestDashboard,
  UserDashboard,
  SuperAdminDashboard,
  OrgAdminDashboard,
  InviteAdminDashboard
} from "./components/Dashboard";
import ProfileDisplay from "./components/Profile/ProfileDisplay";
import LoginModal from "./components/Auth/LoginModal";
import RegisterModal from "./components/Auth/RegisterModal";
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import { ToastProvider } from "./components/UI/ToastContext";
import "./App.css";

// Main application routing and layout
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Header />
          <Sidebar />
          <main style={{ margin: "24px", minHeight: "80vh" }}>
            <Routes>
              <Route path="/" element={<GuestDashboard />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRoles={["user"]}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              {/* Super Admin */}
              <Route
                path="/super-admin"
                element={
                  <ProtectedRoute requiredRoles={["super_admin"]}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                }
              />
              {/* Org Admin */}
              <Route
                path="/org-admin"
                element={
                  <ProtectedRoute requiredRoles={["org_admin"]}>
                    <OrgAdminDashboard />
                  </ProtectedRoute>
                }
              />
              {/* Invite Admin */}
              <Route
                path="/invite-admin"
                element={
                  <ProtectedRoute requiredRoles={["invite_admin"]}>
                    <InviteAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile" element={<ProfileDisplay />} />
            </Routes>
            <LoginModal />
            <RegisterModal />
          </main>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
