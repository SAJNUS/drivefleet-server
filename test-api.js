require('dotenv').config();
const { connectDB, getDB } = require('./config/db');

async function test() {
  await connectDB();
  const db = getDB();
  const cars = db.collection('cars');
  const car = await cars.findOne({});
  console.log("Type of _id:", typeof car._id, car._id.constructor.name);
  process.exit(0);
}
test();
