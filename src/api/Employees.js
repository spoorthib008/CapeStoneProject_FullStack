// src/api/employees.js
import api from "../lib/api"; // adjust path if needed

/**
 * GET /employees → list all employees
 */
export async function getEmployees() {
  const { data } = await api.get("/employees");
  return Array.isArray(data) ? data : [];
}

/**
 * GET /employees/{employeeId} → fetch one employee by id
 */
export async function getEmployeeById(employeeId) {
  if (!employeeId) throw new Error("employeeId is required");
  const { data } = await api.get(`/employees/${employeeId}`);
  return data;
}

/**
 * POST /employees → create new employee profile (linked to a user)
 * 1. First tries { user:{id} } payload
 * 2. If backend rejects, retries with { userId }
 */
export async function createEmployeeSmart(form) {
  // Payload shape with nested user object
  const payloadUserObj = {
    user: { id: Number(form.userId) },
    firstName: form.firstName?.trim(),
    lastName: form.lastName?.trim(),
    dob: form.dob, // yyyy-MM-dd from <input type="date">
    phone: form.phone?.trim(),
    address: form.address?.trim(),
    designation: form.designation?.trim(),
    department: form.department?.trim(),
    baseSalary: form.baseSalary ? Number(form.baseSalary) : null,
  };

  try {
    const { data } = await api.post("/employees", payloadUserObj);
    return data;
  } catch (err) {
    const status = err?.response?.status;
    // If backend complains about "user" field, retry with userId directly
    if (status === 400 || status === 422) {
      const payloadUserId = {
        userId: Number(form.userId),
        firstName: payloadUserObj.firstName,
        lastName: payloadUserObj.lastName,
        dob: payloadUserObj.dob,
        phone: payloadUserObj.phone,
        address: payloadUserObj.address,
        designation: payloadUserObj.designation,
        department: payloadUserObj.department,
        baseSalary: payloadUserObj.baseSalary,
      };
      const { data } = await api.post("/employees", payloadUserId);
      return data;
    }
    throw err;
  }
}

/* ---------------------- ADDITIONS (non-breaking) ---------------------- */

/** Try to read current userId from localStorage.auth */
function currentUserId() {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.user?.id || parsed?.id || parsed?.userId || null;
  } catch {
    return null;
  }
}

/**
 * Get current employee profile.
 * Tries common patterns:
 *  - GET /employees/me
 *  - GET /employees/my
 *  - GET /employees/by-user/{userId}  (when we can read userId from local storage)
 */
export async function getMyEmployee() {
  // 1) direct "me" endpoints
  try {
    const { data } = await api.get("/employees/me");
    return data;
  } catch (e) {
    if (e?.response?.status !== 404) throw e;
  }
  try {
    const { data } = await api.get("/employees/my");
    return data;
  } catch (e) {
    if (e?.response?.status !== 404) throw e;
  }

  // 2) fallback via userId → /employees/by-user/{userId}
  const uid = currentUserId();
  if (uid != null) {
    const { data } = await api.get(`/employees/by-user/${uid}`);
    return data;
  }

  // 3) last resort: throw
  throw new Error("Unable to resolve current employee profile (no /me or userId).");
}

/**
 * PUT /employees/{employeeId} → update employee details
 */
export async function updateEmployee(employeeId, payload) {
  if (!employeeId) throw new Error("employeeId is required");
  const { data } = await api.put(`/employees/${employeeId}`, payload);
  return data;

}
export async function deleteEmployee(employeeId) {
  if (!employeeId) throw new Error("employeeId is required");
  const { data } = await api.delete(`/employees/${employeeId}`);
  return data; // many backends return void; we ignore the body anyway
}