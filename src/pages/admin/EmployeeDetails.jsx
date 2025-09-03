import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmployeeById } from "../../api/Employees";

export default function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getEmployeeById(id);
        setEmployee(data);
      } catch (e) {
        setErr("Failed to fetch employee");
      }
    })();
  }, [id]);

  if (err) return <div className="alert alert-danger">{err}</div>;
  if (!employee) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  // inline styles
  const cardStyle = {
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    overflow: "hidden",
  };

  const headerStyle = {
    background: "linear-gradient(90deg, #0062E6, #33AEFF)",
    color: "white",
    fontWeight: "600",
    fontSize: "1.2rem",
    letterSpacing: "0.5px",
  };

  const detailItemStyle = {
    padding: "10px 0",
    borderBottom: "1px solid #f1f1f1",
    fontSize: "0.95rem",
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#2c3e50",
    marginRight: "6px",
  };

  return (
    <div className="container py-4">
      <div className="card" style={cardStyle}>
        <div className="card-header" style={headerStyle}>
          👤 Employee Details
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div style={detailItemStyle}>
                <span style={labelStyle}>ID:</span> {employee.id}
              </div>
              <div style={detailItemStyle}>
                <span style={labelStyle}>UserId:</span>{" "}
                {employee.userId ?? employee.user?.id}
              </div>
              <div style={detailItemStyle}>
                <span style={labelStyle}>Name:</span> {employee.firstName} {employee.lastName}
              </div>
              <div style={detailItemStyle}>
                <span style={labelStyle}>DOB:</span> {employee.dob}
              </div>
              <div style={detailItemStyle}>
                <span style={labelStyle}>Phone:</span> {employee.phone}
              </div>
            </div>

            <div className="col-md-6">
              <div style={detailItemStyle}>
                <span style={labelStyle}>Address:</span> {employee.address}
              </div>
              <div style={detailItemStyle}>
                <span style={labelStyle}>Department:</span> {employee.department}
              </div>
              <div style={detailItemStyle}>
                <span style={labelStyle}>Designation:</span> {employee.designation}
              </div>
              <div style={detailItemStyle}>
                <span style={labelStyle}>Base Salary:</span>{" "}
                <span className="badge bg-success fs-6">₹{employee.baseSalary}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
