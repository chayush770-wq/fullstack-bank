/* =========================================================
   Risk Assessment Node
========================================================= */

async function riskAssessmentNode(state) {
  if (!state.accountFound) {
    return {
      riskLevel: "high",
      reply: "לא נמצא חשבון משתמש.",
    };
  }

  if (!state.amount) {
    return {
      riskLevel: "medium",
      reply: "חסר סכום להעברה.",
    };
  }

  if (!state.recipientEmail && !state.recipientName) {
    return {
      riskLevel: "medium",
      reply: "חסר נמען להעברה.",
    };
  }

  if (Number(state.amount) > Number(state.balance)) {
    return {
      riskLevel: "high",
      reply: "אין מספיק יתרה לביצוע ההעברה.",
    };
  }

  if (Number(state.amount) > 5000) {
    return {
      riskLevel: "high",
      reply: "העברה בסכום גבוה דורשת אימות נוסף.",
    };
  }

  return {
    riskLevel: "low",
  };
}

/* ===== EXPORTS ===== */

module.exports = {
  riskAssessmentNode,
};
