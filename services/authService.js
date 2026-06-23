const jwt = require('jsonwebtoken');

function generateToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function clearTokenOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };
}

module.exports = {
  generateToken,
  clearTokenOptions,
};