const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://drivefleet_admin:Drivefleet2026@cluster0.q0d5wz7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();