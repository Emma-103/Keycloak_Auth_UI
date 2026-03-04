import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import CustomersPage from "./pages/CustomersPage";
import UserManagementPage from "./pages/UserManagementPage";
import LoginRedirectPage from "./pages/LoginRedirectPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRedirectPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="users" element={<UserManagementPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
