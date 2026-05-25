/* ===== IMPORTS ===== */

const pendingActionsData = require("../../../pending-actions/pending-actions.data");

/* =========================================================
   Request Confirmation Node
========================================================= */

async function requestConfirmationNode(state) {
  console.log("===== REQUEST CONFIRMATION NODE =====");

  /* ===== Risk Block ===== */

  if (state.riskLevel !== "low") {
    return {
      needsConfirmation: false,

      pendingAction: null,

      responseType: "risk_blocked",

      responseData: {},

      actions: [],
    };
  }

  /* ===== Create Pending Action ===== */

  const expiresAt = new Date(Date.now() + 1000 * 60 * 5);

  const pendingAction = await pendingActionsData.createPendingAction({
    userId: state.userId,

    type: "transfer_money",

    payload: {
      amount: state.amount,

      recipientEmail: state.recipientEmail,

      recipientName: state.recipientName,

      reason: state.reason,
    },

    expiresAt,
  });

  /* ===== Response ===== */

  return {
    needsConfirmation: true,

    pendingAction,

    responseType: "transfer_confirmation",

    responseData: {
      actionId: pendingAction._id,

      amount: state.amount,

      recipient:
        state.recipientEmail || state.recipientName,

      reason: state.reason,
    },

    actions: [
      {
        type: "confirm_transfer",
      },

      {
        type: "cancel_transfer",
      },
    ],
  };
}

/* ===== EXPORTS ===== */

module.exports = {
  requestConfirmationNode,
};