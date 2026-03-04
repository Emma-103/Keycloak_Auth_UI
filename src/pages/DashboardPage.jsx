import React from "react";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="card-grid">
        <article className="card">
          <h3>Transactions</h3>
          <p>Monitor completed, pending, and failed transaction events.</p>
        </article>
        <article className="card">
          <h3>Customers</h3>
          <p>Track customer segments, contacts, and operational profiles.</p>
        </article>
        <article className="card">
          <h3>User Management</h3>
          <p>Control user roles, account statuses, and access visibility.</p>
        </article>
      </div>

      <section className="token-section">
        <h3>Session Profile</h3>
        <p>
          <strong>User:</strong> {user?.preferredUsername || user?.name || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "N/A"}
        </p>
        <p>
          <strong>Roles:</strong> {user?.roles?.length ? user.roles.join(", ") : "N/A"}
        </p>
      </section>
    </div>
  );
}
