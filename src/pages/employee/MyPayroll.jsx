import { useEffect, useState, useMemo } from "react";
import { getMyPay } from "../../api/Payroll";

const now = new Date();
const DEFAULT_YEAR = now.getFullYear();
const DEFAULT_MONTH = now.getMonth() + 1;

export default function MyPayroll() {
  const [year, setYear] = useState(DEFAULT_YEAR);
  const [month, setMonth] = useState(DEFAULT_MONTH);
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    setBusy(true); setErr("");
    try {
      const d = await getMyPay(year, month);
      setData(d);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Failed to fetch my payroll");
      setData(null);
    } finally { setBusy(false); }
  }

  useEffect(() => { load(); /* eslint-disable-line */ }, []);

  // ------ Inline styles for a polished (navy) UI ------
  const cardStyle = {
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
    background: "#fff",
  };
  const headerStyle = {
    background: "linear-gradient(90deg, #001f3f, #003366)", // navy gradient
    color: "white",
    padding: "16px 20px",
    fontWeight: 700,
    fontSize: "1.05rem",
    letterSpacing: 0.4,
  };
  const chip = (bg) => ({
    background: bg,
    color: "white",
    fontWeight: 600,
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: "0.85rem",
  });
  const label = { fontSize: "0.8rem", color: "#6c757d", letterSpacing: 0.2, marginBottom: 4, textTransform: "uppercase" };
  const val   = { fontWeight: 700, color: "#243447", fontSize: "1.05rem" };
  const box   = { border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", background: "#fff" };

  // Optional: derive a simple summary if keys exist (non-breaking)
  const summary = useMemo(() => {
    if (!data) return null;
    const basic = Number(data.basicSalary ?? 0);
    const bonus = Number(data.bonus ?? 0);
    const deductions = Number(data.deductions ?? 0);
    const net = Number(data.netSalary ?? (basic + bonus - deductions));
    return { basic, bonus, deductions, net };
  }, [data]);

  return (
    <div className="container py-3">
      {/* Top card: controls */}
      <div className="card" style={cardStyle}>
        <div className="d-flex justify-content-between align-items-center" style={headerStyle}>
          <div>💼 My Payroll</div>
          <div className="d-flex gap-2">
            <span style={chip("#0b5ed7")}>Year: {year}</span>
            <span style={chip("#0aa2c0")}>Month: {month}</span>
          </div>
        </div>

        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-sm-4">
              <label className="form-label" style={label}>Year</label>
              <div className="input-group">
                <span className="input-group-text">📅</span>
                <input
                  type="number"
                  className="form-control"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <label className="form-label" style={label}>Month (1–12)</label>
              <div className="input-group">
                <span className="input-group-text">🗓️</span>
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="form-control"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="col-sm-4 d-flex">
              <button className="btn btn-dark btn-lg ms-auto" onClick={load} disabled={busy}>
                {busy ? "Loading..." : "Load"}
              </button>
            </div>
          </div>

          {err && <div className="alert alert-danger mt-3 mb-0">{err}</div>}
        </div>
      </div>

      {/* Summary strip (if data available) */}
      {data && summary && (
        <div className="card mt-3" style={cardStyle}>
          <div className="d-flex justify-content-between align-items-center" style={headerStyle}>
            <div>Summary</div>
            <span className="badge bg-secondary">For {month}/{year}</span>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <div style={box}>
                  <div style={label}>Basic</div>
                  <div style={val}>₹{summary.basic}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div style={box}>
                  <div style={label}>Bonus</div>
                  <div style={{ ...val, color: "green" }}>₹{summary.bonus}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div style={box}>
                  <div style={label}>Deductions</div>
                  <div style={{ ...val, color: "red" }}>₹{summary.deductions}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div style={{ ...box, background: "linear-gradient(180deg, #eef7f0, #ffffff)" }}>
                  <div style={label}>Net</div>
                  <div style={{ ...val, fontSize: "1.15rem" }}>₹{summary.net}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Raw field list (unchanged logic, just prettier) */}
      {data && (
        <div className="card mt-3" style={cardStyle}>
          <div className="d-flex justify-content-between align-items-center" style={headerStyle}>
            <div>Payslip Fields</div>
            <span className="badge bg-dark">Raw Data</span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <tbody>
                  {Object.entries(data).map(([k, v]) => (
                    <tr key={k}>
                      <th className="text-muted" style={{ width: 240, paddingLeft: 16 }}>{k}</th>
                      <td style={{ paddingRight: 16 }}>{typeof v === "object" ? JSON.stringify(v) : String(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!data && !busy && !err && (
        <div className="text-muted mt-3">No payroll data for the selected month.</div>
      )}
    </div>
  );
}
