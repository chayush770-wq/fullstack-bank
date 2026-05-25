/* =========================================================
   Return Response Node
========================================================= */

async function returnResponseNode(state) {
  console.log("===== RETURN RESPONSE NODE =====");

  const languageRaw = (
    state.preferredLanguage ||
    state.preferredLocale ||
    "he"
  ).toString();

  const language = /^en/i.test(languageRaw) ? "en" : "he";

  const currency = state.preferredCurrency || state.currency || "USD";

  const currencySymbols = {
    USD: "$",
    ILS: "₪",
    EUR: "€",
  };

  const currencySymbol = currencySymbols[currency] || currency;

  const intent = state.responseType || state.intent || "unknown";

  const getTransactionsText = () => {
    const txs = state.transactions || [];

    if (!txs.length) {
      return language === "he"
        ? "לא נמצאו פעולות אחרונות."
        : "No recent transactions found.";
    }

    return language === "he"
      ? "אלו הפעולות האחרונות שלך."
      : "Here are your latest transactions.";
  };

  const messages = {
    check_balance: {
      he:
        state.balance !== undefined && state.balance !== null
          ? `יתרתך היא ${state.balance} ${currencySymbol}.`
          : "לא הצלחתי לאתר את היתרה שלך כרגע.",

      en:
        state.balance !== undefined && state.balance !== null
          ? `Your balance is ${state.balance} ${currencySymbol}.`
          : "I couldn't find your balance right now.",
    },

    get_transactions: {
      he: getTransactionsText,
      en: getTransactionsText,
    },

    view_transactions: {
      he: getTransactionsText,
      en: getTransactionsText,
    },

    transactions_list: {
      he: getTransactionsText,
      en: getTransactionsText,
    },

    transfer_money: {
      he: state.pendingAction
        ? "בקשת העברה נוצרה ומחכה לאישור."
        : "בקשת העברה התקבלה.",

      en: state.pendingAction
        ? "A transfer request was created and is pending approval."
        : "Transfer request received.",
    },

    transfer_confirmation: {
      he: () => {
        const data = state.responseData || {};
        const recipient =
          data.recipient ||
          state.recipientEmail ||
          state.recipientName ||
          "הנמען";

        const amount = data.amount ?? state.amount ?? "?";

        return `לאשר העברה של ${amount} ${currencySymbol} אל ${recipient}?`;
      },

      en: () => {
        const data = state.responseData || {};
        const recipient =
          data.recipient ||
          state.recipientEmail ||
          state.recipientName ||
          "the recipient";

        const amount = data.amount ?? state.amount ?? "?";

        return `Confirm transfer of ${amount} ${currencySymbol} to ${recipient}?`;
      },
    },

    transfer_success: {
      he: () => {
        const data = state.responseData || {};

        return data.newBalance !== undefined && data.newBalance !== null
          ? `ההעברה בוצעה בהצלחה. יתרה חדשה: ${data.newBalance} ${currencySymbol}.`
          : "ההעברה בוצעה בהצלחה.";
      },

      en: () => {
        const data = state.responseData || {};

        return data.newBalance !== undefined && data.newBalance !== null
          ? `Transfer completed. New balance: ${data.newBalance} ${currencySymbol}.`
          : "Transfer completed.";
      },
    },

    transfer_failed: {
      he: () => {
        const error = state.responseData && state.responseData.error;

        return error ? `ההעברה נכשלה: ${error}` : "ההעברה נכשלה.";
      },

      en: () => {
        const error = state.responseData && state.responseData.error;

        return error ? `Transfer failed: ${error}` : "Transfer failed.";
      },
    },

    risk_blocked: {
      he: "לא ניתן להשלים את ההעברה הזו.",
      en: "This transfer cannot be completed.",
    },

    no_pending_action: {
      he: "אין פעולה שממתינה לאישור.",
      en: "There is no pending action to confirm.",
    },

    pending_action_expired: {
      he: "האישור פג תוקף. יש להתחיל מחדש.",
      en: "This confirmation expired. Please start again.",
    },

    confirm_transfer: {
      he: "העברה אושרה ומתבצעת כעת.",
      en: "The transfer has been confirmed and is being processed.",
    },

    cancel_transfer: {
      he: "העברה בוטלה.",
      en: "The transfer was cancelled.",
    },

    unknown: {
      he: "מצטער, לא הבנתי את הבקשה שלך.",
      en: "Sorry, I didn't understand your request.",
    },
  };

  const replyEntry = messages[intent] || messages.unknown;

  const reply =
    typeof replyEntry[language] === "function"
      ? replyEntry[language]()
      : replyEntry[language];

  return {
    reply,

    responseType: intent,

    responseData: {
      ...(state.responseData || {}),

      balance: state.balance,

      transactions: state.transactions,

      currency,
    },

    actions: state.actions || [],
  };
}

/* ===== EXPORTS ===== */

module.exports = {
  returnResponseNode,
};
