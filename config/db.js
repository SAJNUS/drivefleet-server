const { MongoClient, ServerApiVersion } = require('mongodb');

const databaseName = 'drivefleetDB';

let client;
let database;

function buildMongoUri() {
  const { DB_USER, DB_PASS, MONGO_CLUSTER, MONGO_URI } = process.env;

  if (MONGO_URI) {
    return MONGO_URI;
  }

  if (!DB_USER || !DB_PASS || !MONGO_CLUSTER) {
    throw new Error('Missing MongoDB Atlas environment variables');
  }

  const encodedUser = encodeURIComponent(DB_USER);
  const encodedPass = encodeURIComponent(DB_PASS);

  return `mongodb+srv://${encodedUser}:${encodedPass}@${MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=DriveFleet`;
}

async function connectDB() {
  if (database) {
    return database;
  }

  const uri = buildMongoUri();

  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  await client.connect();
  database = client.db(databaseName);

  return database;
}

function getDB() {
  return database;
}

function isDBConnected() {
  return Boolean(database);
}

module.exports = {
  connectDB,
  getDB,
  isDBConnected,
};