import { useState } from "react";

import AdminUsers from "./admin/AdminUsers";
import AdminEmployees from "./admin/AdminEmployees";
import AdminLeaves from "./admin/AdminLeaves";
import AdminPayroll from "./admin/AdminPayroll";
import Reports from "./admin/Reports";

export default function AdminDashboard() {
  const [tab, setTab] = useState("users");

  return (
    <div className="dashboard-bg"> 
    
    <div className="container py-4">
      <div className="card p-3">
        {/* Tabs */}
        <ul className="nav nav-pills mb-3">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${tab === "users" ? "active" : ""}`}
              onClick={() => setTab("users")}
            >
              Users
            </button>
          </li>

          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${tab === "employees" ? "active" : ""}`}
              onClick={() => setTab("employees")}
            >
              Employees
            </button>
          </li>

          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${tab === "leaves" ? "active" : ""}`}
              onClick={() => setTab("leaves")}
            >
              Leave Approvals
            </button>
          </li>

          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${tab === "payroll" ? "active" : ""}`}
              onClick={() => setTab("payroll")}
            >
              Payroll
            </button>
          </li>

          {/* ✅ New tab right next to Payroll */}
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${tab === "reports" ? "active" : ""}`}
              onClick={() => setTab("reports")}
            >
              Reports
            </button>
          </li>
        </ul>

        {/* Tab contents */}
        {tab === "users" && <AdminUsers />}
        {tab === "employees" && <AdminEmployees />}
        {tab === "leaves" && <AdminLeaves />}
        {tab === "payroll" && <AdminPayroll />}
        {tab === "reports" && <Reports />}
      </div>
    </div>
   </div> 
  );
}
