const express = require('express');
const router = express.Router();

const accountsController = require('./accounts.controller');
const authMiddleware = require('../../middleware/auth.middleware');


/* ===== Routes ===== */

// Protected route: get current account
router.get('/me', authMiddleware, accountsController.getCurrentAccount);


module.exports = router;