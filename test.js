const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://drivefleet_admin:drivefleet_admin_231102@cluster0.q0d5wz7.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

run();