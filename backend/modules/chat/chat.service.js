/* ===== AI GRAPH ===== */

const { bankingGraph } = require("../ai/graph/banking.graph");

/* ===== DATA ===== */

const { saveMessage, getChatHistory } = require("./chat.data");
const authData = require("../auth/auth.data");

/* ===== SEND MESSAGE ===== */

async function sendMessage({ userId, message, io }) {
  /* ===== SAVE USER MESSAGE ===== */

  await saveMessage({
    userId,
    role: "user",
    message,
  });

  /* ===== RUN AI GRAPH ===== */

  // Load user preferences (language / currency) to pass into the graph
  let preferredLanguage = undefined;
  let preferredCurrency = undefined;

  try {
    const user = await authData.getUserById(userId);
    if (user) {
      preferredLanguage = user.preferredLanguage;
      preferredCurrency = user.preferredCurrency;
    }
  } catch (e) {
    // ignore - graph can work without preferences
  }

  const result = await bankingGraph.invoke({
    userId,
    message,
    io,
    preferredLanguage,
    preferredCurrency,
  });

  /* ===== SAVE AI MESSAGE ===== */

  const assistantMessage =
    result.reply ||
    result.response ||
    result.answer ||
    "Something went wrong";

  await saveMessage({
    userId,
    role: "assistant",
    message: assistantMessage,
  });

  /* ===== PREVENT SOCKET.IO CIRCULAR JSON ===== */

  delete result.io;

  /* ===== NORMALIZE RESPONSE FOR FRONTEND ===== */

  result.reply = assistantMessage;

  /* ===== RETURN RESULT ===== */

  return result;
}

/* ===== GET CHAT HISTORY ===== */

async function loadChatHistory(userId) {
  return getChatHistory(userId);
}

/* ===== EXPORTS ===== */

module.exports = {
  sendMessage,
  loadChatHistory,
};

// create function that sends AI response
