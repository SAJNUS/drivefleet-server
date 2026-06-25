const { getNotificationsCollection } = require('../collections/notificationCollection');

async function createNotification(notificationDocument) {
  const collection = getNotificationsCollection();
  const result = await collection.insertOne(notificationDocument);
  return { _id: result.insertedId, ...notificationDocument };
}

async function getNotificationsByOwner(ownerEmail) {
  const collection = getNotificationsCollection();
  // Return the latest 50 notifications, descending by createdAt
  return await collection.find({ ownerEmail }).sort({ createdAt: -1 }).limit(50).toArray();
}

async function markAllAsRead(ownerEmail) {
  const collection = getNotificationsCollection();
  const result = await collection.updateMany(
    { ownerEmail, isRead: false },
    { $set: { isRead: true } }
  );
  return result.modifiedCount;
}

module.exports = {
  createNotification,
  getNotificationsByOwner,
  markAllAsRead,
};
