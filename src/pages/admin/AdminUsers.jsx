import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminUsers() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "", email: "", password: "",
    role: "EMPLOYEE", enabled: true
  });

  const load = async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/users");
      setList(data);
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to load users");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleStatus = async (u) => {
    try {
      await api.patch(`/users/${u.id}/status`, { enabled: !u.enabled });
      load();
    } catch (e) { alert("Failed to update status"); }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users", form);
      setForm({ username:"", email:"", password:"", role:"EMPLOYEE", enabled:true });
      load();
    } catch (e) { alert(e?.response?.data?.error || "Create failed"); }
  };

   

  return (
    <div className="container-fluid py-3 admin-users">
      <h3 className="mb-4 fw-bold text-primary">👤 User Management</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-dark text-white fw-semibold">
            Existing Users
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td className="fw-semibold">{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === "ADMIN" ? "bg-danger" : "bg-info"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.enabled ? "bg-success" : "bg-secondary"}`}>
                          {u.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${u.enabled ? "btn-outline-danger" : "btn-outline-success"}`}
                          onClick={() => toggleStatus(u)}
                        >
                          {u.enabled ? "Disable" : "Enable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white fw-semibold">
          ➕ Create New User
        </div>
        <div className="card-body">
          <form onSubmit={createUser} className="row g-3">
            <div className="col-md-3">
              <input className="form-control" placeholder="Username"
                value={form.username}
                onChange={e=>setForm({...form,username:e.target.value})}
                required />
            </div>
            <div className="col-md-3">
              <input type="email" className="form-control" placeholder="Email"
                value={form.email}
                onChange={e=>setForm({...form,email:e.target.value})}
                required />
            </div>
            <div className="col-md-2">
              <select className="form-select"
                value={form.role}
                onChange={e=>setForm({...form,role:e.target.value})}>
                <option>EMPLOYEE</option>
                <option>ADMIN</option>
              </select>
            </div>
            <div className="col-md-2">
              <input type="password" className="form-control" placeholder="Password"
                value={form.password}
                onChange={e=>setForm({...form,password:e.target.value})}
                required />
            </div>
            <div className="col-md-1 d-flex align-items-center">
              <div className="form-check">
                <input className="form-check-input" type="checkbox"
                  checked={form.enabled}
                  onChange={e=>setForm({...form,enabled:e.target.checked})}
                  id="enabledCheck" />
                <label className="form-check-label small" htmlFor="enabledCheck">Enabled</label>
              </div>
            </div>
            <div className="col-md-1">
              <button className="btn btn-success w-100">Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
