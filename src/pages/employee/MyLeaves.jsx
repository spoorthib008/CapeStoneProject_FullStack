import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";

export default function MyLeaves() {
  const [list, setList] = useState([]);

  const load = async () => {
    const { data } = await api.get("/leave/my");
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  // --- UI helpers (no backend changes) ---
  const statusBadge = (s = "") => {
    const k = s.toUpperCase();
    if (k === "APPROVED") return "badge bg-success";
    if (k === "PENDING") return "badge bg-warning text-dark";
    if (k === "REJECTED") return "badge bg-danger";
    return "badge bg-secondary";
  };

  const stats = useMemo(() => {
    const totals = { total: list.length, approved: 0, pending: 0, rejected: 0 };
    list.forEach(l => {
      const s = (l.status || "").toUpperCase();
      if (s === "APPROVED") totals.approved++;
      else if (s === "PENDING") totals.pending++;
      else if (s === "REJECTED") totals.rejected++;
    });
    return totals;
  }, [list]);

  // --- Inline styles (keeps things self-contained) ---
  const cardStyle = { borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 24px rgba(0,0,0,0.08)", border: "none" };
  const headerStyle = { background: "linear-gradient(90deg, #0d6efd, #3aa0ff)", color: "white", padding: "14px 18px", fontWeight: 600, letterSpacing: 0.3 };
  const chip = (bg) => ({ background: bg, color: "white", fontWeight: 600, borderRadius: 999, padding: "6px 12px", fontSize: "0.85rem" });
  const emptyWrap = { padding: "48px 0" };

  return (
    <div className="container py-4">
      <div className="card" style={cardStyle}>
        <div className="d-flex justify-content-between align-items-center" style={headerStyle}>
          <h5 className="mb-0">My Leaves</h5>
          <div className="d-flex gap-2">
            <span style={chip("#0d6efd")}>Total: {stats.total}</span>
            <span style={chip("#00b894")}>Approved: {stats.approved}</span>
            <span style={chip("#fdc62a")} className="text-dark">Pending: {stats.pending}</span>
            <span style={chip("#e74c3c")}>Rejected: {stats.rejected}</span>
          </div>
        </div>

        <div className="card-body p-0">
          {list.length === 0 ? (
            <div className="text-center text-muted" style={emptyWrap}>
              <div className="mb-2">No leaves found.</div>
              <small>New requests will appear here once submitted.</small>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{whiteSpace: "nowrap"}}>ID</th>
                    <th>Type</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(l => (
                    <tr key={l.id}>
                      <td className="fw-semibold">{l.id}</td>
                      <td>{l.leaveType}</td>
                      <td>{l.startDate}</td>
                      <td>{l.endDate}</td>
                      <td>
                        <span className={statusBadge(l.status)}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
