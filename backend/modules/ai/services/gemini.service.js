/* ===== IMPORTS ===== */

const { GoogleGenAI } = require("@google/genai");

/* ===== GEMINI CLIENT ===== */

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* =========================================================
   Generate Content
========================================================= */

async function generateContent(prompt) {
  try {
    console.log("Calling Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: prompt,
    });

    console.log("Gemini response:", response.text);

    return response.text;
  } catch (error) {
    console.error(error);

    return "AI_SERVICE_UNAVAILABLE";
  }
}

/* =========================================================
   Generate Banking Reply
========================================================= */

async function generateBankingReply(state) {
  const prompt = `

You are a professional banking AI assistant.

User intent:
${state.intent}

User balance:
${state.balance}

Recent transactions:
${JSON.stringify(state.transactions)}

Generate a short helpful banking response.

`;

  const response = await generateContent(prompt);

  if (response === "AI_SERVICE_UNAVAILABLE") {
    if (state.intent === "check_balance") {
      return `Your current balance is $${state.balance}`;
    }

    return "I'm currently having trouble generating a smart response.";
  }

  return response.trim();
}

/* ===== EXPORTS ===== */

module.exports = {
  generateContent,
  generateBankingReply,
};
