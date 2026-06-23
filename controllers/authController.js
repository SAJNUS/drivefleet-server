function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

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

module.exports = {
  logout,
  getProtected,
};