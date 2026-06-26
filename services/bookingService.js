const { ObjectId } = require('mongodb');

const { getBookingsCollection } = require('../collections/bookingCollection');

function mapBookingStatus(booking) {
  if (!booking || booking.bookingStatus === 'Cancelled') return booking;

  const today = new Date().toISOString().split('T')[0];
  if (today > booking.endDate) {
    booking.bookingStatus = 'Completed';
  } else {
    booking.bookingStatus = 'Upcoming';
  }
  return booking;
}

function getBookingIdFilter(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid booking id');
  }

  return { _id: new ObjectId(id) };
}

async function getAllBookings() {
  try {
    const bookingsCollection = getBookingsCollection();
    const bookings = await bookingsCollection.find({}).toArray();
    return bookings.map(mapBookingStatus);
  } catch (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
}

async function getBookingById(id) {
  try {
    const bookingsCollection = getBookingsCollection();
    const booking = await bookingsCollection.findOne(getBookingIdFilter(id));
    return mapBookingStatus(booking);
  } catch (error) {
    throw new Error(`Failed to fetch booking by id: ${error.message}`);
  }
}

async function createBooking(bookingData) {
  try {
    const bookingsCollection = getBookingsCollection();
    const result = await bookingsCollection.insertOne(bookingData);

    const booking = await bookingsCollection.findOne({ _id: result.insertedId });
    return mapBookingStatus(booking);
  } catch (error) {
    throw new Error(`Failed to create booking: ${error.message}`);
  }
}

async function getBookingsByRenter(email) {
  try {
    const bookingsCollection = getBookingsCollection();
    const bookings = await bookingsCollection
      .find({ renterEmail: email })
      .sort({ bookingDate: -1 })
      .toArray();
    return bookings.map(mapBookingStatus);
  } catch (error) {
    throw new Error(`Failed to fetch bookings by renter: ${error.message}`);
  }
}

async function getBookingsByOwner(email) {
  try {
    const bookingsCollection = getBookingsCollection();
    const bookings = await bookingsCollection
      .find({ ownerEmail: email })
      .sort({ bookingDate: -1 })
      .toArray();
    return bookings.map(mapBookingStatus);
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

    const booking = await bookingsCollection.findOne(filter);
    return mapBookingStatus(booking);
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