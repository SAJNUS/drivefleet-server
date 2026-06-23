const express = require('express');

const { createJwt, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/jwt', createJwt);
router.post('/logout', logout);

module.exports = router;