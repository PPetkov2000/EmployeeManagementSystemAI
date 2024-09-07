const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendEmail } = require('../utils/email');
const logger = require('../utils/logger');
const { jwt_expire, email_verification } = require('../config');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  logger.info(`Attempting to register user: ${email}`);

  const userExists = await User.findOne({ email });
  if (userExists) {
    logger.warn(`Registration failed: Email already in use: ${email}`);
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomBytes(20).toString('hex');
  const user = await User.create({ name, email, password: hashedPassword, verificationToken });
  logger.info(`User registered successfully: ${user._id}`);

  if (email_verification) {
    // Send verification email
    // const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    // await sendEmail(email, 'Verify Your Email', `Click here to verify your email: ${verificationLink}`);
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: jwt_expire });

  res.cookie('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: jwt_expire
  });

  res.status(201).json({ token, user, message: 'Registration successful.' });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  logger.info(`Login attempt for user: ${email}`);

  const user = await User.findOne({ email });

  if (!user || !await bcrypt.compare(password, user.password)) {
    logger.warn(`Login failed for user: ${email}`);
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  if (email_verification && !user.isVerified) {
    logger.warn(`Please verify your email before logging in: ${email}`);
    return res.status(401).json({ message: 'Please verify your email before logging in.' });
  }

  logger.info(`User logged in successfully: ${user._id}`);

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: jwt_expire });

  res.cookie('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: jwt_expire
  });

  res.json({ token, user, message: 'Login successful.' });
});

const logout = asyncHandler(async (req, res) => {
    res.clearCookie('auth-token');
    res.json({ message: 'Logged out successfully' });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  logger.info(`Password reset requested for: ${email}`);

  const user = await User.findOne({ email });
  if (!user) {
    logger.warn(`Password reset failed: User not found: ${email}`);
    return res.status(404).json({ message: 'User not found' });
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
  await sendEmail(user.email, 'Password Reset', `Reset your password here: ${resetUrl}`);

  logger.info(`Password reset email sent to: ${email}`);
  res.json({ message: 'Password reset email sent' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  logger.info(`Attempting to reset password with token: ${token}`);

  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    logger.warn(`Password reset failed: Invalid or expired token: ${token}`);
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  logger.info(`Password reset successful for user: ${user._id}`);
  res.json({ message: 'Password reset successful' });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  logger.info(`Attempting to change password for user: ${req.user._id}`);

  const user = await User.findById(req.userId);

  if (!user || !await bcrypt.compare(currentPassword, user.password)) {
    logger.warn(`Password change failed for user: ${user._id}`);
    return res.status(401).json({ message: 'Invalid current password.' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  logger.info(`Password changed successfully for user: ${user._id}`);
  res.json({ message: 'Password changed successfully' });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });
  
  if (!user) {
    logger.warn(`Email verification failed: Invalid or expired token: ${token}`);
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  if (user.isVerified) {
    logger.warn(`Email already verified for user: ${user._id}`);
    return res.status(400).json({ message: 'Email already verified' });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  logger.info(`Email verified successfully for user: ${user._id}`);
  res.json({ message: 'Email verified successfully.' });
});

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail
};