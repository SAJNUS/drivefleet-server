const { ObjectId } = require('mongodb');

const { getBookingsCollection } = require('../collections/bookingCollection');

function getBookingIdFilter(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid booking id');
  }

  return { _id: new ObjectId(id) };
}

async function getAllBookings() {
  try {
    const bookingsCollection = getBookingsCollection();
    return await bookingsCollection.find({}).toArray();
  } catch (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
}

async function getBookingById(id) {
  try {
    const bookingsCollection = getBookingsCollection();
    return await bookingsCollection.findOne(getBookingIdFilter(id));
  } catch (error) {
    throw new Error(`Failed to fetch booking by id: ${error.message}`);
  }
}

async function createBooking(bookingData) {
  try {
    const bookingsCollection = getBookingsCollection();
    const result = await bookingsCollection.insertOne(bookingData);

    return await bookingsCollection.findOne({ _id: result.insertedId });
  } catch (error) {
    throw new Error(`Failed to create booking: ${error.message}`);
  }
}

async function getBookingsByRenter(email) {
  try {
    const bookingsCollection = getBookingsCollection();
    return await bookingsCollection
      .find({ renterEmail: email })
      .sort({ bookingDate: -1 })
      .toArray();
  } catch (error) {
    throw new Error(`Failed to fetch bookings by renter: ${error.message}`);
  }
}

async function getBookingsByOwner(email) {
  try {
    const bookingsCollection = getBookingsCollection();
    return await bookingsCollection
      .find({ ownerEmail: email })
      .sort({ bookingDate: -1 })
      .toArray();
  } catch (error) {
    throw new Error(`Failed to fetch bookings by owner: ${error.message}`);
  }
}

async function deleteBooking(id) {
  try {
    const bookingsCollection = getBookingsCollection();
    const filter = getBookingIdFilter(id);

    const result = await bookingsCollection.deleteOne(filter);

    return result.deletedCount > 0;
  } catch (error) {
    throw new Error(`Failed to delete booking: ${error.message}`);
  }
}

async function updateBooking(id, updatedData) {
  try {
    const bookingsCollection = getBookingsCollection();
    const filter = getBookingIdFilter(id);

    const result = await bookingsCollection.updateOne(filter, { $set: updatedData });

    if (result.matchedCount === 0) {
      return null;
    }

    return await bookingsCollection.findOne(filter);
  } catch (error) {
    throw new Error(`Failed to update booking: ${error.message}`);
  }
}

module.exports = {
  getAllBookings,
  getBookingsByRenter,
  getBookingsByOwner,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};