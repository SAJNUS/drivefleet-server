const { isDBConnected } = require('../config/db');

function getHealthCheck(req, res) {
  if (!isDBConnected()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB Not Connected',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'MongoDB Connected',
  });
}

module.exports = {
  getHealthCheck,
};