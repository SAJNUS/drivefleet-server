const express = require('express');

const {
  getBookings,
  createBooking,
  completeBooking,
  deleteBooking,
} = require('../controllers/bookingController');

const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');

const router = express.Router();

router.get('/', verifyFirebaseToken, getBookings);
router.post('/', verifyFirebaseToken, createBooking);
router.patch('/:id/complete', verifyFirebaseToken, completeBooking);
router.delete('/:id', verifyFirebaseToken, deleteBooking);

module.exports = router;