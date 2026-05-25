/* ===== API CONFIG ===== */

import { API_URL } from "./api.config";


/* ===== ACCOUNTS SERVICE ===== */

export async function getMyAccount() {
  return fetch(`${API_URL}/api/accounts/me`, {
    method: "GET",
    credentials: "include",
  });
}