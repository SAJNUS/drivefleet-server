const { getDB } = require('../config/db');

const COLLECTION_NAME = 'bookings';

function getBookingsCollection() {
  const db = getDB();

  if (!db) {
    throw new Error('Database is not connected. Call connectDB() before accessing bookings collection.');
  }

  return db.collection(COLLECTION_NAME);
}

module.exports = {
  getBookingsCollection,
};
