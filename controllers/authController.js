function createJwt(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Temporary mock response for POST /jwt',
    data: req.body,
  });
}

function logout(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Temporary mock response for POST /logout',
  });
}

module.exports = {
  createJwt,
  logout,
};