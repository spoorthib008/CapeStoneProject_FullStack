// src/api/payroll.js
import api from "../lib/api";

export async function getMyPay(year, month) {
  const y = Number(year), m = Number(month);
  const url = `/payroll/my/${y}/${m}`;
  console.log("GET", api.defaults.baseURL + url);
  const { data } = await api.get(url);
  return data;
}
