const express = require('express');

const { getHealthCheck } = require('../controllers/healthController');

const router = express.Router();

router.get('/', getHealthCheck);

module.exports = router;