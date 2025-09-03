// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";
import EmployeeDetails from "./pages/admin/EmployeeDetails";
import Reports from "./pages/admin/Reports";
import MyPayroll from "./pages/employee/MyPayroll";
import LeaveDetails from "./pages/admin/LeaveDetails";
import Welcome from "./pages/Welcome";

function Home() {
  const { isAuthed, role } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return role === "ADMIN" ? <Navigate to="/admin" replace /> : <Navigate to="/me" replace />;
}

export default function App() {
  return (
    <>
      <NavBar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Welcome />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin area */}
        <Route element={<ProtectedRoute allowed={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
           <Route path="/admin/employees/:id" element={<EmployeeDetails />} />
           <Route path="/admin/reports" element={<Reports />} /> 
           <Route path="/admin/leaves/:id" element={<LeaveDetails />} />  
        </Route>

        {/* Employee area */}
        <Route element={<ProtectedRoute allowed={["EMPLOYEE", "ADMIN"]} />}>
          <Route path="/me" element={<EmployeeDashboard />} />
           <Route path="/me/payroll" element={<MyPayroll />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}