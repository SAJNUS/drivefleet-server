const {
  getAllCars,
  getCarsByOwner,
  getCarById: fetchCarById,
  createCar: addCar,
  updateCar: modifyCar,
  deleteCar: removeCar,
} = require('../services/carService');

function handleCarError(res, error, fallbackMessage) {
  const isInvalidCarId = error.message.includes('Invalid car id');
  const statusCode = isInvalidCarId ? 400 : 500;

  return res.status(statusCode).json({
    success: false,
    message: fallbackMessage || error.message,
    data: null,
  });
}

async function getCars(req, res) {
  try {
    const { email } = req.query;
    const cars = email ? await getCarsByOwner(email) : await getAllCars();

    return res.status(200).json({
      success: true,
      message: 'Cars retrieved successfully',
      data: cars,
    });
  } catch (error) {
    return handleCarError(res, error, 'Failed to retrieve cars');
  }
}

async function getCarById(req, res) {
  try {
    const car = await fetchCarById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Car retrieved successfully',
      data: car,
    });
  } catch (error) {
    return handleCarError(res, error, 'Failed to retrieve car');
  }
}

async function createCar(req, res) {
  try {
    const car = await addCar(req.body);

    return res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: car,
    });
  } catch (error) {
    return handleCarError(res, error, 'Failed to create car');
  }
}

async function updateCar(req, res) {
  try {
    const car = await modifyCar(req.params.id, req.body);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      data: car,
    });
  } catch (error) {
    return handleCarError(res, error, 'Failed to update car');
  }
}

async function deleteCar(req, res) {
  try {
    const deleted = await removeCar(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Car deleted successfully',
      data: {
        id: req.params.id,
      },
    });
  } catch (error) {
    return handleCarError(res, error, 'Failed to delete car');
  }
}

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};