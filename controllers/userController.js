const { getUserProfile, upsertUserProfile, getUserStats } = require('../services/userService');
const { getRecentActivities } = require('../services/activityService');

async function getProfileData(req, res) {
  try {
    const email = req.user.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'User email not found in token' });
    }

    const profile = await getUserProfile(email);
    const stats = await getUserStats(email);
    const activities = await getRecentActivities(email);

    return res.status(200).json({
      success: true,
      message: 'Profile data retrieved successfully',
      data: {
        profile,
        stats,
        activities
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile data: ' + error.message
    });
  }
}

async function updateProfile(req, res) {
  try {
    const email = req.user.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'User email not found in token' });
    }

    const { displayName, email: newEmail, photoURL } = req.body;
    
    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (newEmail !== undefined) updateData.email = newEmail;
    if (photoURL !== undefined) updateData.photoURL = photoURL;

    const updatedProfile = await upsertUserProfile(email, updateData);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile: ' + error.message
    });
  }
}

module.exports = {
  getProfileData,
  updateProfile
};
