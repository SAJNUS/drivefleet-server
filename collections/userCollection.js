const { getDB } = require('../config/db');

function getUsersCollection() {
  const db = getDB();
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db.collection('users');
}

module.exports = { getUsersCollection };
