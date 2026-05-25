/* ===== ACCOUNTS DATA ===== */

const authData = require("../auth/auth.data");


/* ===== GET ACCOUNT BY USER ID ===== */

async function getAccountByUserId(userId) {
  const user = await authData.getUserById(userId);

  if (!user) {
    return null;
  }

  return {
    id: user._id,

    fullName: user.fullName,

    email: user.email,

    balance: user.balance,

    preferredLanguage: user.preferredLanguage || 'he',

    preferredCurrency: user.preferredCurrency || 'USD',

    transactions: [],

    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  };
}


/* ===== EXPORT ===== */

module.exports = {
  getAccountByUserId,
};