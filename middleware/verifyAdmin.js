function verifyAdmin(req, res, next) {
  const userRole = req.user?.role;

  if (userRole === 'admin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Forbidden',
  });
}

module.exports = {
  verifyAdmin,
};