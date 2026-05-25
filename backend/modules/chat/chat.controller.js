/* ===== SERVICE ===== */

const { sendMessage, loadChatHistory } = require("./chat.service");

/* ===== SEND CHAT MESSAGE ===== */

async function sendChatMessage(req, res) {
  try {
    console.log("CHAT REQ USER:", req.user);

    const { message } = req.body;

    const userId = req.user.userId;

    const io = req.app.get("io");

    const result = await sendMessage({
      userId,
      message,
      io,
    });

    return res.json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to process chat message",
    });
  }
}

/* ===== GET CHAT HISTORY ===== */

async function getChatHistory(req, res) {
  try {
    const userId = req.user.userId;

    const history = await loadChatHistory(userId);

    return res.json(history);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to load chat history",
    });
  }
}

/* ===== EXPORTS ===== */

module.exports = {
  sendChatMessage,
  getChatHistory,
};
