/* ===== EXPRESS ===== */

const express = require("express");

const router = express.Router();

/* ===== CONTROLLER ===== */

const { sendChatMessage, getChatHistory } = require("./chat.controller");

/* ===== MIDDLEWARE ===== */

const authMiddleware = require('../../middleware/auth.middleware');

/* ===== ROUTES ===== */

router.post("/", authMiddleware, sendChatMessage);

router.get("/history", authMiddleware, getChatHistory);

/* ===== EXPORTS ===== */

module.exports = router;
