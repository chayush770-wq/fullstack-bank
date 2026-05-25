/* ===== IMPORTS ===== */

const authData = require("../../../auth/auth.data");

const transactionsData = require("../../../transactions/transactions.data");

/* =========================================================
   Evaluate Account Node
========================================================= */

async function evaluateAccountNode(state) {
  const user = await authData.getUserById(state.userId);

  if (!user) {
    return {
      reply: "User not found",
      accountFound: false,
    };
  }

  const transactionsResult = await transactionsData.getTransactionsByUser(
    state.userId,
    1,
    5,
  );

  return {
    accountFound: true,

    balance: user.balance,

    transactions: transactionsResult.transactions,
  };
}

/* ===== EXPORTS ===== */

module.exports = {
  evaluateAccountNode,
};
