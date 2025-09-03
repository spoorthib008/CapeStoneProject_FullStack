import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminPayroll() {
  const [runs, setRuns] = useState([]);
  const [ym, setYM] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
  const [items, setItems] = useState([]);
  const [sel, setSel] = useState(null);

  const loadRuns = async () => {
    const { data } = await api.get("/payroll/runs");
    setRuns(data);
  };
  useEffect(() => { loadRuns(); }, []);

  const createRun = async (e) => {
    e.preventDefault();
    await api.post("/payroll/runs", { year: Number(ym.year), month: Number(ym.month) });
    loadRuns();
  };

  const processRun = async (id) => { await api.post(`/payroll/runs/${id}/process`); loadRuns(); };
  const lockRun = async (id) => { await api.post(`/payroll/runs/${id}/lock`); loadRuns(); };
  const deleteRun = async (id) => { if (confirm("Delete run?")) { await api.delete(`/payroll/runs/${id}`); loadRuns(); } };

  const viewItems = async (id) => {
    setSel(id);
    const { data } = await api.get(`/payroll/runs/${id}/items`);
    setItems(data);
  };

  // --------- UI styles (inline only) ----------
  const card = { borderRadius: 12, overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb", background: "#fff" };
  const header = { background: "linear-gradient(90deg, #001f3f, #003366)", color: "#fff", padding: "14px 18px", fontWeight: 700, letterSpacing: 0.4 };
  const chip = (bg) => ({ background: bg, color: "#fff", fontWeight: 600, borderRadius: 999, padding: "6px 12px", fontSize: "0.85rem" });
  const badgeFor = (s) => {
    const k = (s || "").toUpperCase();
    if (k === "LOCKED") return "badge bg-secondary";
    if (k === "PROCESSED") return "badge bg-info";
    if (k === "DRAFT") return "badge bg-warning text-dark";
    return "badge bg-dark";
  };

  return (
    <div className="container py-3">
      {/* Create Run */}
      <div className="card mb-3" style={card}>
        <div style={header} className="d-flex justify-content-between align-items-center">
          <span>Payroll Runs</span>
          <span style={chip("#0b5ed7")}>Total: {runs?.length || 0}</span>
        </div>
        <div className="card-body">
          <form className="row g-3 align-items-end" onSubmit={createRun}>
            <div className="col-sm-4">
              <label className="form-label">Year</label>
              <div className="input-group">
                <span className="input-group-text">📅</span>
                <input
                  type="number"
                  className="form-control"
                  value={ym.year}
                  onChange={(e) => setYM({ ...ym, year: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="col-sm-4">
              <label className="form-label">Month</label>
              <div className="input-group">
                <span className="input-group-text">🗓️</span>
                <input
                  type="number"
                  min={1}
                  max={12}
                  className="form-control"
                  value={ym.month}
                  onChange={(e) => setYM({ ...ym, month: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="col-sm-4 d-flex">
              <button className="btn btn-dark btn-lg ms-auto">Create Run</button>
            </div>
          </form>
        </div>
      </div>

      {/* Runs Table */}
      <div className="card" style={card}>
        <div style={header} className="d-flex justify-content-between align-items-center">
          <span>Runs</span>
          <span className="badge bg-secondary">Manage</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Year</th>
                  <th>Month</th>
                  <th>Status</th>
                  <th style={{ width: 330 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-semibold">{r.id}</td>
                    <td>{r.year}</td>
                    <td>{r.month}</td>
                    <td><span className={badgeFor(r.status)}>{r.status}</span></td>
                    <td className="d-flex flex-wrap gap-1">
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => viewItems(r.id)}>Items</button>
                      <button className="btn btn-outline-success btn-sm" onClick={() => processRun(r.id)} disabled={r.status === "LOCKED"}>Process</button>
                      <button className="btn btn-outline-dark btn-sm" onClick={() => lockRun(r.id)} disabled={r.status === "LOCKED"}>Lock</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => deleteRun(r.id)} disabled={r.status !== "DRAFT"}>Delete</button>
                    </td>
                  </tr>
                ))}
                {runs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">No runs yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Selected Run Items */}
      {sel && (
        <div className="card mt-4" style={card}>
          <div style={header} className="d-flex justify-content-between align-items-center">
            <span>Run #{sel} – Items</span>
            <button className="btn btn-outline-light btn-sm" onClick={() => setSel(null)}>Close</button>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Basic</th>
                    <th>Deductions</th>
                    <th>Bonus</th>
                    <th className="text-end">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td>{it.employeeName || it.employeeId}</td>
                      <td>₹{it.basicSalary}</td>
                      <td className="text-danger">₹{it.deductions}</td>
                      <td className="text-success">₹{it.bonus}</td>
                      <td className="fw-bold text-end">₹{it.netSalary}</td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">No items for this run.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
