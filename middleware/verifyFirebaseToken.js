const admin = require('../config/firebase');
const { getAuth } = require('firebase-admin/auth');

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided',
    });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    console.log('--- verifyFirebaseToken Debug ---');
    console.log('Token received:', !!token);
    console.log('Token length:', token ? token.length : 0);
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;
    return next();
  } catch (error) {
    console.error('--- verifyFirebaseToken Error ---');
    console.error('Firebase token verification error message:', error.message);
    const fs = require('fs');
    fs.writeFileSync('/Users/sajnus/Desktop/drivefleet-server/firebase-error.log', JSON.stringify({
      message: error.message,
      code: error.code,
      stack: error.stack
    }, null, 2));
    
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
    });
  }
}

module.exports = {
  verifyFirebaseToken,
};
