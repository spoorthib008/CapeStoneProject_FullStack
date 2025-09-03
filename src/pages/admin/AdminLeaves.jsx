import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

export default function AdminLeaves() {
  const [status, setStatus] = useState("PENDING");
  const [list, setList] = useState([]);

  const load = async () => {
    const { data } = await api.get("/leave", { params: { status } });
    setList(Array.isArray(data) ? data : []);
  };

  useEffect(() => { load(); }, [status]);

  const setLeave = async (id, newStatus) => {
    await api.patch(`/leave/${id}`, { status: newStatus });
    load();
  };

  const fmt = (d) => (d ? String(d).slice(0, 10) : "-");

  // ---------- UI styles (inline; no CSS file needed) ----------
  const card = { borderRadius: 12, overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb", background: "#fff" };
  const header = { background: "linear-gradient(90deg, #001f3f, #003366)", color: "#fff", padding: "14px 18px", fontWeight: 700, letterSpacing: 0.4 };
  const pill = (active) =>
    `btn btn-sm ${active ? "btn-primary" : "btn-outline-primary"}`;
  const badgeFor = (s) => {
    const k = (s || "").toUpperCase();
    if (k === "APPROVED") return "badge bg-success";
    if (k === "PENDING")  return "badge bg-warning text-dark";
    if (k === "REJECTED") return "badge bg-danger";
    return "badge bg-secondary";
  };

  return (
    <div className="container py-3">
      {/* Header + filters */}
      <div className="card mb-3" style={card}>
        <div style={header} className="d-flex justify-content-between align-items-center">
          <span>Leave Approvals</span>
          <div className="d-flex gap-2">
            <button className={pill(status === "PENDING")}  onClick={() => setStatus("PENDING")}>Pending</button>
            <button className={pill(status === "APPROVED")} onClick={() => setStatus("APPROVED")}>Approved</button>
            <button className={pill(status === "REJECTED")} onClick={() => setStatus("REJECTED")}>Rejected</button>
            <button className="btn btn-outline-light btn-sm" onClick={load}>Refresh</button>
          </div>
        </div>

        {/* Table */}
        <div className="card-body p-0">
          {list.length === 0 ? (
            <div className="text-center text-muted py-4">
              No {status.toLowerCase()} leaves to show.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                    <th style={{ width: 170 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <Link to={`/admin/leaves/${l.id}`} className="text-decoration-none">
                          {l.id}
                        </Link>
                      </td>
                      <td>{l.leaveType}</td>
                      <td>{fmt(l.startDate || l.fromDate || l.start)}</td>
                      <td>{fmt(l.endDate || l.toDate || l.end)}</td>
                      <td><span className={badgeFor(l.status)}>{l.status}</span></td>
                      <td>
                        {l.status === "PENDING" ? (
                          <div className="btn-group">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => setLeave(l.id, "APPROVED")}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => setLeave(l.id, "REJECTED")}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
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
