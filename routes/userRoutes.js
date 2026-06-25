const express = require('express');
const { getProfileData, updateProfile } = require('../controllers/userController');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');

const router = express.Router();

router.use(verifyFirebaseToken);

router.get('/profile', getProfileData);
router.put('/profile', updateProfile);

module.exports = router;
