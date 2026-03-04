import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menus = [
  { path: "/", label: "Dashboard" },
  { path: "/transactions", label: "Transactions" },
  { path: "/customers", label: "Customers" },
  { path: "/users", label: "User Management" }
];

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Backoffice Portal</h1>
        <nav>
          {menus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              end={menu.path === "/"}
              className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}
            >
              {menu.label}
            </NavLink>
          ))}
        </nav>
        <button className="logout-button" onClick={logout}>
          Sign out
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
