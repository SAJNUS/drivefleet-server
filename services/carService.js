const { ObjectId } = require('mongodb');

const { getCarsCollection } = require('../collections/carCollection');

function getCarIdFilter(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid car id');
  }

  return { _id: new ObjectId(id) };
}

async function getAllCars() {
  try {
    const carsCollection = getCarsCollection();
    return await carsCollection.find({}).toArray();
  } catch (error) {
    throw new Error(`Failed to fetch cars: ${error.message}`);
  }
}

async function getCarsByOwner(email) {
  try {
    const carsCollection = getCarsCollection();
    return await carsCollection.find({ ownerEmail: email }).toArray();
  } catch (error) {
    throw new Error(`Failed to fetch cars by owner: ${error.message}`);
  }
}

async function getCarById(id) {
  try {
    const carsCollection = getCarsCollection();
    return await carsCollection.findOne(getCarIdFilter(id));
  } catch (error) {
    throw new Error(`Failed to fetch car by id: ${error.message}`);
  }
}

async function createCar(carData) {
  try {
    const carsCollection = getCarsCollection();
    const result = await carsCollection.insertOne(carData);

    return await carsCollection.findOne({ _id: result.insertedId });
  } catch (error) {
    throw new Error(`Failed to create car: ${error.message}`);
  }
}

async function updateCar(id, updatedData) {
  try {
    const carsCollection = getCarsCollection();
    const filter = getCarIdFilter(id);

    const result = await carsCollection.updateOne(filter, { $set: updatedData });

    if (result.matchedCount === 0) {
      return null;
    }

    return await carsCollection.findOne(filter);
  } catch (error) {
    throw new Error(`Failed to update car: ${error.message}`);
  }
}

async function deleteCar(id) {
  try {
    const carsCollection = getCarsCollection();
    const filter = getCarIdFilter(id);

    const result = await carsCollection.deleteOne(filter);

    return result.deletedCount > 0;
  } catch (error) {
    throw new Error(`Failed to delete car: ${error.message}`);
  }
}

module.exports = {
  getAllCars,
  getCarsByOwner,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};