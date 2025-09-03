import { useState } from "react";
import api from "../../lib/api";

export default function ApplyLeave() {
  const [startDate, setS] = useState("");
  const [endDate, setE] = useState("");
  const [type, setT] = useState("PAID");
  const [reason, setR] = useState("");           // ✅ NEW
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setMsg("");
    try {
      // ✅ include reason only if provided (safe for existing backend)
      const params = { startDate, endDate, type };
      if (reason.trim()) params.reason = reason.trim();

      await api.post(`/leave`, null, { params });
      setMsg("Leave requested.");
      setS(""); setE(""); setT("PAID"); setR(""); // reset reason too
    } catch (er) {
      setErr(er?.response?.data?.error || "Failed");
    }
  };

  // --- Inline styles for a professional look ---
  const cardStyle = {
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    border: "none",
  };
  const headerStyle = {
    background: "linear-gradient(90deg, #001f3f, #003366)", // navy
    color: "white",
    padding: "14px 18px",
    fontWeight: 600,
    letterSpacing: 0.3,
  };
  const hintStyle = { fontSize: "0.85rem", color: "#6c757d" };

  return (
    <div className="container py-4">
      <div className="card" style={cardStyle}>
        <div className="d-flex align-items-center justify-content-between" style={headerStyle}>
          <h5 className="mb-0">Apply Leave</h5>
          <span className="badge bg-dark">Employee Portal</span>
        </div>

        <div className="card-body">
          {msg && <div className="alert alert-success mb-3">{msg}</div>}
          {err && <div className="alert alert-danger mb-3">{err}</div>}

          <form className="row g-3" onSubmit={submit}>
            {/* Start Date */}
            <div className="col-md-4">
              <label className="form-label">Start Date</label>
              <div className="input-group">
                <span className="input-group-text">📅</span>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setS(e.target.value)}
                  required
                />
              </div>
              <div style={hintStyle}>Your leave begins on this date.</div>
            </div>

            {/* End Date */}
            <div className="col-md-4">
              <label className="form-label">End Date</label>
              <div className="input-group">
                <span className="input-group-text">📅</span>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setE(e.target.value)}
                  required
                />
              </div>
              <div style={hintStyle}>Your leave ends on this date.</div>
            </div>

            {/* Type */}
            <div className="col-md-4">
              <label className="form-label">Type</label>
              <div className="input-group">
                <span className="input-group-text">🏷️</span>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setT(e.target.value)}
                >
                  <option>PAID</option>
                  <option>SICK</option>
                  <option>CASUAL</option>
                </select>
              </div>
              <div style={hintStyle}>Choose the appropriate leave category.</div>
            </div>

            {/* ✅ NEW: Reason */}
            <div className="col-12">
              <label className="form-label">Reason </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Brief reason for your leave (e.g., personal, medical, travel)…"
                value={reason}
                onChange={(e) => setR(e.target.value)}
                maxLength={500}
              />
              <div style={hintStyle}>
                This helps your manager understand the context. Max 500 characters.
              </div>
            </div>

            {/* Submit */}
            <div className="col-12 d-flex justify-content-end">
              <button className="btn btn-primary btn-lg px-4">
                Submit Request
              </button>
            </div>
          </form>

          {/* Subtle info footer */}
          <div className="mt-3 text-muted" style={{ fontSize: "0.85rem" }}>
            Tip: Ensure your start and end dates are correct before submitting. You can track approval status in <strong>My Leaves</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}
