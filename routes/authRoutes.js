const express = require('express');

const { createJwtMiddleware } = require('../middleware/jwt');
const { verifyToken } = require('../middleware/verifyToken');
const { verifyAdmin } = require('../middleware/verifyAdmin');
const { verifyCarOwner } = require('../middleware/verifyCarOwner');
const {
	logout,
	getProtected,
	getAdminTest,
	getOwnerTest,
} = require('../controllers/authController');

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
router.get('/admin-test', verifyToken, verifyAdmin, getAdminTest);
router.get('/owner-test', verifyToken, verifyCarOwner, getOwnerTest);

module.exports = router;