// src/api/reports.js
import api from "../lib/api";

function nm(n) { return Number(n); }

export async function getPayrollSummary(year, month) {
  const y = nm(year), m = nm(month);
  const qs = new URLSearchParams({ year: String(y), month: String(m) }).toString();
  const url = `/reports/payroll-summary?${qs}`;
  console.log("GET", api.defaults.baseURL + url);
  const { data } = await api.get(url);
  return data;
}

export async function getDepartmentCost(year, month) {
  const y = nm(year), m = nm(month);
  const qs = new URLSearchParams({ year: String(y), month: String(m) }).toString();
  const url = `/reports/department-cost?${qs}`;
  console.log("GET", api.defaults.baseURL + url);
  const { data } = await api.get(url);
  return data;
}
