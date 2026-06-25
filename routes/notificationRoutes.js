const express = require('express');
const {
  getNotifications,
  markNotificationsRead,
} = require('../controllers/notificationController');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');

const router = express.Router();

router.get('/', verifyFirebaseToken, getNotifications);
router.patch('/mark-read', verifyFirebaseToken, markNotificationsRead);

module.exports = router;
