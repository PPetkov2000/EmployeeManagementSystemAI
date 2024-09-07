module.exports = {
  cookie_auth: process.env.COOKIE_AUTH === 'true',
  jwt_secret: process.env.JWT_SECRET,
  jwt_expire: process.env.JWT_EXPIRE || 3600000, // 1 hour in milliseconds,
  email_verification: process.env.EMAIL_VERIFICATION === 'true'
};