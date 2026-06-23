const { getDB } = require('../config/db');

const COLLECTION_NAME = 'cars';

function getCarsCollection() {
  const db = getDB();

  if (!db) {
    throw new Error('Database is not connected. Call connectDB() before accessing cars collection.');
  }

  return db.collection(COLLECTION_NAME);
}

module.exports = {
  getCarsCollection,
};
