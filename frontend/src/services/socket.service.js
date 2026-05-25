/* ===== SOCKET.IO ===== */

import { io } from "socket.io-client";

/* ===== API CONFIG ===== */

import { API_URL } from "./api.config";


/* ===== SOCKET CONNECTION ===== */

export const socket = io(API_URL, {
  withCredentials: true,
});