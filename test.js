const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://sajnussaharearhojayfa_db_user:RitkcSK9MiWTDZQg@drivefleetcluster.lr8qh1u.mongodb.net/?appName=DriveFleetCluster";

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB Connected!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();