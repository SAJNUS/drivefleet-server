function getCars(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Temporary mock response for GET /cars',
    data: [],
  });
}

function getCarById(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Temporary mock response for GET /cars/:id',
    data: {
      id: req.params.id,
    },
  });
}

function createCar(req, res) {
  return res.status(201).json({
    success: true,
    message: 'Temporary mock response for POST /cars',
    data: req.body,
  });
}

function updateCar(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Temporary mock response for PUT /cars/:id',
    data: {
      id: req.params.id,
      ...req.body,
    },
  });
}

function deleteCar(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Temporary mock response for DELETE /cars/:id',
    data: {
      id: req.params.id,
    },
  });
}

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};