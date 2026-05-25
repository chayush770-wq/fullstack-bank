/* ===== Imports ===== */

const { isValidEmail, isValidPhone } = require("../../utils/validation");

const User = require("../../models/user.model");

const VerificationToken = require("../../models/verification-token.model");

/* =========================================================
   Get User By Email
========================================================= */

async function getUserByEmail(email) {
  return await User.findOne({ email });
}

/* =========================================================
   Get User By Id
========================================================= */

async function getUserById(id) {
  return await User.findById(id);
}

/* =========================================================
   Create Verification Token
========================================================= */

async function createVerificationTokenForUser(userId, token) {
  await VerificationToken.updateMany(
    {
      userId: userId,
      usedAt: null,
    },
    {
      usedAt: new Date(),
    },
  );

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  return await VerificationToken.create({
    userId: userId,
    token: token,
    expiresAt: expiresAt,
    usedAt: null,
  });
}

/* =========================================================
   Get Valid Verification Token
========================================================= */

async function getValidVerificationToken(token) {
  const now = new Date();

  return await VerificationToken.findOne({
    token: token,
    usedAt: null,
    expiresAt: {
      $gt: now,
    },
  });
}

/* =========================================================
   Create User
========================================================= */

async function createUser(fullName, email, password, phone) {
  if (!fullName || fullName.trim().length < 2) {
    throw new Error("Full name must contain at least 2 characters");
  }

  if (!isValidEmail(email)) {
    throw new Error("Invalid email");
  }

  if (!isValidPhone(phone)) {
    throw new Error("Invalid phone");
  }

  const newUser = await User.create({
    fullName: fullName,

    email: email,

    password: password,

    phone: phone,

    balance: 1000,

    isVerified: false,
  });

  return newUser;
}

/* =========================================================
   Verify User
========================================================= */

async function verifyUser(user, verificationTokenDocument) {
  user.isVerified = true;

  await user.save();

  verificationTokenDocument.usedAt = new Date();

  await verificationTokenDocument.save();

  return user;
}

/* =========================================================
   Update User Balance
========================================================= */

async function updateUserBalance(user, newBalance) {
  user.balance = newBalance;

  await user.save();

  return user;
}

/* =========================================================
   Update User Preferences
========================================================= */

async function updateUserPreferences(userId, prefs) {
  const user = await User.findById(userId);

  if (!user) throw new Error('User not found');

  if (prefs.preferredLanguage !== undefined) {
    user.preferredLanguage = prefs.preferredLanguage;
  }

  if (prefs.preferredCurrency !== undefined) {
    user.preferredCurrency = prefs.preferredCurrency;
  }

  await user.save();

  return user;
}

/* ===== Exports ===== */

module.exports = {
  getUserByEmail,
  getUserById,
  createVerificationTokenForUser,
  getValidVerificationToken,
  createUser,
  verifyUser,
  updateUserBalance,
  updateUserPreferences,
};
