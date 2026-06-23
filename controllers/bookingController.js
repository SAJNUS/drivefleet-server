const {
  getAllBookings,
  getBookingById: fetchBookingById,
  createBooking: addBooking,
  deleteBooking: removeBooking,
} = require('../services/bookingService');

function handleBookingError(res, error, fallbackMessage) {
  const isInvalidBookingId = error.message.includes('Invalid booking id');
  const statusCode = isInvalidBookingId ? 400 : 500;

  return res.status(statusCode).json({
    success: false,
    message: fallbackMessage || error.message,
    data: null,
  });
}

async function getBookings(req, res) {
  try {
    const bookings = await getAllBookings();

    return res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings,
    });
  } catch (error) {
    return handleBookingError(res, error, 'Failed to retrieve bookings');
  }
}

async function getBookingById(req, res) {
  try {
    const booking = await fetchBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Booking retrieved successfully',
      data: booking,
    });
  } catch (error) {
    return handleBookingError(res, error, 'Failed to retrieve booking');
  }
}

async function createBooking(req, res) {
  try {
    const booking = await addBooking(req.body);

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    return handleBookingError(res, error, 'Failed to create booking');
  }
}

async function deleteBooking(req, res) {
  try {
    const deleted = await removeBooking(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: {
        id: req.params.id,
      },
    });
  } catch (error) {
    return handleBookingError(res, error, 'Failed to delete booking');
  }
}

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  deleteBooking,
};