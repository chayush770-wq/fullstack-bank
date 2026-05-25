/* ===== IMPORTS ===== */

const pendingActionsData = require("../../../pending-actions/pending-actions.data");

/* =========================================================
   Confirm Pending Action Node
========================================================= */

async function confirmPendingActionNode(state) {
  console.log("===== CONFIRM PENDING ACTION NODE =====");

  /* ===== Get Latest Pending Action ===== */

  const pendingAction = await pendingActionsData.getLatestPendingAction(
    state.userId,
  );

  /* ===== No Pending Action ===== */

  if (!pendingAction) {
    return {
      responseType: "no_pending_action",

      responseData: {},

      actions: [],
    };
  }

  /* ===== Expired ===== */

  const isExpired = new Date(pendingAction.expiresAt) < new Date();

  if (isExpired) {
    await pendingActionsData.updatePendingActionStatus(
      pendingAction._id,
      "expired",
    );

    return {
      responseType: "pending_action_expired",

      responseData: {},

      actions: [],
    };
  }

  /* ===== Mark Confirmed ===== */

  await pendingActionsData.updatePendingActionStatus(
    pendingAction._id,
    "confirmed",
  );

  /* ===== Continue Workflow ===== */

  return {
    pendingAction,

    amount: pendingAction.payload.amount,

    recipientEmail: pendingAction.payload.recipientEmail,

    recipientName: pendingAction.payload.recipientName,

    reason: pendingAction.payload.reason,
  };
}

/* ===== EXPORTS ===== */

module.exports = {
  confirmPendingActionNode,
};
