import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmployees, createEmployeeSmart, deleteEmployee } from "../../api/Employees";
import EmployeeEditModal from "../../components/admin/EmployeeEditModal";

const empty = {
  userId: "",
  firstName: "",
  lastName: "",
  dob: "",
  phone: "",
  address: "",
  designation: "",
  department: "",
  baseSalary: "",
};

export default function AdminEmployees() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function load() {
    setErr("");
    try {
      const data = await getEmployees();
      setList(data);
    } catch (e) {
      setErr("Failed to load employees");
    }
  }

  useEffect(() => { load(); }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onCreate(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    if (!form.userId || !form.firstName || !form.lastName || !form.dob) {
      setErr("userId, firstName, lastName, and dob are required");
      return;
    }

    setLoading(true);
    try {
      const created = await createEmployeeSmart(form);
      setList((prev) => [created, ...prev]); // optimistic add
      setForm(empty);
      setMsg("Employee created");
    } catch (error) {
      setErr(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to create employee"
      );
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(row) {
    setErr(""); setMsg("");
    const id = row?.id ?? row?.employeeId ?? row?.userId;
    if (!id) {
      setErr("Could not determine employee id for deletion");
      return;
    }
    const ok = window.confirm(
      `Delete employee "${row.firstName || ""} ${row.lastName || ""}" (ID: ${id})?`
    );
    if (!ok) return;

    try {
      setDeletingId(id);
      await deleteEmployee(id);
      setList((prev) => prev.filter((r) => (r.id ?? r.employeeId ?? r.userId) !== id));
      setMsg("Employee deleted");
    } catch (error) {
      setErr(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete employee"
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ---------- Inline styles (UI only) ----------
  const card = { borderRadius: 12, overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb", background: "#fff" };
  const header = { background: "linear-gradient(90deg, #001f3f, #003366)", color: "#fff", padding: "14px 18px", fontWeight: 700, letterSpacing: 0.4 };
  const label = { fontSize: "0.8rem", color: "#6c757d", letterSpacing: 0.2, textTransform: "uppercase", marginBottom: 4 };
  const pill = (bg) => ({ background: bg, color: "#fff", fontWeight: 600, borderRadius: 999, padding: "4px 10px", fontSize: "0.8rem" });

  return (
    <div className="container py-3">
      {/* Page title row */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Employees</h4>
        <span className="badge bg-dark">Total: {list?.length || 0}</span>
      </div>

      {/* Create */}
      <div className="card mb-3" style={card}>
        <div style={header}>Create employee (link to existing user)</div>
        <div className="card-body">
          {err && <div className="alert alert-danger py-2">{err}</div>}
          {msg && <div className="alert alert-success py-2">{msg}</div>}

          <form className="row g-3" onSubmit={onCreate}>
            <div className="col-md-2">
              <label className="form-label" style={label}>User ID</label>
              <input name="userId" className="form-control" placeholder="userId" value={form.userId} onChange={onChange} required />
            </div>
            <div className="col-md-2">
              <label className="form-label" style={label}>First Name</label>
              <input name="firstName" className="form-control" placeholder="firstName" value={form.firstName} onChange={onChange} required />
            </div>
            <div className="col-md-2">
              <label className="form-label" style={label}>Last Name</label>
              <input name="lastName" className="form-control" placeholder="lastName" value={form.lastName} onChange={onChange} required />
            </div>
            <div className="col-md-2">
              <label className="form-label" style={label}>DOB</label>
              <input type="date" name="dob" className="form-control" value={form.dob} onChange={onChange} required />
            </div>
            <div className="col-md-2">
              <label className="form-label" style={label}>Phone</label>
              <input name="phone" className="form-control" placeholder="phone" value={form.phone} onChange={onChange} />
            </div>
            <div className="col-md-2">
              <label className="form-label" style={label}>Address</label>
              <input name="address" className="form-control" placeholder="address" value={form.address} onChange={onChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label" style={label}>Designation</label>
              <input name="designation" className="form-control" placeholder="designation" value={form.designation} onChange={onChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label" style={label}>Department</label>
              <input name="department" className="form-control" placeholder="department" value={form.department} onChange={onChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label" style={label}>Base Salary</label>
              <input type="number" name="baseSalary" className="form-control" placeholder="baseSalary" value={form.baseSalary} onChange={onChange} />
            </div>
            <div className="col-md-3 d-grid">
              <button className="btn btn-dark" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* List */}
      <div className="card" style={card}>
        <div style={header} className="d-flex justify-content-between align-items-center">
          <span>Employee List</span>
          <span className="badge bg-secondary">Manage</span>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Phone</th>
                  <th>Base Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">No employees found</td>
                  </tr>
                ) : (
                  list.map((e, i) => {
                    const rowId = e.id ?? e.employeeId ?? e.userId;
                    const isDeleting = deletingId === rowId;
                    return (
                      <tr key={rowId ?? `${e.userId}-${i}`}>
                        <td>{i + 1}</td>
                        <td>
                          <Link to={`/admin/employees/${e.id ?? e.userId}`} className="text-decoration-none">
                            {e.userId ?? e.user?.id}
                          </Link>
                        </td>
                        <td className="fw-semibold">
                          {[e.firstName, e.lastName].filter(Boolean).join(" ")}
                        </td>
                        <td>
                          {e.department
                            ? <span style={pill("#0aa2c0")}>{e.department}</span>
                            : <span className="text-muted">—</span>}
                        </td>
                        <td>
                          {e.designation
                            ? <span style={pill("#6f42c1")}>{e.designation}</span>
                            : <span className="text-muted">—</span>}
                        </td>
                        <td>{e.phone || <span className="text-muted">—</span>}</td>
                        <td>₹{e.baseSalary ?? 0}</td>
                        <td className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setEditing(e)}
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(e)}
                            disabled={isDeleting}
                            title="Delete"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <EmployeeEditModal
          employee={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            const uid = updated?.id ?? updated?.employeeId;
            setList((prev) =>
              prev.map((row) =>
                (row.id ?? row.employeeId) === uid ? { ...row, ...updated } : row
              )
            );
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
