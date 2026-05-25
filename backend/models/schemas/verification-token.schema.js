/* ===== Imports ===== */

const mongoose = require('mongoose');


/* ===== Verification Token Schema ===== */

const verificationTokenSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    token: {
        type: String,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    },

    usedAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});


/* ===== Exports ===== */

module.exports = verificationTokenSchema;