const express = require('express');

const { createJwtMiddleware } = require('../middleware/jwt');
const { verifyToken } = require('../middleware/verifyToken');
const { logout, getProtected } = require('../controllers/authController');

const router = express.Router();

router.post('/jwt', createJwtMiddleware, (req, res) => {
	return res.status(200).json({
		success: true,
		message: 'JWT created successfully',
		user: req.user,
	});
});
router.post('/logout', logout);
router.get('/protected', verifyToken, getProtected);

module.exports = router;