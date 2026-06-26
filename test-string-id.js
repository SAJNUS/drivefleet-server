require('dotenv').config();
const { connectDB, getDB } = require('./config/db');

async function test() {
  await connectDB();
  const db = getDB();
  const cars = db.collection('cars');
  const allCars = await cars.find({}).toArray();
  let stringIdCount = 0;
  for (const car of allCars) {
    if (typeof car._id === 'string') {
      console.log("String _id found:", car._id);
      stringIdCount++;
    }
  }
  console.log("Total cars:", allCars.length, "String IDs:", stringIdCount);
  process.exit(0);
}
test();
