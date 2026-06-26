require('dotenv').config();
const { connectDB, getDB } = require('./config/db');
const { getCarsCollection } = require('./collections/carCollection');
const bookingController = require('./controllers/bookingController');
const carService = require('./services/carService');

async function test() {
  await connectDB();
  const db = getDB();
  const cars = db.collection('cars');
  const car = await cars.findOne({});
  if (!car) {
    console.log("No cars found");
    return;
  }
  
  console.log("Testing with car:", car._id);
  
  // mock req, res
  const req = {
    user: { email: 'testrenter@example.com', name: 'Test Renter' },
    body: {
      carId: car._id.toString(),
      carName: car.carModel,
      carImage: 'img',
      pickupLocation: 'loc',
      ownerEmail: car.ownerEmail,
      renterEmail: 'testrenter@example.com',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      totalCost: 100
    }
  };
  
  const res = {
    status: function(s) {
      console.log("Status:", s);
      return this;
    },
    json: function(j) {
      console.log("JSON:", JSON.stringify(j));
      return this;
    }
  };
  
  await bookingController.createBooking(req, res);
  
  const updatedCar = await cars.findOne({ _id: car._id });
  console.log("Car bookingCount after API call:", updatedCar.bookingCount);
  
  process.exit(0);
}

test();
