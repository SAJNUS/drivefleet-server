const { getActivitiesCollection } = require('../collections/activityCollection');

async function logActivity({ userEmail, type, message, relatedCarId, relatedCarName }) {
  try {
    if (!userEmail || !type || !message) return null;
    
    const activitiesCollection = getActivitiesCollection();
    const activityDocument = {
      userEmail,
      type,
      message,
      relatedCarId: relatedCarId || null,
      relatedCarName: relatedCarName || null,
      createdAt: new Date().toISOString()
    };
    
    const result = await activitiesCollection.insertOne(activityDocument);
    return await activitiesCollection.findOne({ _id: result.insertedId });
  } catch (error) {
    console.error(`Failed to log activity: ${error.message}`);
    // We don't throw here to avoid failing the main action (e.g. creating booking) if activity logging fails
    return null;
  }
}

async function getRecentActivities(userEmail, limit = 8) {
  try {
    const activitiesCollection = getActivitiesCollection();
    return await activitiesCollection
      .find({ userEmail })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  } catch (error) {
    throw new Error(`Failed to fetch activities: ${error.message}`);
  }
}

module.exports = {
  logActivity,
  getRecentActivities,
};
