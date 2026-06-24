const admin = require('./config/firebase');
const { getAuth } = require('firebase-admin/auth');

async function test() {
  try {
    await getAuth().verifyIdToken('fake-token');
  } catch (error) {
    console.log("ERROR IS:");
    console.log(error);
  }
}
test();
