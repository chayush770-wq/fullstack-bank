/* ===== Imports ===== */

const express = require('express');
const router = express.Router();

const transactionsController = require('./transactions.controller');
const authMiddleware = require('../../middleware/auth.middleware');

/* ===== Routes ===== */

router.get('/', authMiddleware, transactionsController.getTransactions);

router.post('/', authMiddleware, transactionsController.createTransaction);

/* ===== Exports ===== */

module.exports = router;