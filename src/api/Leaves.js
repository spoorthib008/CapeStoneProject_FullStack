// src/api/leaves.js
import api from "../lib/api";

/**
 * Get my leaves (optionally for a given year).
 * Tries:
 *  - GET /leaves/my?year=YYYY
 *  - GET /leaves/my (and you can filter by year on client)
 */
export async function getMyLeaves(year) {
  // try with year param first
  try {
    const { data } = await api.get("/leaves/my", {
      params: year ? { year: Number(year) } : undefined,
    });
    return Array.isArray(data) ? data : [];
  } catch (e) {
    if (e?.response?.status !== 404) throw e;
  }
  // fallback without param
  const { data } = await api.get("/leaves/my");
  return Array.isArray(data) ? data : [];
}

/** Optional: tiny helper to summarize leaves for a given year */
export function summarizeLeaves(leaves, year = new Date().getFullYear()) {
  const y = Number(year);
  const approved = (leaves || []).filter((l) => {
    // Accept either explicit year on fields, or parse dates if present
    const from = l.fromDate || l.startDate || l.from || l.dateFrom;
    const yr = from ? new Date(from).getFullYear() : y;
    const status = (l.status || l.state || "").toUpperCase();
    return yr === y && (status === "APPROVED" || status === "APPROVE" || status === "GRANTED");
  });
  return { approvedCount: approved.length };
}
/** GET /leave/{leaveId} */
export async function getLeaveById(leaveId) {
  if (!leaveId) throw new Error("leaveId is required");
  const { data } = await api.get(`/leave/${leaveId}`);
  return data;
}

/** PATCH /leave/{leaveId}  (approve / reject) */
export async function setLeaveStatus(leaveId, status) {
  if (!leaveId) throw new Error("leaveId is required");
  const { data } = await api.patch(`/leave/${leaveId}`, { status });
  return data;
}