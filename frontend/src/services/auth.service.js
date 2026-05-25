/* ===== API CONFIG ===== */

import { API_URL } from "./api.config";


/* ===== AUTH SERVICE ===== */

export async function logoutUser() {
  return fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function updateUserPreferences(preferredLanguage, preferredCurrency) {
  return fetch(`${API_URL}/api/auth/preferences`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ preferredLanguage, preferredCurrency }),
  });
}