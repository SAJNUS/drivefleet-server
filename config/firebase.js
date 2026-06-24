const admin = require('firebase-admin');

admin.initializeApp({
  // Since we only need to verify tokens (which uses public keys), 
  // we can initialize just with the projectId for local development.
  // In production, we would use credential: admin.credential.cert(serviceAccount)
  projectId: 'drivefleet-c8f98',
});

module.exports = admin;
