const { generateToken } = require('../services/authService');

function createJwtMiddleware(req, res, next) {
  const { email, role = 'user' } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
    });
  }

  const payload = { email, role };
  let token;

  try {
    token = generateToken(payload);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 60 * 60 * 1000,
  });

  req.user = payload;
  req.token = token;

  return next();
}

module.exports = {
  createJwtMiddleware,
};