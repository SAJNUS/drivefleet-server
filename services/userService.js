const { getUsersCollection } = require('../collections/userCollection');
const { getCarsCollection } = require('../collections/carCollection');
const { getBookingsCollection } = require('../collections/bookingCollection');

async function getUserProfile(email) {
  try {
    const usersCollection = getUsersCollection();
    const user = await usersCollection.findOne({ email });
    return user || { email, mobileNumber: '', location: '' };
  } catch (error) {
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
}

async function upsertUserProfile(email, data) {
  try {
    const usersCollection = getUsersCollection();
    const result = await usersCollection.findOneAndUpdate(
      { email },
      { $set: data },
      { upsert: true, returnDocument: 'after' }
    );
    return result;
  } catch (error) {
    throw new Error(`Failed to upsert user profile: ${error.message}`);
  }
}

async function getUserStats(email) {
  try {
    const carsCollection = getCarsCollection();
    const bookingsCollection = getBookingsCollection();

    const totalCars = await carsCollection.countDocuments({ ownerEmail: email });
    const totalBookings = await bookingsCollection.countDocuments({ renterEmail: email });

    const earningsResult = await bookingsCollection.aggregate([
      { $match: { ownerEmail: email, bookingStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totalCost' } } }
    ]).toArray();
    const totalEarnings = earningsResult.length > 0 ? earningsResult[0].total : 0;

    const spentResult = await bookingsCollection.aggregate([
      { $match: { renterEmail: email } },
      { $group: { _id: null, total: { $sum: '$totalCost' } } }
    ]).toArray();
    const totalSpent = spentResult.length > 0 ? spentResult[0].total : 0;

    return {
      totalCars,
      totalBookings,
      totalEarnings,
      totalSpent
    };
  } catch (error) {
    throw new Error(`Failed to fetch user stats: ${error.message}`);
  }
}

module.exports = {
  getUserProfile,
  upsertUserProfile,
  getUserStats,
};
