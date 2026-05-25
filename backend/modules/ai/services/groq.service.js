/* ===== IMPORTS ===== */

const Groq = require("groq-sdk");

/* ===== GROQ CLIENT ===== */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================================================
   Generate Content
========================================================= */

async function generateContent(prompt) {
  try {
    console.log("Calling Groq...");

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0,
    });

    const text = response.choices[0].message.content;

    console.log("Groq response:", text);

    return text;
  } catch (error) {
    console.error(error);

    return "AI_SERVICE_UNAVAILABLE";
  }
}

/* ===== EXPORTS ===== */

module.exports = {
  generateContent,
};
