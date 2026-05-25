/* =========================================================
   Route By Intent
========================================================= */

function routeByIntent(state) {
  /* ===== Check Balance ===== */

  if (state.intent === "check_balance") {
    return "evaluate_account";
  }

  /* ===== Transfer Money ===== */

  if (state.intent === "transfer_money") {
    return "evaluate_account";
  }

  /* ===== View Transactions ===== */

  if (state.intent === "view_transactions") {
    return "get_transactions";
  }

  /* ===== Confirm Transfer ===== */

  if (state.intent === "confirm_transfer") {
    return "confirm_pending_action";
  }

  /* ===== Cancel Transfer ===== */

  if (state.intent === "cancel_transfer") {
    return "cancel_pending_action";
  }

  /* ===== Unknown ===== */

  return "return_response";
}

/* ===== EXPORTS ===== */

module.exports = {
  routeByIntent,
};
