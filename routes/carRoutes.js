const express = require('express');

const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require('../controllers/carController');

const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');

const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.query.email) {
    return verifyFirebaseToken(req, res, next);
  }
  next();
}, getCars);
router.get('/:id', getCarById);
router.post('/', verifyFirebaseToken, createCar);
router.put('/:id', verifyFirebaseToken, updateCar);
router.delete('/:id', verifyFirebaseToken, deleteCar);

module.exports = router;