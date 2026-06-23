const { clearTokenOptions } = require('../services/authService');

function logout(req, res) {
  res.clearCookie('token', clearTokenOptions());

  return res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
}

function getProtected(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Protected route accessed',
    user: req.user,
  });
}

function getAdminTest(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Admin access granted',
    user: req.user,
  });
}

function getOwnerTest(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Owner access granted',
    user: req.user,
    ownerEmail: req.query.ownerEmail,
  });
}

module.exports = {
  logout,
  getProtected,
  getAdminTest,
  getOwnerTest,
};