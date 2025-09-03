import { useState } from "react";
import Profile from "./employee/Profile";
import MyLeaves from "./employee/MyLeaves";
import ApplyLeave from "./employee/ApplyLeave";
import MyPayslip from "./employee/MyPayslip";
import MyPayroll from "./employee/MyPayroll";

export default function EmployeeDashboard() {
  const [tab, setTab] = useState("profile");

  const pill = (key, label) => (
    <li className="nav-item" key={key}>
      <button
        type="button"
        className={`nav-link ${tab === key ? "active" : ""}`}
        onClick={() => setTab(key)}
      >
        {label}
      </button>
    </li>
  );

  return (
     <div className="dashboard-bg">
    <div className="container py-4">
      <div className="card p-3">
        {/* Tabs */}
        <ul className="nav nav-pills mb-3">
          {pill("profile", "Profile")}
          {pill("leaves", "My Leaves")}
          {pill("apply", "Apply Leave")}
          {pill("payslip", "Salary Slip")}
          {pill("payroll", "My Payroll")}{/* 👈 added next to Salary Slip */}
        </ul>

        {/* Tab content */}
        <div className="mt-2">
          {tab === "profile" && <Profile />}
          {tab === "leaves" && <MyLeaves />}
          {tab === "apply" && <ApplyLeave />}
          {tab === "payslip" && <MyPayslip />}
          {tab === "payroll" && <MyPayroll />}{/* 👈 renders My Payroll */}
        </div>
      </div>
    </div>
    </div>
  );
}
