/* ===== IMPORTS ===== */

const transactionsData = require("../../../transactions/transactions.data");

/* =========================================================
   Get Transactions Node
========================================================= */

async function getTransactionsNode(state) {
  console.log("===== GET TRANSACTIONS NODE =====");

  const result = await transactionsData.getTransactionsByUser(
    state.userId,
    1,
    10,
  );

  return {
    transactions: result.transactions,

    responseType: "transactions_list",

    responseData: {
      transactions: result.transactions,
      pagination: result.pagination,
    },

    actions: [],
  };
}

/* ===== EXPORTS ===== */

module.exports = {
  getTransactionsNode,
};
