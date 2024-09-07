const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { register, login, logout, forgotPassword, resetPassword, changePassword, verifyEmail } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/change-password', protect, changePassword);
router.get('/verify-email/:token', protect, verifyEmail);

router.get('/check', protect, (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
});

module.exports = router;
