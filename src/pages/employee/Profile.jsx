import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function Profile() {
  const [p, setP] = useState(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const { data } = await api.get("/profile");
    setP(data);
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      phone: p.phone,
      address: p.address,
      designation: p.designation,
      department: p.department
    };
    await api.put("/profile", payload);
    setMsg("Saved!");
    setTimeout(() => setMsg(""), 1200);
  };

  if (!p) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  // ---- Inline styles (no external CSS needed) ----
  const bgStyle = {
    backgroundImage:
      "url('https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=1920&auto=format&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    position: "relative",
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)",
  };

  const shellStyle = {
    position: "relative",
    zIndex: 1,
    paddingTop: "56px",
    paddingBottom: "56px",
  };

  const cardStyle = {
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 10px 28px rgba(0,0,0,0.18)",
    border: "none",
  };

  const headerStyle = {
    background:
      "linear-gradient(90deg, rgba(0,98,230,0.95) 0%, rgba(51,174,255,0.95) 100%)",
    color: "white",
    padding: "18px 22px",
  };

  const pill = (bg) => ({
    background: bg,
    color: "white",
    fontWeight: 600,
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: "0.85rem",
  });

  const sectionTitle = {
    fontWeight: 700,
    letterSpacing: 0.3,
    color: "#2c3e50",
    fontSize: "1.05rem",
  };

  const labelStyle = {
    fontSize: "0.85rem",
    color: "#6c757d",
  };

  return (
    <div style={bgStyle}>
      <div style={overlayStyle} />

      <div className="container" style={shellStyle}>
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-11">
            <div className="card" style={cardStyle}>
              {/* Header */}
              <div style={headerStyle} className="d-flex align-items-center justify-content-between">
                <h4 className="mb-0">My Profile</h4>
                <div className="d-flex gap-2">
                  {p.designation && <span style={pill("#00b894")}>{p.designation}</span>}
                  {p.department && <span style={pill("#fd7e14")}>{p.department}</span>}
                </div>
              </div>

              {/* Body */}
              <div className="card-body">
                {msg && <div className="alert alert-success">{msg}</div>}

                {/* Form: retains your exact fields and bindings */}
                <form onSubmit={save} className="row g-3">
                  {/* Read-only row */}
                  <div className="col-md-4">
                    <label className="form-label" style={labelStyle}>First</label>
                    <input className="form-control" value={p.firstName || ""} disabled />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" style={labelStyle}>Last</label>
                    <input className="form-control" value={p.lastName || ""} disabled />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" style={labelStyle}>DOB</label>
                    <input className="form-control" value={p.dob || ""} disabled />
                  </div>

                  {/* Editable row */}
                  <div className="col-md-4">
                    <label className="form-label" style={labelStyle}>Phone</label>
                    <input
                      className="form-control"
                      value={p.phone || ""}
                      onChange={(e) => setP({ ...p, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label" style={labelStyle}>Address</label>
                    <input
                      className="form-control"
                      value={p.address || ""}
                      onChange={(e) => setP({ ...p, address: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" style={labelStyle}>Designation</label>
                    <input
                      className="form-control"
                      value={p.designation || ""}
                      onChange={(e) => setP({ ...p, designation: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" style={labelStyle}>Department</label>
                    <input
                      className="form-control"
                      value={p.department || ""}
                      onChange={(e) => setP({ ...p, department: e.target.value })}
                    />
                  </div>

                  <div className="col-12 d-flex justify-content-end mt-2">
                    <button className="btn btn-primary btn-lg px-4">Save</button>
                  </div>
                </form>
              </div>
              {/* /Body */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
