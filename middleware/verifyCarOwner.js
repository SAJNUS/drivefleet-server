function verifyCarOwner(req, res, next) {
  const currentUserEmail = req.user?.email;
  const ownerEmail = req.query.ownerEmail || req.body?.ownerEmail || req.params?.ownerEmail;

  if (currentUserEmail && ownerEmail && currentUserEmail === ownerEmail) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Forbidden',
  });
}

module.exports = {
  verifyCarOwner,
};