function getBookings(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Temporary mock response for GET /bookings',
    data: [],
  });
}

function createBooking(req, res) {
  return res.status(201).json({
    success: true,
    message: 'Temporary mock response for POST /bookings',
    data: req.body,
  });
}

function deleteBooking(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Temporary mock response for DELETE /bookings/:id',
    data: {
      id: req.params.id,
    },
  });
}

module.exports = {
  getBookings,
  createBooking,
  deleteBooking,
};