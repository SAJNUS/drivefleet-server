const {
  getNotificationsByOwner,
  markAllAsRead,
} = require('../services/notificationService');

async function getNotifications(req, res) {
  try {
    const ownerEmail = req.user.email;
    const notifications = await getNotificationsByOwner(ownerEmail);

    return res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
      data: null,
    });
  }
}

async function markNotificationsRead(req, res) {
  try {
    const ownerEmail = req.user.email;
    await markAllAsRead(ownerEmail);

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read',
      data: null,
    });
  }
}

module.exports = {
  getNotifications,
  markNotificationsRead,
};
