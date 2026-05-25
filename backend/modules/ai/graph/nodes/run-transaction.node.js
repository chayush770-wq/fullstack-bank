/* ===== IMPORTS ===== */

const transactionsData = require("../../../transactions/transactions.data");

/* =========================================================
   Run Transaction Node
========================================================= */

async function runTransactionNode(state) {
  console.log("===== RUN TRANSACTION NODE =====");

  try {
    /* ===== Execute Transaction ===== */

    const result = await transactionsData.createTransaction(
      state.userId,
      state.recipientEmail,
      state.amount,
      state.reason || "",
    );

    /* ===== SOCKET EVENTS ===== */

    const io = state.io;

    if (io) {
      console.log("Emitting transactions-updated", {
        userId: state.userId,
        newBalance: result.newBalance,
      });

      io.emit("transactions-updated", {
        userId: state.userId,
        newBalance: result.newBalance,
        transaction: result.transaction,
      });
    }

    /* ===== Success Response ===== */

    return {
      transferResult: result,

      balance: result.newBalance,

      responseType: "transfer_success",

      responseData: {
        amount: state.amount,
        recipient: state.recipientEmail,
        reason: state.reason,
        newBalance: result.newBalance,
      },

      actions: [],
    };
  } catch (error) {
    console.log("Transaction error:", error.message);

    return {
      responseType: "transfer_failed",

      responseData: {
        error: error.message,
      },

      actions: [],
    };
  }
}

/* ===== EXPORTS ===== */

module.exports = {
  runTransactionNode,
};
