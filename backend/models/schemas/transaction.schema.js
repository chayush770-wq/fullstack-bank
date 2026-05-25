/* ===== Imports ===== */

const mongoose = require('mongoose');


/* ===== Transaction Schema ===== */

const transactionSchema =
    new mongoose.Schema({

        senderId: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref:
                'User',

            required:
                true
        },

        recipientId: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref:
                'User',

            required:
                true
        },

        amount: {

            type:
                Number,

            required:
                true
        },

        reason: {

            type:
                String,

            default:
                null
        },

        date: {

            type:
                Date,

            default:
                Date.now
        }

    });


/* ===== Exports ===== */

module.exports =
    transactionSchema;