const { ObjectId } = require('mongodb');

const { getCarsCollection } = require('../collections/carCollection');

function getCarIdFilter(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid car id');
  }

  return { _id: new ObjectId(id) };
}

async function getAllCars(searchQuery = '') {
  try {
    const carsCollection = getCarsCollection();
    let query = {};
    if (searchQuery) {
      query = { carName: { $regex: searchQuery, $options: 'i' } };
    }
    return await carsCollection.find(query).toArray();
  } catch (error) {
    throw new Error(`Failed to fetch cars: ${error.message}`);
  }
}

async function getCarsByOwner(email, searchQuery = '') {
  try {
    const carsCollection = getCarsCollection();
    let query = { ownerEmail: email };
    if (searchQuery) {
      query.$or = [
        { carName: { $regex: searchQuery, $options: 'i' } },
        { carType: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    return await carsCollection.find(query).toArray();
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

async function incrementCarBookingCount(id) {
  try {
    const carsCollection = getCarsCollection();
    const filter = getCarIdFilter(id);

    console.log(`[DEBUG] incrementCarBookingCount called with carId: ${id}`);
    console.log(`[DEBUG] Target filter:`, filter);

    const result = await carsCollection.findOneAndUpdate(
      filter,
      { $inc: { bookingCount: 1 } },
      { returnDocument: 'after' }
    );
    
    console.log(`[DEBUG] Update result (findOneAndUpdate):`, result);
    
    return result;
  } catch (error) {
    console.error(`[ERROR] Failed to increment car booking count:`, error);
    throw new Error(`Failed to increment car booking count: ${error.message}`);
  }
}

module.exports = {
  getAllCars,
  getCarsByOwner,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  incrementCarBookingCount,
};