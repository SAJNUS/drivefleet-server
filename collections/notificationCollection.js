const { getDB } = require('../config/db');

const COLLECTION_NAME = 'notifications';

function getNotificationsCollection() {
  const db = getDB();

  if (!db) {
    throw new Error('Database is not connected. Call connectDB() before accessing notifications collection.');
  }

  return db.collection(COLLECTION_NAME);
}

module.exports = {
  getNotificationsCollection,
};
