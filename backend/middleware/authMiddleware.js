const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const { cookie_auth } = require('../config');

const protect = async (req, res, next) => {
  let token;

  if (cookie_auth) {
    token = req.cookies['auth-token'];
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      logger.info(`Authenticated user: ${req.user._id}`);
      next();
    } catch (error) {
      logger.error(`Authentication failed: ${error.message}`);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    logger.warn('Authentication failed: No token provided');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Authorization failed: User not found in request');
      return res.status(401).json({ message: 'Not authorized' });
    }
    if (!roles.includes(req.user.role)) {
      logger.warn(`Authorization failed: User ${req.user._id} does not have required role`);
      return res.status(403).json({ message: 'Not authorized to access this route' });
    }
    logger.info(`User ${req.user._id} authorized for role: ${req.user.role}`);
    next();
  };
};

module.exports = { protect, authorize };
