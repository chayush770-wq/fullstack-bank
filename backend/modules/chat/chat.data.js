/* ===== MODELS ===== */

const Chat = require("./chat.model");

/* ===== SAVE MESSAGE ===== */

async function saveMessage({ userId, role, message, sessionId = "default" }) {
  return Chat.create({
    userId,
    role,
    message,
    sessionId,
  });
}

/* ===== GET CHAT HISTORY ===== */

async function getChatHistory(userId, sessionId = "default") {
  return Chat.find({
    userId,
    sessionId,
  }).sort({ createdAt: 1 });
}

/* ===== EXPORTS ===== */

module.exports = {
  saveMessage,
  getChatHistory,
};
