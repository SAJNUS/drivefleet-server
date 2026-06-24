const { initializeApp } = require('firebase/app');
const { getAuth: getClientAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyCKpeWEC3AwwwZih9e5kQ3c8OKgG77oYdE",
  authDomain: "drivefleet-c8f98.firebaseapp.com",
  projectId: "drivefleet-c8f98"
};

const app = initializeApp(firebaseConfig);
const clientAuth = getClientAuth(app);

async function run() {
  try {
    const userCredential = await signInWithEmailAndPassword(clientAuth, 'test2@example.com', 'password123');
    const token = await userCredential.user.getIdToken();
    
    console.log("Got token, fetching /cars with it...");
    const fetch = require('node-fetch'); // or use native fetch in node 22
    const response = await global.fetch(`http://localhost:5050/cars?email=test2%40example.com`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Body:", text);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
