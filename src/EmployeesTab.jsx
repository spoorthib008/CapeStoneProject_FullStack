// src/pages/EmployeesTab.jsx
import { useEffect, useState, useMemo } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

function toIsoDate(input) {
  // accepts "yyyy-MM-dd" (native date input) OR "dd-MM-yyyy"
  if (!input) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(input);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return input;
}

export default function EmployeesTab() {
  const token = localStorage.getItem("token");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // form state (Create employee linked to existing user)
  const [form, setForm] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    address: "",
    designation: "",
    department: "",
    baseSalary: "",
  });

  const authHeader = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  async function fetchEmployees() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API}/employees`, { headers: authHeader });
      if (!res.ok) throw new Error(`Load failed: ${res.status}`);
      const data = await res.json();
      // newest (highest id) first
      data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      setRows(data);
    } catch (e) {
      setErr(e.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onCreate(e) {
    e.preventDefault();
    setErr("");

    // Build payload for POST /employees/link
    const payload = {
      userId: Number(form.userId),
      firstName: form.firstName || null,
      lastName: form.lastName || null,
      dob: toIsoDate(form.dob), // Spring expects yyyy-MM-dd
      phone: form.phone || null,
      address: form.address || null,
      designation: form.designation || null,
      department: form.department || null,
      baseSalary:
        form.baseSalary === "" ? null : Number.parseFloat(form.baseSalary),
    };

    if (!payload.userId || Number.isNaN(payload.userId)) {
      setErr("Please provide a valid User ID (existing user).");
      return;
    }

    try {
      const res = await fetch(`${API}/employees/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = `Create failed: ${res.status}`;
        try {
          const j = await res.json();
          msg = j.error || j.message || msg;
        } catch {}
        throw new Error(msg);
      }
      const saved = await res.json();

      // Show the new record immediately at the top
      setRows((prev) => {
        const next = [saved, ...prev.filter((r) => r.id !== saved.id)];
        next.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        return next;
      });

      // Clear form
      setForm({
        userId: "",
        firstName: "",
        lastName: "",
        dob: "",
        phone: "",
        address: "",
        designation: "",
        department: "",
        baseSalary: "",
      });
    } catch (e) {
      setErr(e.message || "Failed to create employee");
    }
  }

  async function onDelete(id) {
    if (!window.confirm("Delete this employee?")) return;
    setErr("");
    try {
      const res = await fetch(`${API}/employees/${id}`, {
        method: "DELETE",
        headers: authHeader,
      });
      if (!res.ok && res.status !== 204) {
        let msg = `Delete failed: ${res.status}`;
        try {
          const j = await res.json();
          msg = j.error || j.message || msg;
        } catch {}
        throw new Error(msg);
      }
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setErr(e.message || "Failed to delete employee");
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Employees</h2>

      {err && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <div>Loading…</div>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">UserId</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Dept</th>
                <th className="py-2 pr-4">Designation</th>
                <th className="py-2 pr-4">Base</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="py-2 pr-4">{r.id}</td>
                  <td className="py-2 pr-4">{r.user?.id ?? "-"}</td>
                  <td className="py-2 pr-4">
                    {[(r.firstName || ""), (r.lastName || "")]
                      .join(" ")
                      .trim() || "-"}
                  </td>
                  <td className="py-2 pr-4">{r.department || "-"}</td>
                  <td className="py-2 pr-4">{r.designation || "-"}</td>
                  <td className="py-2 pr-4">
                    {r.baseSalary == null ? "-" : Number(r.baseSalary)}
                  </td>
                  <td className="py-2 pr-4">
                    <button
                      onClick={() => onDelete(r.id)}
                      className="text-sm rounded bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="py-3" colSpan={7}>
                    No employees yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <hr className="my-6" />

          <h3 className="font-medium mb-3">Create employee (link to existing user)</h3>
          <form onSubmit={onCreate} className="grid grid-cols-6 gap-3 items-center">
            <input
              className="col-span-1 border rounded px-2 py-1"
              placeholder="userId"
              name="userId"
              value={form.userId}
              onChange={onChange}
            />
            <input
              className="col-span-1 border rounded px-2 py-1"
              placeholder="firstName"
              name="firstName"
              value={form.firstName}
              onChange={onChange}
            />
            <input
              className="col-span-1 border rounded px-2 py-1"
              placeholder="lastName"
              name="lastName"
              value={form.lastName}
              onChange={onChange}
            />
            <input
              className="col-span-1 border rounded px-2 py-1"
              placeholder="yyyy-MM-dd or dd-MM-yyyy"
              name="dob"
              value={form.dob}
              onChange={onChange}
            />
            <input
              className="col-span-1 border rounded px-2 py-1"
              placeholder="phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
            />
            <input
              className="col-span-1 border rounded px-2 py-1"
              placeholder="address"
              name="address"
              value={form.address}
              onChange={onChange}
            />
            <input
              className="col-span-2 border rounded px-2 py-1"
              placeholder="designation"
              name="designation"
              value={form.designation}
              onChange={onChange}
            />
            <input
              className="col-span-2 border rounded px-2 py-1"
              placeholder="department"
              name="department"
              value={form.department}
              onChange={onChange}
            />
            <input
              className="col-span-1 border rounded px-2 py-1"
              placeholder="baseSalary"
              name="baseSalary"
              value={form.baseSalary}
              onChange={onChange}
              type="number"
              step="0.01"
              min="0"
            />
            <div className="col-span-6 flex justify-end">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
