/* ===== MONGOOSE ===== */

const mongoose = require("mongoose");

/* ===== CHAT MESSAGE SCHEMA ===== */

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    sessionId: {
      type: String,
      default: "default",
    },
  },

  {
    timestamps: true,
  },
);

/* ===== MODEL ===== */

const Chat = mongoose.model("Chat", chatSchema);

/* ===== EXPORTS ===== */

module.exports = Chat;
