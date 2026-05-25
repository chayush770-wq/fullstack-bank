const authData = require("./auth.data");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authMiddleware = require("../../middleware/auth.middleware");

const { sendVerificationEmail } = require("../../services/email.service");

/* ===== TOKEN GENERATORS ===== */

function createVerificationToken() {
  return Math.random().toString(36).substring(2);
}

function createJwtToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

/* ===== AUTH COOKIE ===== */

function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,

    secure: isProduction,

    sameSite: isProduction ? "none" : "lax",

    maxAge: 60 * 60 * 1000,
  });
}

/* ===== REGISTER ===== */

async function register(req, res) {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({
        message: "Missing required field",
      });
    }

    const existingUser = await authData.getUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await authData.createUser(
      fullName,
      email,
      hashedPassword,
      phone,
    );

    const verificationToken = createVerificationToken();

    const tokenDocument = await authData.createVerificationTokenForUser(
      newUser._id,
      verificationToken,
    );

    const verificationLink = `${process.env.APP_BASE_URL}/api/auth/verify?token=${tokenDocument.token}`;

    await sendVerificationEmail(email, verificationLink);

    return res.status(201).json({
      message: `Verification email sent to ${email}`,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

/* ===== VERIFY ===== */

async function verify(req, res) {
  try {
    const token = req.query.token;

    if (!token) {
      return res.redirect(`${process.env.FRONTEND_URL}/?verified=missing`);
    }

    const verificationTokenDocument =
      await authData.getValidVerificationToken(token);

    if (!verificationTokenDocument) {
      return res.redirect(`${process.env.FRONTEND_URL}/?verified=invalid`);
    }

    const user = await authData.getUserById(verificationTokenDocument.userId);

    if (!user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/?verified=user-not-found`,
      );
    }

    const verifiedUser = await authData.verifyUser(
      user,
      verificationTokenDocument,
    );

    const jwtToken = createJwtToken(verifiedUser);

    setAuthCookie(res, jwtToken);

    return res.redirect(`${process.env.FRONTEND_URL}/?verified=success`);
  } catch {
    return res.redirect(`${process.env.FRONTEND_URL}/?verified=error`);
  }
}

/* ===== LOGIN ===== */

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing required field",
      });
    }

    const user = await authData.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account not verified",
      });
    }

    const jwtToken = createJwtToken(user);

    setAuthCookie(res, jwtToken);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        balance: user.balance,
        preferredLanguage: user.preferredLanguage || "he",
        preferredCurrency: user.preferredCurrency || "USD",
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

/* ===== LOGOUT ===== */

function logout(req, res) {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,

    secure: isProduction,

    sameSite: isProduction ? "none" : "lax",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
}

/* ===== UPDATE PREFERENCES ===== */

async function updatePreferences(req, res) {
  try {
    const userId = req.user && req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { preferredLanguage, preferredCurrency } = req.body;

    const updatedUser = await authData.updateUserPreferences(userId, {
      preferredLanguage,
      preferredCurrency,
    });

    return res.status(200).json({
      message: "Preferences updated",
      user: {
        id: updatedUser._id,
        preferredLanguage: updatedUser.preferredLanguage,
        preferredCurrency: updatedUser.preferredCurrency,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/* ===== EXPORTS ===== */

module.exports = {
  register,
  verify,
  login,
  logout,
  updatePreferences,
};
