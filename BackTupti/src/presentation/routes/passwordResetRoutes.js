const express = require('express');
const router = express.Router();
const PasswordResetController = require('../controllers/PasswordResetController');

router.post('/forgot-password', PasswordResetController.forgotPassword);
router.post('/reset-password', PasswordResetController.resetPassword);

module.exports = router;