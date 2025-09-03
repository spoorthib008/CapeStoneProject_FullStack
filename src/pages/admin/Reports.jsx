import { useEffect, useState, useMemo } from "react";
import { getPayrollSummary, getDepartmentCost } from "../../api/reports";

const now = new Date();
const DEFAULT_YEAR = now.getFullYear();
const DEFAULT_MONTH = now.getMonth() + 1; // 1..12

/* ---------- tiny helpers (UI only) ---------- */
const styles = {
  page: { background: "#f7f9fc", minHeight: "100%", paddingTop: 12 },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    border: "1px solid #e9eef5",
    background: "#fff",
  },
  head: {
    background: "linear-gradient(90deg, #001f3f 0%, #0b7285 100%)", // navy → teal
    color: "#fff",
    padding: "14px 18px",
    fontWeight: 700,
    letterSpacing: 0.4,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chip(bg = "#0b7285") {
    return {
      background: bg,
      color: "#fff",
      fontWeight: 600,
      borderRadius: 999,
      padding: "6px 12px",
      fontSize: "0.85rem",
      whiteSpace: "nowrap",
    };
  },
  label: {
    fontSize: "0.8rem",
    color: "#6c757d",
    letterSpacing: 0.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
};

function YMControls({ year, month, onYear, onMonth, onClick, label, loading }) {
  return (
    <div className="row g-3 align-items-end">
      <div className="col-sm-4">
        <label className="form-label" style={styles.label}>Year</label>
        <div className="input-group">
          <span className="input-group-text">📅</span>
          <input
            type="number"
            className="form-control"
            value={year}
            onChange={(e) => onYear(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="col-sm-4">
        <label className="form-label" style={styles.label}>Month (1–12)</label>
        <div className="input-group">
          <span className="input-group-text">🗓️</span>
          <input
            type="number"
            min="1"
            max="12"
            className="form-control"
            value={month}
            onChange={(e) => onMonth(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="col-sm-4 d-flex">
        <button className="btn btn-dark btn-lg ms-auto" onClick={onClick} disabled={loading}>
          {loading ? "Loading..." : label}
        </button>
      </div>
    </div>
  );
}

function ObjectOrArray({ data }) {
  if (!data) return null;

  if (Array.isArray(data)) {
    if (data.length === 0) return <div className="text-muted mt-3">No records.</div>;
    const cols = Array.from(
      data.reduce((s, row) => { Object.keys(row || {}).forEach((k) => s.add(k)); return s; }, new Set())
    );
    return (
      <div className="table-responsive mt-3">
        <table className="table table-hover table-striped align-middle mb-0">
          <thead className="table-light">
            <tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>{cols.map((c) => <td key={c}>{String(row?.[c] ?? "")}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const entries = Object.entries(data);
  if (entries.length === 0) return <div className="text-muted mt-3">No records.</div>;
  return (
    <ul className="list-group mt-3">
      {entries.map(([k, v]) => (
        <li key={k} className="list-group-item d-flex justify-content-between">
          <span className="fw-medium">{k}</span>
          <span>{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Reports() {
  const [y1, setY1] = useState(DEFAULT_YEAR);
  const [m1, setM1] = useState(DEFAULT_MONTH);
  const [sum, setSum] = useState(null);
  const [busy1, setBusy1] = useState(false);
  const [err1, setErr1] = useState("");

  const [y2, setY2] = useState(DEFAULT_YEAR);
  const [m2, setM2] = useState(DEFAULT_MONTH);
  const [dept, setDept] = useState(null);
  const [busy2, setBusy2] = useState(false);
  const [err2, setErr2] = useState("");

  async function loadSummary() {
    setBusy1(true); setErr1("");
    try {
      const data = await getPayrollSummary(y1, m1);
      setSum(data);
    } catch (e) {
      setErr1(e?.response?.data?.message || e?.message || "Failed to fetch payroll summary");
      setSum(null);
    } finally { setBusy1(false); }
  }

  async function loadDept() {
    setBusy2(true); setErr2("");
    try {
      const data = await getDepartmentCost(y2, m2);
      setDept(data);
    } catch (e) {
      setErr2(e?.response?.data?.message || e?.message || "Failed to fetch department cost");
      setDept(null);
    } finally { setBusy2(false); }
  }

  // auto-load current month on mount
  useEffect(() => { loadSummary(); /* eslint-disable-line */ }, []);
  useEffect(() => { loadDept(); /* eslint-disable-line */ }, []);

  // quick derived counts (purely visual)
  const rowCountSum = useMemo(() => (Array.isArray(sum) ? sum.length : sum ? Object.keys(sum).length : 0), [sum]);
  const rowCountDept = useMemo(() => (Array.isArray(dept) ? dept.length : dept ? Object.keys(dept).length : 0), [dept]);

  return (
    <div className="container" style={styles.page}>
      {/* PAYROLL SUMMARY */}
      <div className="card mb-4" style={styles.card}>
        <div style={styles.head}>
          <span>📈 Payroll Summary</span>
          <span style={styles.chip("#0b7285")}>Rows: {rowCountSum}</span>
        </div>
        <div className="card-body">
          <YMControls
            year={y1} month={m1}
            onYear={setY1} onMonth={setM1}
            onClick={loadSummary}
            label="Load Summary"
            loading={busy1}
          />
          {err1 && <div className="alert alert-danger mt-3 mb-0">{err1}</div>}
          {!err1 && <ObjectOrArray data={sum} />}
        </div>
      </div>

      {/* DEPARTMENT COSTS */}
      <div className="card" style={styles.card}>
        <div style={styles.head}>
          <span>🏷️ Department Cost</span>
          <span style={styles.chip("#364fc7")}>Rows: {rowCountDept}</span>
        </div>
        <div className="card-body">
          <YMControls
            year={y2} month={m2}
            onYear={setY2} onMonth={setM2}
            onClick={loadDept}
            label="Load Department Cost"
            loading={busy2}
          />
          {err2 && <div className="alert alert-danger mt-3 mb-0">{err2}</div>}
          {!err2 && <ObjectOrArray data={dept} />}
        </div>
      </div>
    </div>
  );
}
