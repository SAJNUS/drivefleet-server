const { getDB } = require('../config/db');

function getActivitiesCollection() {
  const db = getDB();
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db.collection('activities');
}

module.exports = { getActivitiesCollection };
