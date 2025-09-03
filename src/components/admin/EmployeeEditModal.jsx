// src/components/admin/EmployeeEditModal.jsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { updateEmployee } from "../../api/Employees";

/**
 * Props:
 * - employee: the employee object to edit (must contain id or employeeId)
 * - onClose: () => void
 * - onSaved: (updatedEmployee) => void
 */
export default function EmployeeEditModal({ employee, onClose, onSaved }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    address: "",
    designation: "",
    department: "",
    baseSalary: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!employee) return;
    const dob = employee.dob || "";
    setForm({
      firstName: employee.firstName ?? "",
      lastName: employee.lastName ?? "",
      // keep whatever date format your backend expects; if it's yyyy-MM-dd from an <input type="date">, pass that
      dob: /^\d{4}-\d{2}-\d{2}$/.test(dob) ? dob : dob,
      phone: employee.phone ?? "",
      address: employee.address ?? "",
      designation: employee.designation ?? "",
      department: employee.department ?? "",
      baseSalary: employee.baseSalary ?? "",
    });
  }, [employee]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      const id = employee?.id ?? employee?.employeeId;
      if (!id) throw new Error("Employee ID not found in row");
      const payload = {
        ...form,
        baseSalary: form.baseSalary === "" ? null : Number(form.baseSalary),
      };
      const updated = await updateEmployee(id, payload);
      onSaved(updated);
    } catch (error) {
      setErr(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update employee"
      );
    } finally {
      setSaving(false);
    }
  }

  if (!employee) return null;

  // Modal content
  const modal = (
    <>
      {/* Backdrop (below modal) */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="modal fade show"
        role="dialog"
        aria-modal="true"
        style={{
          display: "block",
          position: "fixed",
          inset: 0,
          zIndex: 1055,
          overflowY: "auto",
        }}
      >
        <div className="modal-dialog modal-lg" style={{ marginTop: "10vh" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Employee</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              {err && <div className="alert alert-danger">{err}</div>}

              <form className="row g-2" onSubmit={onSubmit}>
                <div className="col-md-3">
                  <label className="form-label">First Name</label>
                  <input
                    name="firstName"
                    className="form-control"
                    value={form.firstName}
                    onChange={onChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Last Name</label>
                  <input
                    name="lastName"
                    className="form-control"
                    value={form.lastName}
                    onChange={onChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">DOB</label>
                  <input
                    type="date"
                    name="dob"
                    className="form-control"
                    value={form.dob}
                    onChange={onChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Phone</label>
                  <input
                    name="phone"
                    className="form-control"
                    value={form.phone}
                    onChange={onChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Address</label>
                  <input
                    name="address"
                    className="form-control"
                    value={form.address}
                    onChange={onChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Department</label>
                  <input
                    name="department"
                    className="form-control"
                    value={form.department}
                    onChange={onChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Designation</label>
                  <input
                    name="designation"
                    className="form-control"
                    value={form.designation}
                    onChange={onChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Base Salary</label>
                  <input
                    type="number"
                    name="baseSalary"
                    className="form-control"
                    value={form.baseSalary}
                    onChange={onChange}
                  />
                </div>

                <div className="col-12 d-flex justify-content-end gap-2 mt-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Render to body so backdrop never blocks the modal
  return createPortal(modal, document.body);
}
