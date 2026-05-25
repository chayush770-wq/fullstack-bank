const mongoose = require("mongoose");

/* =========================================================
   Pending Action Schema
========================================================= */

const pendingActionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    type: {
      type: String,
      required: true,
    },

    payload: {
      type: Object,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "expired"],
      default: "pending",
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/* ===== EXPORT ===== */

const PendingAction = mongoose.model("PendingAction", pendingActionSchema);

module.exports = PendingAction;
