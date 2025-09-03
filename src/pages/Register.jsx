import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

/* -------------------- helper: normalize DOB to yyyy-MM-dd -------------------- */
function normalizeDateToYMD(input) {
  if (!input) return input;
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;

  const m = input.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (m) {
    const [, dd, mm, yyyy] = m;
    const d = String(dd).padStart(2, "0");
    const mo = String(mm).padStart(2, "0");
    return `${yyyy}-${mo}-${d}`;
  }

  const d2 = new Date(input);
  if (!isNaN(d2)) return d2.toISOString().slice(0, 10);
  return input;
}

/* -------------------- NEW: validation helpers -------------------- */
const isValidPhone = (value) => /^[0-9]{10}$/.test(value || "");
// must include at least one letter and one number; allow anything else too
const isValidPassword = (value) => /^(?=.*[A-Za-z])(?=.*\d).+$/.test(value || "");

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    username: "", password: "", email: "",
    firstName: "", lastName: "", phone: "", address: "", dob: ""
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  /* -------------------- NEW: client-side field errors -------------------- */
  const [fieldErrors, setFieldErrors] = useState({
    phone: "",
    password: ""
  });

  const validateFields = () => {
    const errs = { phone: "", password: "" };

    if (!isValidPhone(form.phone)) {
      errs.phone = "Phone must be exactly 10 digits.";
    }
    if (!isValidPassword(form.password)) {
      errs.password = "Password must include at least one letter and one number.";
    }
    setFieldErrors(errs);

    return !errs.phone && !errs.password;
  };

  /* -------------------- onSubmit with normalized/trimmed payload -------------------- */
  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!validateFields()) {
      setErr("Please fix the highlighted fields and try again.");
      return;
    }

    const payload = {
      ...form,
      username: form.username.trim(),
      email: form.email.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      dob: normalizeDateToYMD(form.dob),
    };

    try {
      await register(payload);
      setMsg("Registered! You can now login.");
      setTimeout(() => nav("/login"), 800);
    } catch (er) {
      setErr(
        er?.response?.data?.message ||
        er?.response?.data?.error ||
        er?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Register (Employee)</h2>

        {msg && <div className="alert alert-success">{msg}</div>}
        {err && <div className="alert alert-danger">{err}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
                value={form.password}
                onChange={e => {
                  const v = e.target.value;
                  setForm({ ...form, password: v });
                  setFieldErrors(prev => ({
                    ...prev,
                    password: v && !isValidPassword(v)
                      ? "Password must include at least one letter and one number."
                      : ""
                  }));
                }}
                pattern="^(?=.*[A-Za-z])(?=.*\d).+$"
                title="Password must include at least one letter and one number."
                required
              />
              {fieldErrors.password && (
                <div className="invalid-feedback">{fieldErrors.password}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">DOB</label>
              <input
                type="date"
                className="form-control"
                value={form.dob}
                onChange={e => setForm({ ...form, dob: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">First name</label>
              <input
                className="form-control"
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Last name</label>
              <input
                className="form-control"
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Phone</label>
              <input
                className={`form-control ${fieldErrors.phone ? "is-invalid" : ""}`}
                value={form.phone}
                onChange={e => {
                  const v = e.target.value.replace(/\D/g, "");
                  setForm({ ...form, phone: v });
                  setFieldErrors(prev => ({
                    ...prev,
                    phone: v && !isValidPhone(v) ? "Phone must be exactly 10 digits." : ""
                  }));
                }}
                inputMode="numeric"
                maxLength={10}
                pattern="^[0-9]{10}$"
                title="Enter a 10-digit phone number"
                required
              />
              {fieldErrors.phone && (
                <div className="invalid-feedback">{fieldErrors.phone}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Address</label>
              <input
                className="form-control"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                required
              />
            </div>
          </div>

          <button className="btn btn-primary w-100">Create Account</button>
        </form>
      </div>
    </div>
  );
}
