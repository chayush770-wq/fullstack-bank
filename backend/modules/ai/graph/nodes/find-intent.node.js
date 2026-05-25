/* ===== IMPORTS ===== */

const { generateContent } = require("../../services/groq.service");
/* =========================================================
   Safe JSON Parse
========================================================= */

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

/* =========================================================
   Find Intent Node
========================================================= */

async function findIntentNode(state) {
  console.log("===== FIND INTENT NODE =====");
  console.log("User message:", state.message);

  const prompt = `
You are a banking assistant parser.

Your ONLY job is to convert the user's message into structured JSON.

Possible intents:
- check_balance
- transfer_money
- view_transactions
- confirm_transfer
- cancel_transfer
- unknown

Return ONLY valid JSON.
Do not add markdown.
Do not add explanation.

JSON shape:
{
  "intent": "check_balance | transfer_money | view_transactions | confirm_transfer | cancel_transfer | unknown",
  "amount": null,
  "recipientEmail": null,
  "recipientName": null,
  "reason": null
}

Important Hebrew transfer examples:
- "תעבירי 50 ל demo@test.com עבור בדיקה"
  => amount: 50, recipientEmail: "demo@test.com", reason: "בדיקה"
- "עבור demo@test.com תעבירי 50 ל בדיקה"
  => amount: 50, recipientEmail: "demo@test.com", reason: "בדיקה"
- "שלחי 20 למשה עבור אוכל"
  => amount: 20, recipientName: "משה", reason: "אוכל"

Rules:
- If the user asks for balance, intent is check_balance.
- If the user asks to transfer/send/pay money, intent is transfer_money.
- Hebrew words like "תעביר", "תעבירי", "שלח", "שלחי", "תשלום", "העברה" usually mean transfer_money.
- If the user asks to see recent transactions, intent is view_transactions.
- If the user says yes/confirm/approve/כן/מאשרת/מאשר/אישור, intent is confirm_transfer.
- If the user says no/cancel/לא/בטל/בטלי, intent is cancel_transfer.
- Extract amount if any number appears in a transfer request.
- Extract recipientEmail if an email appears anywhere in the sentence.
- Extract recipientName only if a person name appears and no recipientEmail appears.
- Extract reason from words after עבור / בגלל / על / for / reason.
- In Hebrew transfer text, the word "ל" before a reason does NOT always mean recipient.
- Use null for missing values.
- Do not ask follow-up questions. Only parse.

User message:
"${state.message}"
`;

  const response = await generateContent(prompt);

  const cleanResponse = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  console.log("Gemini parsed response:", cleanResponse);

  const parsed = safeJsonParse(cleanResponse);

  if (!parsed) {
    return {
      intent: "unknown",
      responseType: "unknown",
      responseData: {},
      actions: [],
    };
  }

  console.log("Detected intent:", parsed.intent);

  return {
    intent: parsed.intent || "unknown",
    amount: parsed.amount ?? null,
    recipientEmail: parsed.recipientEmail ?? null,
    recipientName: parsed.recipientName ?? null,
    reason: parsed.reason ?? null,
  };
}

/* ===== EXPORTS ===== */

module.exports = {
  findIntentNode,
};
