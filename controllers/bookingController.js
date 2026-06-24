const {
  getAllBookings,
  getBookingsByRenter,
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

// GET /bookings          → all bookings (admin use)
// GET /bookings?email=x  → bookings for a specific renter
async function getBookings(req, res) {
  try {
    const { email } = req.query;

    const bookings = email
      ? await getBookingsByRenter(email)
      : await getAllBookings();

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
    const {
      carId,
      carName,
      carImage,
      pickupLocation,
      ownerEmail,
      renterEmail,
      startDate,
      endDate,
      totalCost,
    } = req.body;

    // ── Validation ─────────────────────────────────────────────────────────
    if (!carId || !renterEmail || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'carId, renterEmail, startDate, and endDate are required.',
        data: null,
      });
    }

    if (renterEmail === ownerEmail) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own car.',
        data: null,
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate must be valid dates.',
        data: null,
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'Return date must be after the pickup date.',
        data: null,
      });
    }

    if (typeof totalCost !== 'number' || totalCost <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Total cost must be a positive number.',
        data: null,
      });
    }

    // ── Build document ──────────────────────────────────────────────────────
    const bookingDocument = {
      carId,
      carName: carName ?? '',
      carImage: carImage ?? '',
      pickupLocation: pickupLocation ?? '',
      ownerEmail: ownerEmail ?? '',
      renterEmail,
      bookingDate: new Date().toISOString(),
      startDate,
      endDate,
      totalCost,
      bookingStatus: 'Upcoming',
    };

    const booking = await addBooking(bookingDocument);

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
      data: { id: req.params.id },
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