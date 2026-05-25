/* ===== IMPORTS ===== */

const PendingAction = require("./pending-action.model");

/* =========================================================
   Create Pending Action
========================================================= */

async function createPendingAction(data) {
  return PendingAction.create(data);
}

/* =========================================================
   Get Latest Pending Action
========================================================= */

async function getLatestPendingAction(userId) {
  return PendingAction.findOne({
    userId,
    status: "pending",
  }).sort({ createdAt: -1 });
}

/* =========================================================
   Update Pending Action Status
========================================================= */

async function updatePendingActionStatus(id, status) {
  return PendingAction.findByIdAndUpdate(
    id,
    {
      status,
    },
    {
      new: true,
    },
  );
}

/* ===== EXPORTS ===== */

module.exports = {
  createPendingAction,
  getLatestPendingAction,
  updatePendingActionStatus,
};
