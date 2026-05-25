/* ===== Imports ===== */

const mongoose = require('mongoose');

const transactionSchema =
    require('./schemas/transaction.schema');


/* ===== Transaction Model ===== */

const Transaction =
    mongoose.model('Transaction', transactionSchema);


/* ===== Exports ===== */

module.exports = Transaction;