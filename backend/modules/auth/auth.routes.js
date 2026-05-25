const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Auth endpoints
router.post('/register', authController.register);
router.get('/verify', authController.verify);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Update user preferences (language / currency)
router.put('/preferences', authMiddleware, authController.updatePreferences);

module.exports = router;
