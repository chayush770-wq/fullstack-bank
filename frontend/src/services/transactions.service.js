/* ===== API CONFIG ===== */

import { API_URL } from "./api.config";


/* ===== TRANSACTIONS SERVICE ===== */

export async function getTransactions() {
  return fetch(`${API_URL}/api/transactions?page=1&limit=20`, {
    method: "GET",
    credentials: "include",
  });
}

export async function createTransaction(data) {
  return fetch(`${API_URL}/api/transactions`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}