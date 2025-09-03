import React from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  const pageStyle = {
    backgroundImage: "url('https://plus.unsplash.com/premium_photo-1667761634654-7fcf176434b8?q=80&w=1137&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: "black",
    textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
  };

  
  return (
    <div style={pageStyle}>
      <h1 className="mb-4 text-center">Welcome to Payroll Management System</h1>
      <button className="btn btn-primary" onClick={() => navigate("/login")}>
        Login
      </button>
      <p className="lead text-center">
        Where payday meets peace of mind — Click. Calculate. Celebrate.
      </p>
    </div>
  );
}
