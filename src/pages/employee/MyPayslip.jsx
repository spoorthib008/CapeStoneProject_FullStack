import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function MyPayslip() {
  const today = new Date();
  const [ym, setYM] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 });
  const [slip, setSlip] = useState(null);
  const [err, setErr] = useState("");
  const [profile, setProfile] = useState(null);

  // fetch profile once when component mounts
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/profile");
        setProfile(data);
      } catch (e) {
        console.warn("Failed to fetch profile", e);
      }
    })();
  }, []);

  const load = async (e) => {
    e?.preventDefault();
    setErr(""); setSlip(null);
    try {
      const { data } = await api.get(`/payroll/my/${ym.year}/${ym.month}`);
      setSlip(data);
    } catch (er) {
      setErr(er?.response?.data?.error || "Not found");
    }
  };

  // styles (same as before)
  const cardStyle = {
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
    background: "#fff",
  };
  const headerStyle = {
    background: "linear-gradient(90deg, #001f3f, #003366)", // navy blue gradient
    color: "white",
    padding: "16px 20px",
    fontWeight: 700,
    fontSize: "1.1rem",
    letterSpacing: 0.5,
  };
  const payslipBox = {
    border: "1px solid #dee2e6",
    borderRadius: 8,
    padding: "12px 16px",
    marginBottom: "12px",
    background: "#f8f9fa",
  };
  const label = { fontSize: "0.85rem", color: "#6c757d", marginBottom: 2 };
  const value = { fontWeight: 600, fontSize: "1rem" };

  return (
    <div className="container py-4">
      {/* Query form */}
      <div className="card mb-4" style={cardStyle}>
        <div style={headerStyle}>Salary Slip Lookup</div>
        <div className="card-body">
          <form className="row g-3 align-items-end" onSubmit={load}>
            <div className="col-md-4">
              <label className="form-label">Year</label>
              <input
                className="form-control"
                type="number"
                value={ym.year}
                onChange={(e) => setYM({ ...ym, year: Number(e.target.value) })}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Month</label>
              <input
                className="form-control"
                type="number"
                min={1}
                max={12}
                value={ym.month}
                onChange={(e) => setYM({ ...ym, month: Number(e.target.value) })}
                required
              />
            </div>
            <div className="col-md-4 d-flex">
              <button className="btn btn-dark btn-lg ms-auto">Fetch</button>
            </div>
          </form>
          {err && <div className="alert alert-warning mt-3 mb-0">{err}</div>}
        </div>
      </div>

      {/* Payslip */}
      {slip && (
        <div className="card" style={cardStyle}>
          <div style={headerStyle} className="d-flex justify-content-between align-items-center">
            <span>Payslip</span>
            <span>{ym.month}/{ym.year}</span>
          </div>

          <div className="card-body">
            {/* Employee + company info */}
            <div className="row mb-4">
              <div className="col-md-6">
                <h6 className="fw-bold text-muted">Employee Info</h6>
                <div>Name: {slip.employeeName || profile?.firstName + " " + profile?.lastName || "N/A"}</div>
                <div>ID: {slip.employeeId || profile?.id || "N/A"}</div>
                <div>Department: {profile?.department || "N/A"}</div>
              </div>
              <div className="col-md-6 text-md-end">
                <h6 className="fw-bold text-muted">Company</h6>
                <div>Payroll Management System</div>
                <div>Date Generated: {slip.generatedAt || new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <hr />

            {/* Salary breakdown */}
            <div className="row">
              <div className="col-md-6">
                <div style={payslipBox}>
                  <div style={label}>Basic Salary</div>
                  <div style={value}>₹{slip.basicSalary}</div>
                </div>
                <div style={payslipBox}>
                  <div style={label}>Bonus</div>
                  <div style={{ ...value, color: "green" }}>₹{slip.bonus}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div style={payslipBox}>
                  <div style={label}>Deductions</div>
                  <div style={{ ...value, color: "red" }}>₹{slip.deductions}</div>
                </div>
                <div style={payslipBox}>
                  <div style={label}>Other Allowances</div>
                  <div style={value}>₹{slip.allowances || 0}</div>
                </div>
              </div>
            </div>

            <hr />

            {/* Net salary */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <h5 className="mb-0">Net Salary</h5>
              <h4 className="mb-0 text-success">₹{slip.netSalary}</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
