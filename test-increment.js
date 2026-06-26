require('dotenv').config();
const { connectDB, getDB } = require('./config/db');
const { getCarsCollection } = require('./collections/carCollection');
const { incrementCarBookingCount } = require('./services/carService');

async function test() {
  await connectDB();
  const db = getDB();
  const cars = db.collection('cars');
  const car = await cars.findOne({});
  if (!car) {
    console.log("No cars found");
    process.exit(0);
  }
  console.log("Car before:", car._id, car.bookingCount);
  
  const updatedCar = await incrementCarBookingCount(car._id.toString(), 1);
  console.log("Updated car:", updatedCar._id, updatedCar.bookingCount);
  
  const verifyCar = await cars.findOne({ _id: car._id });
  console.log("Car after in DB:", verifyCar._id, verifyCar.bookingCount);
  
  process.exit(0);
}
test();
