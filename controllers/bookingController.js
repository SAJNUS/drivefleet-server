const {
  getAllBookings,
  getBookingsByRenter,
  getBookingsByOwner,
  getBookingById: fetchBookingById,
  createBooking: addBooking,
  updateBooking: modifyBooking,
  deleteBooking: removeBooking,
} = require('../services/bookingService');

const {
  getCarById,
  updateCar,
} = require('../services/carService');

const {
  createNotification
} = require('../services/notificationService');

const { logActivity } = require('../services/activityService');

const { getIO } = require('../config/socket');

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
// GET /bookings?ownerEmail=x  → bookings for a specific owner
async function getBookings(req, res) {
  try {
    const { email, ownerEmail } = req.query;

    if (email) {
      if (!req.user || req.user.email !== email) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only view your own bookings',
          data: null,
        });
      }
    }

    if (ownerEmail) {
      if (!req.user || req.user.email !== ownerEmail) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only view your own car bookings',
          data: null,
        });
      }
    }

    let bookings = [];
    if (email) {
      bookings = await getBookingsByRenter(email);
    } else if (ownerEmail) {
      bookings = await getBookingsByOwner(ownerEmail);
    } else {
      bookings = await getAllBookings();
    }

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
      driverNeeded,
      specialNote,
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
      renterEmail: req.user.email,
      bookingDate: new Date().toISOString(),
      startDate,
      endDate,
      totalCost,
      bookingStatus: 'Upcoming',
      driverNeeded: driverNeeded ?? false,
      specialNote: specialNote ?? '',
    };

    const booking = await addBooking(bookingDocument);

    const renterName = req.user.name || 'Someone';
    const notif = await createNotification({
      ownerEmail: bookingDocument.ownerEmail,
      type: 'BOOKING',
      message: `${renterName} booked your ${bookingDocument.carName}.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    getIO().to(bookingDocument.ownerEmail).emit('new_notification', notif);

    await logActivity({
      userEmail: req.user.email,
      type: 'BLUE',
      message: `You booked ${bookingDocument.carName}`,
      relatedCarId: bookingDocument.carId,
      relatedCarName: bookingDocument.carName
    });

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
    const existingBooking = await fetchBookingById(req.params.id);

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
        data: null,
      });
    }

    if (existingBooking.renterEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own bookings',
        data: null,
      });
    }

    const deleted = await removeBooking(req.params.id);

    const renterName = req.user.name || 'Someone';
    const notif = await createNotification({
      ownerEmail: existingBooking.ownerEmail,
      type: 'CANCELLED',
      message: `${renterName} cancelled the booking for ${existingBooking.carName}.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    getIO().to(existingBooking.ownerEmail).emit('new_notification', notif);

    await logActivity({
      userEmail: req.user.email,
      type: 'RED',
      message: `You cancelled your booking for ${existingBooking.carName}`,
      relatedCarId: existingBooking.carId,
      relatedCarName: existingBooking.carName
    });

    return res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    return handleBookingError(res, error, 'Failed to delete booking');
  }
}

async function completeBooking(req, res) {
  try {
    const existingBooking = await fetchBookingById(req.params.id);

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
        data: null,
      });
    }

    if (existingBooking.renterEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only complete your own bookings',
        data: null,
      });
    }

    if (existingBooking.bookingStatus === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already completed',
        data: null,
      });
    }

    const { rating } = req.body;
    let newAverageRating = null;

    if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
      const car = await getCarById(existingBooking.carId);
      if (car) {
        const currentRatingCount = car.ratingCount || 0;
        const currentAverage = car.rating || 0;
        const newRatingCount = currentRatingCount + 1;
        const calculatedAverage = ((currentAverage * currentRatingCount) + rating) / newRatingCount;
        newAverageRating = Math.round(calculatedAverage * 10) / 10;

        await updateCar(existingBooking.carId, {
          rating: newAverageRating,
          ratingCount: newRatingCount,
        });
      }
    }

    const updatedBooking = await modifyBooking(req.params.id, {
      bookingStatus: 'Completed',
    });

    const renterName = req.user.name || 'Someone';
    const now = new Date().toISOString();
    
    const notif1 = await createNotification({
      ownerEmail: existingBooking.ownerEmail,
      type: 'COMPLETED',
      message: `${renterName} completed the trip for ${existingBooking.carName}.`,
      isRead: false,
      createdAt: now,
    });
    getIO().to(existingBooking.ownerEmail).emit('new_notification', notif1);
    
    const notif2 = await createNotification({
      ownerEmail: existingBooking.ownerEmail,
      type: 'EARNINGS',
      message: `BDT ${existingBooking.totalCost.toLocaleString()} has been added to your earnings.`,
      isRead: false,
      createdAt: now,
    });
    getIO().to(existingBooking.ownerEmail).emit('new_notification', notif2);

    await logActivity({
      userEmail: req.user.email,
      type: 'GREEN',
      message: `Your trip with ${existingBooking.carName} was completed`,
      relatedCarId: existingBooking.carId,
      relatedCarName: existingBooking.carName
    });

    return res.status(200).json({
      success: true,
      message: 'Booking completed successfully',
      data: updatedBooking,
    });
  } catch (error) {
    return handleBookingError(res, error, 'Failed to complete booking');
  }
}

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  completeBooking,
  deleteBooking,
};