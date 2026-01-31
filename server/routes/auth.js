const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, updateTwilioConfig } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, updateProfile);
router.put('/twilio', authMiddleware, updateTwilioConfig);

module.exports = router;
