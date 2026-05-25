/* ===== IMPORTS ===== */

const { Annotation } = require("@langchain/langgraph");

/* ===== BANKING STATE ===== */

const BankingState = Annotation.Root({
  /* ===== USER / LLM ===== */

  userId: Annotation(),

  message: Annotation(),

  intent: Annotation(),

  preferredLanguage: Annotation(),

  preferredCurrency: Annotation(),

  amount: Annotation(),

  recipientEmail: Annotation(),

  recipientName: Annotation(),

  reason: Annotation(),

  /* ===== DATABASE ===== */

  balance: Annotation(),

  transactions: Annotation(),

  accountFound: Annotation(),

  /* ===== WORKFLOW ===== */

  riskLevel: Annotation(),

  needsConfirmation: Annotation(),

  pendingAction: Annotation(),

  io: Annotation(),

  /* ===== FRONTEND RESPONSE ===== */

  responseType: Annotation(),

  responseData: Annotation(),

  actions: Annotation(),

  reply: Annotation(),

  /* ===== TRANSACTION RESULT ===== */

  transferResult: Annotation(),
});

/* ===== EXPORTS ===== */

module.exports = {
  BankingState,
};
