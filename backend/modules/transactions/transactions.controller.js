/* ===== IMPORTS ===== */

const transactionsData = require("./transactions.data");

const { isValidPagination } = require("../../utils/validation");

/* =========================================================
   Get Transactions
========================================================= */

async function getTransactions(req, res) {
  try {
    const userId = req.user.userId;

    const page = req.query.page === undefined ? 1 : Number(req.query.page);

    const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

    const counterparty = req.query.counterparty;

    if (!isValidPagination(page, limit)) {
      return res.status(400).json({
        message: "Invalid page or limit",
      });
    }

    const result = await transactionsData.getTransactionsByUser(
      userId,
      page,
      limit,
      counterparty,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("GET /api/transactions failed:", error);

    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
}

/* =========================================================
   Create Transaction
========================================================= */

async function createTransaction(req, res) {
  try {
    const senderId = req.user.userId;

    const { recipientEmail, amount, reason } = req.body;

    const result = await transactionsData.createTransaction(
      senderId,
      recipientEmail,
      amount,
      reason,
    );

    const io = req.app.get("io");

    if (io) {
      io.emit("transactions-updated", {
        message: "Transactions updated",
      });
    }

    return res.status(201).json({
      message: "Transaction successful",

      newBalance: result.newBalance,

      transaction: result.transaction,
    });
  } catch (error) {
    console.error("GET /api/transactions failed:", error);

    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
}

/* ===== EXPORTS ===== */

module.exports = {
  getTransactions,
  createTransaction,
};
